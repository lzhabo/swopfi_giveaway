import { initMongo } from "./services/mongo";
import telegramService from "./services/telegramService";
import * as moment from "moment";
import msg from "./messages_lib";
import {
  checkIfUserRetweeted,
  checkTelegram,
  checkUserTwitterSubscribe,
  getAddressFromDescription,
} from "./services/rulesServise";
import { mongo } from "mongoose";
import { User } from "./models/User";

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

telegramService.telegram.onText(/I've done it all!/, async ({ from }) => {
  //todo run check func
  await telegramService.telegram.sendMessage(from.id, msg.triggerCheck, {
    parse_mode,
  });
});

telegramService.telegram.on(
  "message",
  async ({ chat, from, text: twitterUsername }) => {
    const success = await Promise.all([
      await checkTelegram(from.id.toString()),
      // await checkUserTwitterSubscribe(twitterUsername),
      await checkIfUserRetweeted(twitterUsername),
    ]); //.then((arr) => arr.every((v) => v));
    console.log(success);
    if (success.every((v) => v)) {
      const walletAddress = await getAddressFromDescription(twitterUsername);
      const users = await User.find({ campaign: process.env.CAMPAIGN });
      if (users.length > 500) {
        await telegramService.telegram.sendMessage(
          chat.id,
          "Sorry, there is not free places",
          {
            parse_mode,
          }
        );
        return;
      }
      await User.create({
        telegramId: from.id,
        walletAddress,
        twitterUsername,
        campaign: process.env.CAMPAIGN,
      });
      await telegramService.telegram.sendMessage(chat.id, "wow", {
        parse_mode,
      });
    } else {
      await telegramService.telegram.sendMessage(chat.id, "соси жопу уебок");
    }
  }
);

// cron.schedule(" * * * *", checkGiveAwayRetweets);

//run same cron on particular date to note thta second compain is started
// cron.schedule(" * * * *", checkGiveAwayRetweets);
