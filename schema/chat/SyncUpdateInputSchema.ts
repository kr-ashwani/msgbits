import { z } from "zod";

export const SyncUpdateInputSchema = z.array(
  z.object({
    chatRoomId: z.string(),
    lastMessageTimestamp: z.string({
      required_error: "Last Message timestamp is required",
    }),
    lastUpdateTimestamp: z.string({
      required_error: "ChatRoom last update timestamp is required",
    }),
  })
);

export type SyncUpdateInput = z.infer<typeof SyncUpdateInputSchema>;
