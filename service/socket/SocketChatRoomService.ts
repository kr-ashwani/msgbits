import { ChatAddNewMember } from "../../schema/chat/ChatAddNewMemberSchema";
import { ChatRoomDTO } from "../../schema/chat/ChatRoomDTOSchema";
import { IOManager } from "../../socket/SocketIOManager/IOManager";
import { SocketManager } from "../../socket/SocketIOManager/SocketManager";
import { chatRoomService } from "../database/chat/chatRoom/chatRoomService";

export class SocketChatRoomService {
  private socket: SocketManager;
  private io: IOManager;

  constructor(socket: SocketManager, io: IOManager) {
    this.socket = socket;
    this.io = io;
    this.init();
  }
  init() {
    this.socket.on("chatroom-create", this.createChatUser);
    this.socket.on("chatroom-addNewMembers", this.addNewMember);
  }
  createChatUser = async (payload: ChatRoomDTO) => {
    const success = await chatRoomService.createChatRoom(payload);

    // now emit this chatRoomDTO to all participants
    payload.members.forEach((userId) => {
      this.socket.to(userId).emit("chatroom-create", payload);
    });
  };
  addNewMember = async (payload: ChatAddNewMember) => {
    const chatRoom = await chatRoomService.addNewMembers(payload);

    // now emit this chatRoomDTO to all participants
    if (chatRoom)
      chatRoom.members.forEach((userId) => {
        this.socket.to(userId).emit("chatroom-addNewMembers", payload);
      });
    else throw Error("Something went wrong while adding new members to chatRoom");
  };
}
