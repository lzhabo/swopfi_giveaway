import axios from "axios";
import telegramService from "./telegramService";
import { verifyAddress } from "@waves/ts-lib-crypto";

export const checkIfUserRetweeted = async (username): Promise<boolean> => {
  const request = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=50`;
  const retweetersData = await pingTwitter(request);
  return retweetersData.data.some(
    ({ retweeted_status }) =>
      retweeted_status && retweeted_status.id_str === process.env.TWITT_ID
  );
};

const pingTwitter = (url: string) =>
  axios.get(url, {
    headers: { Authorization: `Bearer ${process.env.BEARER_TOKEN}` },
  });

export const checkUserTwitterSubscribers = async (username: string) => {
  const request = `https://api.twitter.com/1.1/followers/ids.json?cursor=-1&screen_name=${username}&count=51`;
  const subscDetails = await pingTwitter(request);
  return subscDetails.data.ids.length > +process.env.SUBSCRIBERS_COUNT;
};

export const checkUserExists = async (username: string) => {
  try {
    const request = `https://api.twitter.com/2/users/by/username/${username}`;
    const response = await pingTwitter(request);
    return !response.data.errors;
  } catch (e) {
    return false;
  }
};
export const getAddressFromDescription = async (username: string) => {
  try {
    const request = `https://api.twitter.com/2/users/by/username/${username}?user.fields=created_at,description`;
    const res = await pingTwitter(request);
    if (res.data.errors) {
      console.log("getAddressFromDescription failed");
      return false;
    }
    return res.data.data.description
      .replace(/\n/g, " ")
      .split(" ")
      .reduce((acc, v) => (verifyAddress(v) ? v : acc), false);
  } catch (e) {
    console.log("getAddressFromDescription failed");
    return false;
  }
};
export const checkTelegram = async (telegramId: string): Promise<boolean> => {
  try {
    const res = await telegramService.telegram.getChatMember(
      process.env.TELEGRAM_CHAT,
      telegramId
    );
    return res.status === "member";
  } catch (e) {
    console.log("checkTelegram failed");
    return false;
  }
};
