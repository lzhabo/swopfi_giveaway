import axios from "axios";
import telegramService from "./telegramService";
import { verifyAddress } from "@waves/ts-lib-crypto";

interface checkTwitterUser {
  isEnoughSubscribers: boolean;
  isFollowingTwitterAcc: boolean;
  isFollowingTelegramGroup: boolean;
}

interface checkTelegramUser {
  isEnoughSubscribers: boolean;
  isFollowingTwitterAcc: boolean;
  isFollowingTelegramGroup: boolean;
}
const swopfiTwitterId = 1321498483451432961;
const swopfiTelegram = "@swopfisupport";
const swopfiTweetId = 1443961943686098957;

export const checkIfUserRetweeted = async (username): Promise<boolean> => {
  const request = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=50`;
  const retweetersData = await pingTwitter(request);
  return retweetersData.data.some(
    ({ retweeted_status }) =>
      retweeted_status && retweeted_status.id === swopfiTweetId
  );
};

const pingTwitter = (url: string) =>
  axios.get(url, {
    headers: { Authorization: `Bearer ${process.env.BEARER_TOKEN}` },
  });

export const checkUserTwitterSubscribe = async (username: string) => {
  const request = `https://api.twitter.com/1.1/followers/ids.json?cursor=-1&screen_name=${username}&count=51`;
  const subscDetails = await pingTwitter(request);
  return subscDetails.data.ids.length > 50;
};

export const getAddressFromDescription = async (username: string) => {
  const request = `https://api.twitter.com/2/users/by/username/${username}?user.fields=created_at,description`;
  const res = await pingTwitter(request);
  if (res.data.errors) {
    throw "There is no user like this...";
  }
  return res.data.data.description
    .split(" ")
    .reduce((acc, v) => (verifyAddress(v) ? v : acc), null);
};
export const checkTelegram = async (telegramId: string): Promise<boolean> => {
  const res = await telegramService.telegram.getChatMember(
    swopfiTelegram,
    telegramId
  );
  return res.status === "member";
};

export const checkIfUserDidAllRequirements = (
  twitterUsername: string,
  telegramId: number
): string => {
  return "";
};

// export const getStatsInfoFromBlockchain = async () => {
//   const data: any = (
//     await Promise.all(
//       Object.entries({
//         lastPriceForEgg: lastPriceForEgg(),
//       }).map(
//         ([key, promise]) =>
//           new Promise(async (r) => {
//             const result = await promise;
//             return r({ key, result });
//           })
//       )
//     )
//   ).reduce((acc, { key, result }) => {
//     acc[key] = result;
//     return acc;
//   }, {} as Record<string, any>);
// };
