import { initMongo } from "./services/mongo";
import telegramService from "./services/telegramService";
import { GiveAway } from "./models/GiveAway";
import * as moment from "moment";
import msg from "./messages_lib";
import { checkTelegram, getUserByUserName } from "./services/rulesServise";

const cron = require("node-cron");

require("dotenv").config();
initMongo().then();

const adminId = 383909141;
const parse_mode = "Markdown";

telegramService.telegram.onText(/\/start/, async ({ chat }) => {
  // const today = moment();
  const today = moment("2021-12-04T10:00:00");
  console.log("today", today);
  let text = "";
  if (today > moment("2021-12-05T10:00:00")) {
    await telegramService.telegram.sendMessage(
      chat.id,
      msg.allCompaniesAreFinished,
      {
        parse_mode,
      }
    );
    return;
  }
  if (
    today >= moment("2021-12-03T10:00:00") &&
    today < moment("2021-12-05T10:00:00")
  ) {
    text = msg.takePart1;
  } else today > moment("2021-12-05T10:00:00");
  {
    text = msg.takePart2;
  }
  await telegramService.telegram.sendMessage(chat.id, text, {
    parse_mode,
    reply_markup: {
      keyboard: [[{ text: msg.ihavedoneitall }]],
    },
  });
});

telegramService.telegram.onText(/I've done it all!/, async ({ chat, from }) => {
  //todo run check func
  await telegramService.telegram.sendMessage(chat.id, msg.triggerCheck, {
    parse_mode,
  });
});

telegramService.telegram.onText(
  /^@[a-zA-Z0-9]/,
  async ({ chat, from }, match) => {
    // const reply = await getUserByUserName(match.input.substring(1));
    await checkTelegram(from.id.toString());
    await telegramService.telegram.sendMessage(chat.id, "wow", {
      parse_mode,
    });
  }
);

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

//run same cron on particular date to note thta second compain is started
// cron.schedule(" * * * *", checkGiveAwayRetweets);
