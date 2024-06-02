import { HydratedDocument } from "mongoose";
import { IUser } from "../../model/user.model";
import { userDAO } from "../../Dao/UserDAO";
import { UserRowMapper } from "../../Dao/RowMapper/UserRowMapper";
import { OTPSchema } from "../../schema/user/OTPSchema";
import { clientRes } from "../../utilityClasses/clientResponse";

export async function verifyOTPService(input: OTPSchema) {
  try {
    const user: HydratedDocument<IUser>[] = [];
    /**
     * checks for email matches input email
     * account is not already verified
     * authCode is same as input otp
     * authCodeValidTime >= Date.now() (auth code is not expired)
     */
    await userDAO.update(
      {
        email: input.email,
        isVerified: false,
        authCode: input.otp,
        authCodeValidTime: { $gte: Date.now() },
      },
      {
        isVerified: true,
      },
      new UserRowMapper((data) => {
        user.push(data);
      })
    );
    const successRes = clientRes.createSuccessObj();
    const failureRes = clientRes.createErrorObj();
    // if previous update is successful then update query will return that user
    if (user.length === 1) {
      successRes.success = true;
      successRes.message = `user with email ${user[0].email} is now verified.`;
      successRes.data = {
        email: user[0].email,
        name: user[0].name,
        createdAt: user[0].createdAt.getTime(),
      };
      return successRes;
    }

    // if user update is unsuccessful, then find used by input email and check what wrong happened
    await userDAO.find(
      {
        email: input.email,
      },
      new UserRowMapper((data) => {
        user.push(data);
      })
    );

    if (user.length !== 1) failureRes.message = "User is not registered";
    else if (user[0].isVerified)
      failureRes.message = `User with email ${user[0].email} is already registered. Try logging in`;
    else if (user[0].authCode !== Number(input.otp)) failureRes.message = "OTP did not match";
    else if (user[0].authCodeValidTime <= Date.now()) failureRes.message = "OTP has expired";

    failureRes.error = failureRes.message;
    return failureRes;
  } catch (e: any) {
    throw new Error(e);
  }
}
