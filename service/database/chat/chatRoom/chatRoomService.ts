import { ChatRoomDTO } from "./../../../../schema/chat/ChatRoomDTOSchema";
import { IChatRoom } from "../../../../model/chatRoom.model";
import { chatRoomDAO } from "../../../../Dao/ChatRoomDAO";
import { ChatRoomRowMapper } from "../../../../Dao/RowMapper/ChatRoomRowMapper";

class ChatRoomService {
  async getUpdatedChatRoom(
    chatRoomId: string,
    updatedTimestamp: string
  ): Promise<ChatRoomDTO | null> {
    const chatRoomArr: IChatRoom[] = [];

    await chatRoomDAO.find(
      {
        chatRoomId,
        updatedAt: { $gt: updatedTimestamp },
      },
      new ChatRoomRowMapper((chatRoom) => {
        chatRoomArr.push(chatRoom.toObject());
      }),
      {
        sort: { createAt: 1 },
      }
    );

    return chatRoomArr.length ? this.convertIChatRoomToDTO(chatRoomArr[0]) : null;
  }

  //function overloads
  convertIChatRoomToDTO(chatRoom: IChatRoom): ChatRoomDTO;
  convertIChatRoomToDTO(chatRoom: IChatRoom[]): ChatRoomDTO[];

  //function implementations
  convertIChatRoomToDTO(chatRoom: IChatRoom | IChatRoom[]): ChatRoomDTO | ChatRoomDTO[] {
    if (Array.isArray(chatRoom)) {
      return chatRoom.map(this.convertSingleChatRoomToDTO);
    } else {
      return this.convertSingleChatRoomToDTO(chatRoom);
    }
  }
  private convertSingleChatRoomToDTO(chatRoom: IChatRoom): ChatRoomDTO {
    return {
      ...chatRoom,
      createdAt: chatRoom.createdAt.toISOString(),
      updatedAt: chatRoom.updatedAt.toISOString(),
      createdBy: chatRoom.createdBy.toString(),
    };
  }
}

const chatRoomService = new ChatRoomService();
export { chatRoomService };
