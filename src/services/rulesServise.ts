import axios from "axios";
import telegramService from "./telegramService";

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

export const getUserByUserName = async (username: string) => {
  try {
    const res = await axios.get(
      `https://api.twitter.com/2/users/by/username/${username}?user.fields=created_at,description`,
      {
        headers: { Authorization: `Bearer ${process.env.BEARER_TOKEN}` },
      }
    );
    if (res.data.errors) {
      return "There is no user like this...";
    }
    const twitterId = res.data.data.id;
    const description = res.data.data.created_at;
    const createDate = res.data.data.description;

    const subscDetails = await axios.get(
      `https://api.twitter.com/1.1/followers/ids.json?cursor=-1&screen_name=${username}&count=51`,
      {
        headers: { Authorization: `Bearer ${process.env.BEARER_TOKEN}` },
      }
    );
    const isEnoughSubscribers = subscDetails.data.ids.length > 50;

    // return { twitterId };
  } catch (e) {
    console.log(e);
  }
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
