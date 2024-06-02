import { HydratedDocument } from "mongoose";
import { UserInput } from "./../../schema/user/userSchema";
import { omit } from "lodash";
import UserModel, { IUser } from "../../model/user.model";
import { userDAO } from "../../Dao/UserDAO";
import { UserRowMapper } from "../../Dao/RowMapper/UserRowMapper";
import { sendMail } from "../mail/sendMail";
import { clientRes } from "../../utilityClasses/clientResponse";

export async function createUser(input: UserInput) {
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
    return omit(
      user[0].toJSON(),
      "password",
      "_id",
      "__v",
      "isVerified",
      "authCode",
      "authCodeValidTime"
    );
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function findAndValidateUser(input: Omit<UserInput, "name">) {
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

    const successRes = clientRes.createSuccessObj();
    const failureRes = clientRes.createErrorObj();

    if (user.length !== 1) {
      failureRes.message = `User with email ${input.email} is not registered. Try signing up`;
      failureRes.error = failureRes.message;
      return failureRes;
    }

    const isValidUser = await user[0].comparePassword(input.password);
    //we are sure user will have atleast 1 element

    if (isValidUser) {
      successRes.data = omit(
        user[0].toJSON(),
        "password",
        "_id",
        "__v",
        "isVerified",
        "authCode",
        "authCodeValidTime"
      );
      successRes.message = "Login is sucessful";
      return successRes;
    } else {
      failureRes.message = `password did not match`;
      failureRes.error = failureRes.message;
      return failureRes;
    }
  } catch (e: any) {
    throw new Error(e);
  }
}
