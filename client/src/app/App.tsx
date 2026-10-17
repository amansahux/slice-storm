import { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import router from "./routes/routes";
import { getProfile } from "../features/auth/state/auth.action";
import type { AppDispatch, RootState } from "./store";
import {
  startBackgroundMusic,
  stopBackgroundMusic,
  initAudio,
} from "../shared/utils/arcadeAudio";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Initial auth check on app load with abortable thunk (Rule 03 & Rule 07)
  useEffect(() => {
    const promise = dispatch(getProfile());

    return () => {
      promise.abort();
    };
  }, [dispatch]);

  // Background music management tied to user login session
  useEffect(() => {
    if (isAuthenticated && user) {
      startBackgroundMusic();

      // Modern browsers require a user interaction to resume AudioContext
      const handleUserInteraction = () => {
        initAudio();
        startBackgroundMusic();
        window.removeEventListener("pointerdown", handleUserInteraction);
        window.removeEventListener("keydown", handleUserInteraction);
      };

      window.addEventListener("pointerdown", handleUserInteraction);
      window.addEventListener("keydown", handleUserInteraction);

      return () => {
        window.removeEventListener("pointerdown", handleUserInteraction);
        window.removeEventListener("keydown", handleUserInteraction);
      };
    } else {
      stopBackgroundMusic();
    }
  }, [isAuthenticated, user]);

  return (
    <Suspense fallback={null}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
