import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";

import {
  loginApi,
  registerApi,
  logoutApi,
  getProfileApi,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
  type ApiResponse,
} from "../api/auth.api";
import {
  setUser,
  clearUser,
  clearAuthError,
} from "../state/auth.slice";
import type { RootState, AppDispatch } from "../../../app/store";
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from "../validators/auth.schema";
import { playArcadeSound } from "../../../shared/utils/arcadeAudio";

// Helper to extract error message safely
const parseApiError = (error: unknown, fallback: string): string => {
  const axiosErr = error as AxiosError<ApiResponse<null>>;
  return (
    axiosErr?.response?.data?.message ||
    axiosErr?.message ||
    fallback
  );
};

export const AUTH_QUERY_KEY = ["authUser"] as const;

/**
 * Core Auth Hook — Single entry point for auth server-state, client-state, and business logic
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const {
    user,
    isAuthenticated,
    isInitializing,
    isLoading: isReduxLoading,
    error: reduxError,
  } = useSelector((state: RootState) => state.auth);

  // ── Profile / Session Query (TanStack Query Server State - Rule 06) ──
  const profileQuery = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async ({ signal }) => {
      try {
        const { data } = await getProfileApi({ signal });
        dispatch(setUser(data.data));
        return data.data;
      } catch (err) {
        dispatch(clearUser());
        throw err;
      }
    },
    enabled: isInitializing, // Run once on init
    retry: false,
    staleTime: 1000 * 60 * 10,
  });

  // ── Login Mutation ──
  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await loginApi(payload);
      return response.data.data.user;
    },
    onSuccess: (authUser) => {
      dispatch(setUser(authUser));
      queryClient.setQueryData(AUTH_QUERY_KEY, authUser);
      playArcadeSound("success");
    },
    onError: (err) => {
      playArcadeSound("error");
      return parseApiError(err, "Login failed. Check your email & password.");
    },
  });

  // ── Register Mutation ──
  // NOTE: Registration does NOT auto-authenticate. The user must log in
  // separately to obtain a session token. We intentionally skip setUser /
  // queryClient updates so PublicRoute keeps them on the register page
  // and the success modal can render before redirecting to /login.
  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await registerApi(payload);
      return response.data.data;
    },
    onSuccess: () => {
      playArcadeSound("success");
    },
    onError: (err) => {
      playArcadeSound("error");
      return parseApiError(err, "Registration failed. Try a different email.");
    },
  });

  // ── Logout Mutation ──
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logoutApi();
    },
    onSuccess: () => {
      dispatch(clearUser());
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
      playArcadeSound("click");
    },
    onError: () => {
      // Force client clear even if server logout encountered network glitch
      dispatch(clearUser());
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
    },
  });

  const clearError = useCallback(() => {
    dispatch(clearAuthError());
    loginMutation.reset();
    registerMutation.reset();
  }, [dispatch, loginMutation, registerMutation]);

  const isAnyLoading =
    isReduxLoading ||
    loginMutation.isPending ||
    registerMutation.isPending ||
    logoutMutation.isPending;

  return {
    user,
    isAuthenticated,
    isInitializing: isInitializing && profileQuery.isLoading,
    isLoading: isAnyLoading,
    error:
      reduxError ||
      (loginMutation.error
        ? parseApiError(loginMutation.error, "Login failed")
        : null) ||
      (registerMutation.error
        ? parseApiError(registerMutation.error, "Registration failed")
        : null),
    loginMutation,
    registerMutation,
    logoutMutation,
    clearError,
  };
};

/**
 * Specialized hook for Login Form handling with React Hook Form + Zod + TanStack Query
 */
export const useLoginForm = (options?: {
  onSuccess?: (user: AuthUser) => void;
}) => {
  const { loginMutation } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const form: UseFormReturn<LoginFormValues> = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    try {
      const user = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });
      options?.onSuccess?.(user);
    } catch (err) {
      const message = parseApiError(
        err,
        "That email or blade password didn't match our arcade records."
      );
      setFormError(message);
      form.setError("root", { message });
    }
  });

  // Demo auto-fill helper
  const fillNinjaDemo = useCallback(() => {
    form.setValue("email", "ninja@slicestorm.com", { shouldValidate: true });
    form.setValue("password", "bladeMaster99", { shouldValidate: true });
    playArcadeSound("blip");
  }, [form]);

  return {
    ...form,
    onSubmit,
    isSubmitting: loginMutation.isPending,
    isSuccess: loginMutation.isSuccess,
    formError,
    fillNinjaDemo,
    clearFormError: () => setFormError(null),
  };
};

/**
 * Specialized hook for Registration Form handling with React Hook Form + Zod + TanStack Query
 */
export const useRegisterForm = (options?: {
  onSuccess?: (user: AuthUser) => void;
}) => {
  const { registerMutation } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const form: UseFormReturn<RegisterFormValues> = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    try {
      const user = await registerMutation.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      options?.onSuccess?.(user);
    } catch (err) {
      const message = parseApiError(
        err,
        "Failed to create player profile. That email might already be registered."
      );
      setFormError(message);
      form.setError("root", { message });
    }
  });

  // Random Gamer Tag Generator
  const generateRandomCallsign = useCallback(() => {
    const prefixes = [
      "Ninja",
      "Blade",
      "Fruit",
      "Storm",
      "Katana",
      "Juice",
      "Turbo",
      "Viper",
      "Zesty",
    ];
    const suffixes = [
      "Slayer",
      "Breaker",
      "Striker",
      "Master",
      "Slicer",
      "Frenzy",
      "Samurai",
      "Volt",
    ];
    const pre = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suf = suffixes[Math.floor(Math.random() * suffixes.length)];
    const num = Math.floor(Math.random() * 90) + 10;
    const tag = `${pre}${suf}${num}`;

    form.setValue("name", tag, { shouldValidate: true });
    playArcadeSound("blip");
  }, [form]);

  return {
    ...form,
    onSubmit,
    isSubmitting: registerMutation.isPending,
    isSuccess: registerMutation.isSuccess,
    formError,
    generateRandomCallsign,
    clearFormError: () => setFormError(null),
  };
};