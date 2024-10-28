import Redis from "ioredis";
import config from "config";
import {
  IWebRTCAnswer,
  IWebRTCEndCall,
  IWebRTCGetActiveParticipants,
  IWebRTCIceCandidate,
  IWebRTCMediaStateChange,
  IWebRTCOffer,
  IWebRTCStartCall,
} from "../../schema/webRTC/WebRTCSchema";
import { SocketAuthData } from "../../socket/EventHandlers/validateSocketConnection";
import { IOManager } from "../../socket/SocketIOManager/IOManager";
import { SocketManager } from "../../socket/SocketIOManager/SocketManager";
import { chatRoomService } from "../database/chat/chatRoom/chatRoomService";
import RedisConnection from "../../redis/redisConnection";

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
    this.socket.on("webrtc-getActiveParticipants", this.handleGetActiveParticipants);
    this.socket.on("webrtc-endCall", this.handleEndCall);
    this.socket.on("webrtc-offer", this.handleOffer);
    this.socket.on("webrtc-answer", this.handleAnswer);
    this.socket.on("webrtc-iceCandidate", this.handleIceCandidate);
    this.socket.on("webrtc-mediaStateChange", this.handleMediaStateChange);
    this.socket.on("webrtc-roomFull", this.handleRoomFull);
  }
  private handleStartCall = async (payload: IWebRTCStartCall) => {
    const { chatRoomId, callId, userId } = payload;

    await this.addActiveParticipants("new", callId, this.userId);
    const participants = await this.getOtherParticipants(chatRoomId);

    participants.forEach((memId) => this.socket.to(memId).emit("webrtc-incomingCall", payload));
  };

  private handleEndCall = async (payload: IWebRTCEndCall) => {
    const { callId } = payload;

    await this.removeActiveParticipants(callId, this.userId);
    const participants = await this.getActiveParticipants(callId);

    participants.forEach((memId) => this.socket.to(memId).emit("webrtc-endCall", payload));
  };

  private handleGetActiveParticipants = async (payload: IWebRTCGetActiveParticipants) => {
    const { callId, chatRoomId } = payload;
    await this.addActiveParticipants("existing", callId, this.userId);

    const participants = await this.getActiveParticipants(callId);
    participants.forEach((memId) => this.socket.to(memId).emit("webrtc-joinCall", payload));
    this.socket.emit("webrtc-getActiveParticipants", {
      ...payload,
      activeParticipants: participants,
    });
  };
  private handleOffer = async (payload: IWebRTCOffer) => {
    const { callId } = payload;

    const participants = await this.getActiveParticipants(callId);
    participants.forEach((memId) =>
      this.socket.to(memId).emit("webrtc-offer", { ...payload, userId: this.userId })
    );
  };
  private handleAnswer = async (payload: IWebRTCAnswer) => {
    const { callId } = payload;

    const participants = await this.getActiveParticipants(callId);
    participants.forEach((memId) =>
      this.socket.to(memId).emit("webrtc-answer", { ...payload, userId: this.userId })
    );
  };
  private handleIceCandidate = async (payload: IWebRTCIceCandidate) => {
    const { callId } = payload;

    const participants = await this.getActiveParticipants(callId);
    participants.forEach((memId) =>
      this.socket.to(memId).emit("webrtc-iceCandidate", { ...payload, userId: this.userId })
    );
  };
  private handleMediaStateChange = async (payload: IWebRTCMediaStateChange) => {
    const { callId } = payload;

    const participants = await this.getActiveParticipants(callId);
    participants.forEach((memId) =>
      this.socket.to(memId).emit("webrtc-mediaStateChange", { ...payload, userId: this.userId })
    );
  };

  private handleRoomFull = async () => {};

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

    if (!participants?.length) return [];
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
}
