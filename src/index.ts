import { initMongo } from "./services/mongo";
import telegramService from "./services/telegramService";
import msg from "./messages_lib";
import { GiveAway } from "./models/GiveAway";
import { checkGiveAwayRetweets } from "./services/postWatcher";

const cron = require("node-cron");

require("dotenv").config();
initMongo().then();

const adminId = 383909141;
const parse_mode = "Markdown";

telegramService.telegram.onText(/\/start/, async ({ chat }) => {
  await telegramService.telegram.sendMessage(chat.id, msg.welcome, {
    parse_mode,
  });
});

telegramService.telegram.onText(/\/canIAddNewPost?/, async ({ chat, from }) => {
  if (from.id !== adminId) {
    await telegramService.telegram.sendMessage(chat.id, "*no,idi nahyi*", {
      parse_mode,
    });
  } else {
    await telegramService.telegram.sendMessage(
      chat.id,
      "ofc u can!, please use /add operator for this",
      {
        parse_mode,
      }
    );
  }
});

telegramService.telegram.onText(
  /\/add[ \t]*(.*)/,
  async ({ chat, from }, match) => {
    const tweetsForGive = match[1].split(",");
    for (let index in match[1].split(",")) {
      const tweet = tweetsForGive[index].split(" ");
      console.log(new Date(tweet[1]));
      await GiveAway.create({
        postId: tweet[0],
        expirationDate: new Date(tweet[1]),
      });
    }
    await telegramService.telegram.sendMessage(
      chat.id,
      `вы добавили ${tweetsForGive.length} пост-(ов) 🤌🏻`,
      {
        parse_mode,
      }
    );
  }
);

// cron.schedule(" * * * *", checkGiveAwayRetweets);
