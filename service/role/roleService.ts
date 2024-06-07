import { omit } from "lodash";
import { HydratedDocument, Types } from "mongoose";
import { roleDAO } from "../../Dao/RoleDAO";
import { RoleRowMapper } from "../../Dao/RowMapper/RoleRowMapper";
import { IRole } from "../../model/role.model";
import { ClientResponse } from "../../utilityClasses/clientResponse";

class RoleService {
  async findAdminById(input: { userId: Types.ObjectId }) {
    try {
      const role: HydratedDocument<IRole>[] = [];
      await roleDAO.find(
        {
          userId: input.userId,
        },
        new RoleRowMapper((data) => {
          role.push(data);
        })
      );

      const response = new ClientResponse();

      if (role.length !== 1)
        return response.createErrorObj(
          `User has not associated role`,
          `User has not associated role`
        );

      return response.createSuccessObj("Role found", {
        userRole: omit(role[0].toJSON(), "_id", "__v"),
      });
    } catch (e: any) {
      throw new Error(e);
    }
  }
}

const roleService = new RoleService();
export { roleService };
