import { messageDAO } from "../../../../Dao/MessageDAO";
import { MessageRowMapper } from "../../../../Dao/RowMapper/MessageRowMapper";
import { IMessage } from "../../../../model/message.model";
import { MessageDTO } from "../../../../schema/chat/MessageDTOSchema";
import { fileService } from "../file/fileService";

class MessageService {
  async getUpdatedMessagesOfChatRoom(
    chatRoomId: string,
    lastUpdatedTimestamp: string
  ): Promise<MessageDTO[]> {
    const messageArr: IMessage[] = [];

    await messageDAO.find(
      {
        chatRoomId,
        updatedAt: { $gt: lastUpdatedTimestamp },
      },
      new MessageRowMapper((message) => {
        messageArr.push(message);
      }),
      {
        sort: { createAt: 1 },
      }
    );

    const messageDTO: MessageDTO[] = [];
    const output = await Promise.all(this.convertIChatRoomToDTO(messageArr));
    output.forEach((dto) => (dto ? messageDTO.push(dto) : null));
    return messageDTO;
  }

  //function overloads
  convertIChatRoomToDTO(chatRoom: IMessage): Promise<MessageDTO | null>;
  convertIChatRoomToDTO(chatRoom: IMessage[]): Promise<MessageDTO | null>[];

  //function implementations
  convertIChatRoomToDTO(
    message: IMessage | IMessage[]
  ): Promise<MessageDTO | null> | Promise<MessageDTO | null>[] {
    if (Array.isArray(message)) return message.map(this.convertSingleChatRoomToDTO);
    else return this.convertSingleChatRoomToDTO(message);
  }
  private async convertSingleChatRoomToDTO(message: IMessage): Promise<MessageDTO | null> {
    if (message.type === "file") {
      const file = await fileService.getFileById(message.fileId);
      return file
        ? {
            ...message,
            createdAt: message.createdAt.toISOString(),
            updatedAt: message.updatedAt.toISOString(),
            file,
          }
        : null;
    } else
      return {
        ...message,
        createdAt: message.createdAt.toISOString(),
        updatedAt: message.updatedAt.toISOString(),
      };
  }
}

const messageService = new MessageService();
export { messageService };
