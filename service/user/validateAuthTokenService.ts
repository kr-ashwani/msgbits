import { ClientResponse } from "../../utilityClasses/clientResponse";
import { jwtService } from "../jwt/JwtService";
import { userService } from "./userService";

export async function validateAuthTokenService(cookie: any) {
  try {
    const res = new ClientResponse();
    if (!(cookie && cookie._auth_token))
      return res.createErrorObj(
        "unable to vaidate user. Try logging in",
        "Auth token in cookies is missing"
      );

    const jwtPayload = jwtService.verifyToken(String(cookie._auth_token));
    if (!jwtPayload)
      return res.createErrorObj("unable to vaidate user. Try logging in", "JWT token is tampered");

    const resObj = await userService.findUserByEmail({ email: jwtPayload.email });
    if (!resObj.success)
      return res.createErrorObj(
        "unable to vaidate user. Try logging in",
        `User with email ${jwtPayload.email} is not registered. Try signing up`
      );
    else {
      if (!resObj.data.originalUser.isVerified) {
        return res.createErrorObj(
          `User with email ${jwtPayload.email} is not verified`,
          `User with email ${jwtPayload.email} is not verified. Try signing up`
        );
      }
    }

    return res.createSuccessObj("User is authenticated successfully", {
      ...resObj.data,
      jwtPayload,
    });
  } catch (e: any) {
    throw new Error(e);
  }
}
