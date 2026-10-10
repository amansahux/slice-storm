import { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router";
import { useDispatch } from "react-redux";
import router from "./routes/routes";
import { getProfile } from "../features/auth/state/auth.action";
import type { AppDispatch } from "./store";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Initial auth check on app load with abortable thunk (Rule 03 & Rule 07)
  useEffect(() => {
    const promise = dispatch(getProfile());

    return () => {
      promise.abort();
    };
  }, [dispatch]);

  return (
    <Suspense fallback={null}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
