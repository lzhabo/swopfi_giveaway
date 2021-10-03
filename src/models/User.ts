import * as mongoose from "mongoose";
import { Document } from "mongoose";

export interface IUser {
  telegramId?: number;
  walletAddress?: string;
  twitterUsername?: string;
  isMoreThan50Subscribers?: boolean;
  twittId?: number;
}

export type TUserDocument = Document & IUser;

const UserSchema = new mongoose.Schema(
  {
    telegramId: { type: Number, required: false },
    walletAddress: { type: String, required: false },
    twitterUsername: { type: String, required: false },
    isMoreThan50Subscribers: { type: Boolean, required: false },
    twittId: { type: Number, required: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<TUserDocument>("User", UserSchema);
