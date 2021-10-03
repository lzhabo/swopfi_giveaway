import { initMongo } from "./services/mongo";
import telegramService from "./services/telegramService";

require("dotenv").config();
initMongo().then();

const parse_mode = "Markdown";
const token =
  "AAAAAAAAAAAAAAAAAAAAAD3ZUAEAAAAAApmD6LEk2YIdsjVlYSkoelrQXIc%3DvLLQddBKT9Zq01N5qUWRJ5w8ci5KomCLvQkTaDPnOWmEs0Ltzw";

telegramService.telegram.onText(/\/start/, async ({ chat }) => {
  await telegramService.telegram.sendMessage(chat.id, "idi nahyi", {
    parse_mode,
  });
});
// const res = await axios.get(
//   "https://api.twitter.com/1.1/statuses/retweeters/ids.json?id=1443891369035042820",
//   {
//     headers: { Authorization: `Bearer ${token}` },
//   }
// );
// console.log(res);
// console.log(res.data.ids.length);
