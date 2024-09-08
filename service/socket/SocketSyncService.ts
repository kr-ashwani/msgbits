import { IChatRoom } from "../../model/chatRoom.model";
import { ChatRoomDTO } from "../../schema/chat/ChatRoomDTOSchema";
import { MessageDTO } from "../../schema/chat/MessageDTOSchema";
import { SyncUpdateInput } from "../../schema/chat/SyncUpdateInputSchema";
import { IOManager } from "../../socket/SocketIOManager/IOManager";
import { SocketManager } from "../../socket/SocketIOManager/SocketManager";
import { chatRoomService } from "../database/chat/chatRoom/chatRoomService";
import { messageService } from "../database/chat/message/messageService";

export class SocketSyncService {
  private socket: SocketManager;
  private io: IOManager;

  constructor(socket: SocketManager, io: IOManager) {
    this.socket = socket;
    this.io = io;
  }
  init() {
    this.requestForSync();
    this.socket.on("sync-updateChatRoomAndMessages", this.updateChatRoomAndMessages);
  }
  private requestForSync() {
    this.socket.emit("sync-update", "ask for updates");
  }
  private async updateChatRoomAndMessages(payload: SyncUpdateInput) {
    const chatRoomOut: ChatRoomDTO[] = [];
    const messagesOut: { [p in string]: MessageDTO[] } = {};
    const out = payload.map(async (chatRoomMsgSync) => {
      const chatRoom = await chatRoomService.getUpdatedChatRoom(
        chatRoomMsgSync.chatRoomId,
        chatRoomMsgSync.lastUpdateTimestamp
      );
      chatRoom ? chatRoomOut.push(chatRoom) : null;
      const messages = await messageService.getUpdatedMessagesOfChatRoom(
        chatRoomMsgSync.chatRoomId,
        chatRoomMsgSync.lastMessageTimestamp
      );
      messagesOut[chatRoomMsgSync.chatRoomId] = messages;
    });
    await Promise.all(out);
    this.socket.emit("sync-updateChatRoomAndMessages", {
      chatRoom: chatRoomOut,
      message: messagesOut,
    });
  }
}
