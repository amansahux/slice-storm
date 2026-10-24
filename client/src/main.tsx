import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "./app/store";
import App from "./app/App";
import "./app/App.css";
import { setOnAuthFailureCallback } from "./config/axiosInstance";
import { clearUser } from "./features/auth/state/auth.slice";

// QueryClient configuration adhering to Rule 06 (staleTime, gcTime, request deduplication)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes fresh
      gcTime: 1000 * 60 * 15, // 15 minutes cache retention
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Reset auth and clear cached queries when backend tokens expire or are unauthorized
setOnAuthFailureCallback(() => {
  store.dispatch(clearUser());
  queryClient.removeQueries({ queryKey: ["authUser"] });
});

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
);
