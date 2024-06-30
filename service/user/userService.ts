import { userDoc } from "./../../Dao/UserDAO";
import { HydratedDocument } from "mongoose";
import { UserInput } from "./../../schema/user/userSchema";
import { IUser } from "../../model/user.model";
import { userDAO } from "../../Dao/UserDAO";
import { UserRowMapper } from "../../Dao/RowMapper/UserRowMapper";
import { sendMail } from "../mail/sendMail";
import { ClientResponse } from "../../utilityClasses/clientResponse";
import { MathUtil } from "../../utils/MathUtil";

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
    } catch (e: any) {
      throw new Error(e);
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

  async forgotPassword(input: { email: string }) {
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
        })
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
    } catch (e: any) {
      throw new Error(e);
    }
  }
}

const userService = new UserService();
export { userService };
