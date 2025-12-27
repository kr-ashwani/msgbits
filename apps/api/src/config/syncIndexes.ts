import logger from "../logger";
import ChatRoomModel from "../model/chatRoom.model";
import FileModel from "../model/file.model";
import MessageModel from "../model/message.model";
import UserModel from "../model/user.model";
import { UserRoleModel } from "../model/userRole.model";

export const syncAllIndexes = async () => {
  logger.info("Syncing database indexes...");
  await Promise.all([
    ChatRoomModel.syncIndexes(),
    FileModel.syncIndexes(),
    MessageModel.syncIndexes(),
    UserModel.syncIndexes(),
    UserRoleModel.syncIndexes(),
  ]);

  logger.info("Index sync completed.");
};
