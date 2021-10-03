import * as mongoose from "mongoose";
import { Document } from "mongoose";

export interface IGiveAway {
  postLink: string;
  expirationDate: Date;
}

export type TGiveAwayDocument = Document & IGiveAway;

const GiveAwaySchema = new mongoose.Schema(
  {
    postLink: { type: String, required: true },
    expirationDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export const GiveAway = mongoose.model<TGiveAwayDocument>(
  "GiveAway",
  GiveAwaySchema
);
