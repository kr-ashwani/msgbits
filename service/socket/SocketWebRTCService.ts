import { SocketAuthData } from "../../socket/EventHandlers/validateSocketConnection";
import { IOManager } from "../../socket/SocketIOManager/IOManager";
import { SocketManager } from "../../socket/SocketIOManager/SocketManager";
import { chatRoomService } from "../database/chat/chatRoom/chatRoomService";
import Redis from "ioredis";
import config from "config";
import RedisConnection from "../../redis/redisConnection";
import {
  IWebRTCAnswer,
  IWebRTCGetActiveParticipants,
  IWebRTCIceCandidate,
  IWebRTCJoinCall,
  IWebRTCMediaStateChange,
  IWebRTCMediaTrack,
  IWebRTCOffer,
  IWebRTCStartCall,
} from "../../schema/webRTC/WebRTCSchema";

export class SocketWebRTCService {
  private socket: SocketManager;
  private io: IOManager;
  private user: SocketAuthData["auth"];
  private userId: string;
  private redisClient: Redis;

  private static readonly redisConfig = {
    port: config.get<number>("REDIS_PORT"),
    host: config.get<string>("REDIS_HOST"),
    lazyConnect: true,
  };

  constructor(socket: SocketManager, io: IOManager) {
    this.socket = socket;
    this.io = io;
    this.user = socket.getAuthUser();
    this.userId = this.user.id;
    this.redisClient = new RedisConnection(SocketWebRTCService.redisConfig).getConnection();
    this.init();
  }
  init() {
    this.socket.on("webrtc-startCall", this.handleStartCall);
    // this.socket.on("webrtc-joinCall", this.handleJoinCall);
    this.socket.on("webrtc-getActiveParticipants", this.handleGetActiveParticipants);
    this.socket.on("webrtc-endCall", this.handleEndCall);
    this.socket.on("webrtc-offer", this.handleOffer);
    this.socket.on("webrtc-answer", this.handleAnswer);
    this.socket.on("webrtc-iceCandidate", this.handleIceCandidate);
    this.socket.on("webrtc-mediaStateChange", this.handleMediaStateChange);
    //this.socket.on("webrtc-trackAdded", this.handleTrackAdded);
    this.socket.on("webrtc-roomFull", this.handleRoomFull);
  }

  private getOtherParticipants = async (chatRoomId: string) => {
    const chatRoom = await chatRoomService.getChatRoomByID(this.userId, chatRoomId);
    if (!chatRoom) throw Error("no chatRoom");
    return chatRoom.members.filter((mem) => mem !== this.userId);
  };

  private async addActiveParticipants(type: "new" | "existing", callId: string, userId: string) {
    const keyExists = await this.redisClient.exists(`call:${callId}:active_participants`);

    if (type === "new" && keyExists) throw new Error("Call session already exists");
    if (type === "existing" && !keyExists) throw new Error("call session doesnot exists");

    const isParticipant = await this.redisClient.sismember(
      `call:${callId}:active_participants`,
      userId
    );

    if (isParticipant) throw new Error("User already present in call");

    await this.redisClient.sadd(`call:${callId}:active_participants`, userId);
    return true;
  }
  private async getActiveParticipants(callId: string) {
    const participants = await this.redisClient.smembers(`call:${callId}:active_participants`);

    if (!participants?.length) throw new Error("Participants is empty or not available");
    return participants.filter((memId) => memId !== this.userId);
  }
  private async removeActiveParticipants(callId: string, userId: string) {
    const isParticipant = await this.redisClient.sismember(
      `call:${callId}:active_participants`,
      userId
    );

    if (!isParticipant) throw new Error("User not found in call");

    await this.redisClient.srem(`call:${callId}:active_participants`, userId);

    // Get remaining members count
    const remainingMembers = await this.redisClient.scard(`call:${callId}:active_participants`);

    // If no members left, delete the key
    if (remainingMembers === 0) {
      await this.redisClient.del(`call:${callId}:active_participants`);
      return { empty: true };
    }

    return { empty: false };
  }

  private handleStartCall = async (data: IWebRTCStartCall) => {
    const { chatRoomId, callId, userId } = data;

    await this.addActiveParticipants("new", callId, this.userId);
    const participants = await this.getOtherParticipants(chatRoomId);

    participants.forEach((memId) => this.socket.to(memId).emit("webrtc-incomingCall", data));
  };

  private handleEndCall = async () => {};

  private handleGetActiveParticipants = async (data: IWebRTCGetActiveParticipants) => {
    const { callId, chatRoomId } = data;
    await this.addActiveParticipants("existing", callId, this.userId);

    const participants = await this.getActiveParticipants(callId);
    console.log(participants);
    participants.forEach((memId) => this.socket.to(memId).emit("webrtc-joinCall", data));
    this.socket.emit("webrtc-getActiveParticipants", {
      ...data,
      activeParticipants: participants,
    });
  };
  private handleOffer = async (data: IWebRTCOffer) => {
    const { callId } = data;
    console.log("offer", data);
    const participants = await this.getActiveParticipants(callId);
    participants.forEach((memId) =>
      this.socket.to(memId).emit("webrtc-offer", { ...data, userId: this.userId })
    );
  };
  private handleAnswer = async (data: IWebRTCAnswer) => {
    const { callId } = data;
    console.log("answer", data);
    const participants = await this.getActiveParticipants(callId);
    participants.forEach((memId) =>
      this.socket.to(memId).emit("webrtc-answer", { ...data, userId: this.userId })
    );
  };
  private handleIceCandidate = async (data: IWebRTCIceCandidate) => {
    const { callId } = data;
    const participants = await this.getActiveParticipants(callId);
    participants.forEach((memId) =>
      this.socket.to(memId).emit("webrtc-iceCandidate", { ...data, userId: this.userId })
    );
  };
  private handleMediaStateChange = async (data: IWebRTCMediaStateChange) => {
    const { callId } = data;
    console.log("state media change ", data);
    const participants = await this.getActiveParticipants(callId);
    participants.forEach((memId) =>
      this.socket.to(memId).emit("webrtc-mediaStateChange", { ...data, userId: this.userId })
    );
  };
  private handleTrackAdded = async (data: IWebRTCMediaTrack) => {
    const { callId } = data;
    console.log("webrtc track added ", data);
    const participants = await this.getActiveParticipants(callId);
    participants.forEach((memId) =>
      this.socket.to(memId).emit("webrtc-trackAdded", { ...data, userId: this.userId })
    );
  };
  private handleRoomFull = async () => {};
}
