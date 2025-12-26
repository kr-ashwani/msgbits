import config from "config";
import jwt from "jsonwebtoken";
import { userJWTPayload } from "../database/auth/authService";

class JwtService {
  private refresh_secret_key = config.get<string>("REFRESH_TOKEN_SECRET_KEY");
  private refresh_exp_time = config.get<number>("REFRESH_TOKEN_EXP_TIME");

  private access_secret_key = config.get<string>("ACCESS_TOKEN_SECRET_KEY");
  private access_exp_time = config.get<number>("ACCESS_TOKEN_EXP_TIME");
  verifyRefreshToken(token: string) {
    try {
      const jwtPayload = jwt.verify(token, this.refresh_secret_key);
      return jwtPayload as userJWTPayload;
    } catch (err) {
      return false;
    }
  }
  createRefreshToken(payload: userJWTPayload) {
    const refreshToken = jwt.sign(payload, this.refresh_secret_key, {
      expiresIn: this.refresh_exp_time,
    });
    return refreshToken;
  }
  verifyAccessToken(token: string) {
    try {
      const jwtPayload = jwt.verify(token, this.access_secret_key);
      return jwtPayload as userJWTPayload;
    } catch (err) {
      return false;
    }
  }
  createAccessToken(payload: userJWTPayload) {
    const accessToken = jwt.sign(payload, this.access_secret_key, {
      expiresIn: this.access_exp_time,
    });
    return accessToken;
  }
}

const jwtService = new JwtService();
export { jwtService };
