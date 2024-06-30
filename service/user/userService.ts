import { HydratedDocument } from "mongoose";
import { UserInput } from "./../../schema/user/userSchema";
import { IUser } from "../../model/user.model";
import { userDAO } from "../../Dao/UserDAO";
import { UserRowMapper } from "../../Dao/RowMapper/UserRowMapper";
import { sendMail } from "../mail/sendMail";
import { ClientResponse } from "../../utilityClasses/clientResponse";
import { MathUtil } from "../../utils/MathUtil";
import { IresetPassword } from "../../schema/user/resetPasswordSchema";
import { IforgotPassword } from "../../schema/user/forgotPasswordSchema";

class UserService {
  async createUser(input: UserInput) {
    try {
      const user: HydratedDocument<IUser>[] = [];
      await userDAO.create(
        input,
        new UserRowMapper((data) => {
          // send mail to successfull created account
          sendMail.sendOTPtoUser(data);
          user.push(data);
        })
      );
      //we are sure user will have atleast 1 element
      return user[0];
    } catch (err: any) {
      throw err;
    }
  }

  async findAndValidateUser(input: Omit<UserInput, "name">) {
    try {
      const res = await this.findUserByEmail({ email: input.email });

      if (!res.success) return res;
      const newRes = new ClientResponse();

      if (!res.data.user.isVerified)
        return newRes.createErrorObj(
          "Authentication Error",
          `User with email ${input.email} is not verified. Try signing up`
        );

      const isValidUser = await res.data.user.comparePassword(input.password);
      //we are sure user will have atleast 1 element

      if (isValidUser) return newRes.createSuccessObj(res.message, res.data.user);
      else return newRes.createErrorObj("Authentication Error", "password did not match");
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async findUserByEmail(input: { email: string }) {
    try {
      const user: HydratedDocument<IUser>[] = [];
      await userDAO.find(
        {
          email: input.email,
        },
        new UserRowMapper((data) => {
          user.push(data);
        })
      );

      const response = new ClientResponse();

      if (user.length !== 1)
        return response.createErrorObj(
          "Authentication Error",
          `User with email ${input.email} is not registered. Try signing up`
        );

      return response.createSuccessObj("User found", {
        user: user[0],
      });
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async forgotPassword(input: IforgotPassword["body"]) {
    try {
      const user: HydratedDocument<IUser>[] = [];
      await userDAO.update(
        {
          email: input.email,
          isVerified: true,
        },
        {
          authCode: MathUtil.generateRandomNumber(100000, 999999),
          authCodeValidTime: Date.now() + 30 * 60 * 1000,
          authCodeType: "ResetPassword",
        },
        new UserRowMapper((data) => {
          user.push(data);
        }),
        {
          new: true,
        }
      );

      const response = new ClientResponse();

      if (user.length !== 1)
        return response.createErrorObj(
          "Authentication Error",
          `User with email ${input.email} is not registered or verified. Try signing up`
        );

      //send password reset mail to userDoc
      sendMail.sendPasswordResetMail(user[0]);
      return response.createSuccessObj(
        "Password Reset mail sent",
        `Password reset mail has been successfully sent to ${input.email}. Follow the instructions in the email to reset your password.`
      );
    } catch (err: any) {
      throw err;
    }
  }

  async resetPassword(input: IresetPassword["body"]) {
    try {
      const user: HydratedDocument<IUser>[] = [];
      await userDAO.update(
        {
          email: input.email,
          isVerified: true,
          authCode: input.code,
          authCodeValidTime: { $gte: Date.now() },
          authCodeType: "ResetPassword",
        },
        {
          authCodeValidTime: 0,
        },
        new UserRowMapper((data) => {
          user.push(data);
        })
      );

      const response = new ClientResponse();
      // if previous query is successful then user will be returned
      if (user.length === 1) {
        //change password
        user[0].password = input.password;
        user[0].save();
        return response.createSuccessObj(
          `Password has been successfully changed. Please log in `,
          user[0]
        );
      }

      // if user update is unsuccessful, then find used by input email and check what went wrong
      await userDAO.find(
        {
          email: input.email,
        },
        new UserRowMapper((data) => {
          user.push(data);
        })
      );

      let failureMsg = "Something Went Wrong";
      if (user.length !== 1) failureMsg = "User is not registered.Try signing up";
      else if (!user[0].isVerified)
        failureMsg = `User with email ${user[0].email} is not verified. User must verify`;
      else if (user[0].authCode !== Number(input.code))
        failureMsg = "Authentication code is tampered";
      else if (user[0].authCodeValidTime <= Date.now())
        failureMsg = "Authentication code has expired";

      return response.createErrorObj("Authentication Error", failureMsg);
    } catch (err: any) {
      throw err;
    }
  }
}

const userService = new UserService();
export { userService };
