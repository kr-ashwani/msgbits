type IPrivateChatRoom = {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  type: "private";
  chatRoomId: string;
  members: string[];
  lastMessageId: string;
};
type IGroupChatRoom = {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  type: "group";
  chatRoomId: string;
  members: string[];
  lastMessageId: string;
  admins: string[];
  chatName: string;
  chatRoomPicture: string;
};

export const chatRoom: (IPrivateChatRoom | IGroupChatRoom)[] = [
  {
    createdAt: "2024-07-06T10:15:19.544Z",
    updatedAt: "2024-07-06T10:15:19.544Z",
    type: "private",
    chatRoomId: "chatroom1",
    members: ["66891937f4f39db4481b8e02", "chatuser2"],
    lastMessageId: "msg1",
    createdBy: "66891937f4f39db4481b8e02",
  },
  {
    createdAt: "2024-07-06T10:15:19.544Z",
    updatedAt: "2024-07-06T10:15:19.544Z",
    type: "private",
    chatRoomId: "chatroom2",
    members: ["66891937f4f39db4481b8e02", "chatuser3"],
    lastMessageId: "msg2",
    createdBy: "chatuser3",
  },
  {
    createdAt: "2024-07-06T10:15:19.544Z",
    updatedAt: "2024-07-06T10:15:19.544Z",
    type: "private",
    chatRoomId: "chatroom3",
    members: ["66891937f4f39db4481b8e02", "chatuser4"],
    lastMessageId: "msg3",
    createdBy: "66891937f4f39db4481b8e02",
  },
  {
    createdAt: "2024-07-06T10:15:19.544Z",
    updatedAt: "2024-07-06T10:15:19.544Z",
    type: "private",
    chatRoomId: "chatroom4",
    members: ["66891937f4f39db4481b8e02", "chatuser5"],
    lastMessageId: "msg4",
    createdBy: "chatuser5",
  },
  {
    createdAt: "2024-07-06T10:15:19.544Z",
    updatedAt: "2024-07-06T10:15:19.544Z",
    type: "private",
    chatRoomId: "chatroom5",
    members: ["66891937f4f39db4481b8e02", "chatuser6"],
    lastMessageId: "msg5",
    createdBy: "66891937f4f39db4481b8e02",
  },
  {
    createdAt: "2024-07-06T10:15:19.544Z",
    updatedAt: "2024-07-06T10:15:19.544Z",
    type: "private",
    chatRoomId: "chatroom6",
    members: ["66891937f4f39db4481b8e02", "chatuser7"],
    lastMessageId: "msg6",
    createdBy: "chatuser7",
  },
  {
    createdAt: "2024-07-06T10:15:19.544Z",
    updatedAt: "2024-07-06T10:15:19.544Z",
    type: "private",
    chatRoomId: "chatroom7",
    members: ["66891937f4f39db4481b8e02", "chatuser8"],
    lastMessageId: "msg7",
    createdBy: "66891937f4f39db4481b8e02",
  },
  {
    createdAt: "2024-07-06T10:15:19.544Z",
    updatedAt: "2024-07-06T10:15:19.544Z",
    type: "private",
    chatRoomId: "chatroom8",
    members: ["66891937f4f39db4481b8e02", "chatuser9"],
    lastMessageId: "msg8",
    createdBy: "chatuser9",
  },
  {
    createdAt: "2024-07-06T10:15:19.544Z",
    updatedAt: "2024-07-06T10:15:19.544Z",
    type: "private",
    chatRoomId: "chatroom9",
    members: ["66891937f4f39db4481b8e02", "chatuser10"],
    lastMessageId: "msg9",
    createdBy: "66891937f4f39db4481b8e02",
  },
  {
    createdAt: "2024-07-06T10:15:19.544Z",
    updatedAt: "2024-07-06T10:15:19.544Z",
    type: "private",
    chatRoomId: "chatroom10",
    members: ["66891937f4f39db4481b8e02", "chatuser11"],
    lastMessageId: "msg10",
    createdBy: "chatuser11",
  },
  {
    createdAt: "2024-07-06T10:15:19.544Z",
    updatedAt: "2024-07-06T10:15:19.544Z",
    type: "group",
    chatRoomId: "chatroom11",
    members: ["66891937f4f39db4481b8e02", "chatuser3", "chatuser5", "chatuser7", "chatuser10"],
    lastMessageId: "msg10",
    admins: ["chatuser3", "66891937f4f39db4481b8e02"],
    chatName: "CodePen Group",
    chatRoomPicture: "https://cdn-icons-png.flaticon.com/512/2111/2111501.png",
    createdBy: "66891937f4f39db4481b8e02",
  },
];
