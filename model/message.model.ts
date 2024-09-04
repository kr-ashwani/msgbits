import { Schema, model } from "mongoose";

// Base interface for all message types
interface IMessageBase {
  chatRoomId: string;
  messageId: string;
  message: string;
  senderId: string;
  status: "sent" | "delivered" | "read";
  repliedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for text messages
interface ITextMessage extends IMessageBase {
  type: "text";
}

// Interface for timestamp messages
interface ITimestampMessage extends IMessageBase {
  type: "timestamp";
}

// Interface for file messages
interface IFileMessage extends IMessageBase {
  type: "file";
  fileId: string | null;
}

// Messsage interface
export type IMessage = ITextMessage | ITimestampMessage | IFileMessage;

// Mongoose schema definition
const messageSchema = new Schema<IMessage>(
  {
    chatRoomId: {
      type: String,
      required: [true, "Chat room ID is required"],
    },
    messageId: {
      type: String,
      required: [true, "Message ID is required"],
    },
    message: {
      type: String,
      required: [
        function (this: IMessage) {
          return this.type !== "timestamp";
        },
        "Message content is required for non-timestamp messages",
      ],
    },
    senderId: {
      type: String,
      required: [true, "Sender ID is required"],
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      required: [true, "Message status is required"],
    },
    repliedTo: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      enum: ["text", "timestamp", "file"],
      required: [true, "Message type is required"],
    },
    fileId: {
      type: String,
      required: [
        function (this: IMessage) {
          return this.type === "file";
        },
        "File ID is required for file messages",
      ],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Model creation
const MessageModel = model<IMessage>("Message", messageSchema);

export default MessageModel;
