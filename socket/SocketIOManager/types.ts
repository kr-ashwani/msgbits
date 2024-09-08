import { z } from "zod";
import { ChatRoomDTO, ChatRoomDTOSchema } from "../../schema/chat/ChatRoomDTOSchema";
import { ChatUserDTOSchema } from "../../schema/chat/ChatUserDTOSchema";
import { MessageDTO, MessageDTOSchema } from "../../schema/chat/MessageDTOSchema";
import { SyncUpdateInputSchema } from "../../schema/chat/SyncUpdateInputSchema";

export interface ChatRoomEmitterMapping {}

export interface MessageEmitterMapping {}

export interface SyncEmitterMapping {
  "sync-update": string;
  "sync-updateChatRoomAndMessages": {
    chatRoom: ChatRoomDTO[];
    message: { [p in string]: MessageDTO[] };
  };
}

export type EmitterMapping = ChatRoomEmitterMapping & MessageEmitterMapping & SyncEmitterMapping;

const ChatRoomListenerSchema = {
  "chatroom-create": ChatRoomDTOSchema,
  "chatroom-update": ChatRoomDTOSchema,
  "chatroom-getall": z.array(ChatRoomDTOSchema),
};

const MessageListenerSchema = {
  "message-create": MessageDTOSchema,
  "message-update": MessageDTOSchema,
  "message-chatroom": z.record(z.string(), z.array(MessageDTOSchema)),
};
const ChatUserListenerSchema = {
  "chatuser-create": ChatUserDTOSchema,
  "chatuser-update": ChatUserDTOSchema,
  "chatuser-getall": z.array(ChatUserDTOSchema),
};
const SyncListenerSchema = {
  "sync-updateChatRoomAndMessages": SyncUpdateInputSchema,
};

const ListenerSchema = {
  ...ChatRoomListenerSchema,
  ...MessageListenerSchema,
  ...ChatUserListenerSchema,
  ...SyncListenerSchema,
};

export type ListenerSchema = typeof ListenerSchema;
export type ChatRoomListenerSchema = typeof ChatRoomListenerSchema;
export type MessageListenerSchema = typeof MessageListenerSchema;
export type ChatUserListenerSchema = typeof ChatUserListenerSchema;
export { ListenerSchema, ChatRoomListenerSchema, MessageListenerSchema, ChatUserListenerSchema };
