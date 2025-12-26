import { useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  setAccessToken,
  resetAccessToken,
} from "@/lib/store/features/auth/authSlice";
import { fetchData } from "@/utils/custom/customFetch";
import z from "zod";
import { debug } from "../utils/custom/debug";
import { serverResWapperSchema } from "@/schema/ServerResWrapperSchema";

export function useTokenAutoRefresh() {
  const dispatch = useAppDispatch();

  const authUser = useAppSelector((s) => s.auth.user);
  const { accessToken, expiresAt } = useAppSelector((s) => s.auth.token);

  // ------- REFRESH TOKEN -------
  const refreshToken = useCallback(async () => {
    try {
      const res = await fetchData(
        "/getaccesstoken",
        serverResWapperSchema(z.string()),
      );

      if (!res.success) throw new Error(res.error);

      dispatch(setAccessToken(res.payload.data)); // reducer sets new expiresAt from token
    } catch (error) {
      debug(
        "error",
        "Access token refresh failed: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
      dispatch(resetAccessToken()); // logout / invalidate session
    }
  }, [dispatch]);

  // ------- AUTO SCHEDULER -------
  useEffect(() => {
    if (authUser == null) {
      dispatch(resetAccessToken());
      return;
    }

    const now = Date.now();
    const timeLeft = expiresAt - now;
    const refreshBefore = timeLeft - 30_000; // refresh 30s before expiry

    if (refreshBefore <= 0) {
      refreshToken(); // refresh immediately if needed
      return;
    }

    const timer = setTimeout(refreshToken, refreshBefore);
    return () => clearTimeout(timer);
  }, [accessToken, expiresAt, authUser, refreshToken, dispatch]);
}
