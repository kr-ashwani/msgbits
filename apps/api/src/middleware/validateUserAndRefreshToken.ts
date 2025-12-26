import { NextFunction, Request, Response } from "express";
import { authService, userJWTPayload } from "../service/database/auth/authService";
import { ClientResponse } from "../utils/clientResponse";
import { ResponseUserSchema } from "../schema/responseSchema";

// Middleware to validate user from auth token and refresh token if it's about to expire
// Sets req.authUser if valid token is found
async function validateUserAndRefreshToken(req: Request, res: Response, next: NextFunction) {
  let user: ResponseUserSchema | null = null;
  let jwtPayload: userJWTPayload | null = null;
  const TWO_DAYS = 1000 * 60 * 60 * 24 * 2;

  // Try access token first (if API explicitly sends it)
  if (req.query.token) {
    try {
      ({ user, jwtPayload } = await authService.validateAccessToken(String(req.query.token)));
    } catch (_) {}
  }

  // Fallback to refresh token from cookies if no access-user found
  if (!user && req.cookies) {
    try {
      ({ user, jwtPayload } = await authService.validateRefreshToken(req.cookies));

      // If refresh token itself is near expiration, rotate it
      const timeDiff = jwtPayload.exp! * 1000 - Date.now();
      if (timeDiff > 0 && timeDiff <= TWO_DAYS) {
        new ClientResponse(res).sendJWTRefreshToken(jwtPayload);
      }
    } catch (_) {}
  }

  // Attach authenticated user for protectedRoutes middleware
  if (user && jwtPayload) {
    req.authUser = user;
  }

  return next(); // soft authentication
}

export default validateUserAndRefreshToken;
