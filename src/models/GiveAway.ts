import * as mongoose from "mongoose";
import { Document } from "mongoose";

export interface IGiveAway {
  postId: string;
  expirationDate: Date;
  usersRetweets: number[];
}

export type TGiveAwayDocument = Document & IGiveAway;

const GiveAwaySchema = new mongoose.Schema({
  postId: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  usersRetweets: { type: [Number], required: true },
});

export const GiveAway = mongoose.model<TGiveAwayDocument>(
  "GiveAway",
  GiveAwaySchema
);
