import * as mongoose from "mongoose";
import { Document } from "mongoose";

export interface IUserRetweetStore {
  userId: number;
  postId: number;
}

export type TUserRetweetStoreDocument = Document & IUserRetweetStore;

const UserRetweetStoreSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true },
    postId: { type: Number, required: true },
  },
  { timestamps: true }
);

export const UserRetweetStore = mongoose.model<TUserRetweetStoreDocument>(
  "UserRetweetStore",
  UserRetweetStoreSchema
);
