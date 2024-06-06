import { HydratedDocument } from "mongoose";
import { UserInput } from "./../../schema/user/userSchema";
import { omit } from "lodash";
import { IUser } from "../../model/user.model";
import { userDAO } from "../../Dao/UserDAO";
import { UserRowMapper } from "../../Dao/RowMapper/UserRowMapper";
import { sendMail } from "../mail/sendMail";
import { ClientResponse } from "../../utilityClasses/clientResponse";

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
    const res = await findUserByEmail({ email: input.email });

    if (!res.success) return res;

    const isValidUser = await res.data.originalUser.comparePassword(input.password);
    //we are sure user will have atleast 1 element

    const newRes = new ClientResponse();
    if (isValidUser) return newRes.createSuccessObj(res.message, res.data.trimmedUser);
    else return newRes.createErrorObj("password did not match", "password did not match");
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function findUserByEmail(input: { email: string }) {
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
        `User with email ${input.email} is not registered. Try signing up`,
        `User with email ${input.email} is not registered. Try signing up`
      );

    return response.createSuccessObj("User found", {
      originalUser: user[0],
      trimmedUser: omit(
        user[0].toJSON(),
        "password",
        "_id",
        "__v",
        "authCode",
        "authCodeValidTime",
        "comparePassword"
      ),
    });
  } catch (e: any) {
    throw new Error(e);
  }
}
