import { initMongo } from "./services/mongo";
import telegramService from "./services/telegramService";
import msg from "./messages_lib";
import {
  checkIfUserRetweeted,
  checkTelegram,
  getAddressFromDescription,
  checkUserTwitterSubscribe,
} from "./services/rulesServise";
import { User } from "./models/User";

require("dotenv").config();
initMongo().then();

const parse_mode = "Markdown";

telegramService.telegram.onText(/\/start/, async ({ from }) => {
  let text;
  if (process.env.CAMPAING === "1") {
    text = msg.takePart1;
  } else if (process.env.CAMPAING === "2") {
    text = msg.takePart1;
  } else {
    text = msg.allCompaniesAreFinished;
  }
  await telegramService.telegram.sendMessage(from.id, text, {
    parse_mode,
    reply_markup: {
      keyboard: [[{ text: msg.ihavedoneitall }]],
    },
  });
});

telegramService.telegram.onText(/I've done it all!/, async ({ from }) => {
  await telegramService.telegram.sendMessage(from.id, msg.triggerCheck, {
    parse_mode,
    reply_markup: {
      remove_keyboard: true,
    },
  });
});

telegramService.telegram.on(
  "message",
  async ({ chat, from, text: twitterUsername }) => {
    const success = await Promise.all([
      await checkTelegram(from.id.toString()),
      await checkUserTwitterSubscribe(twitterUsername),
      await checkIfUserRetweeted(twitterUsername),
    ]);
    if (success.every((v) => v)) {
      const walletAddress = await getAddressFromDescription(twitterUsername);
      const users = await User.find({ campaign: process.env.CAMPAIGN });
      if (users.length > 500) {
        await telegramService.telegram.sendMessage(chat.id, msg.noFreePlaces, {
          parse_mode,
        });
        return;
      }
      await User.create({
        telegramId: from.id,
        walletAddress,
        twitterUsername,
        campaign: process.env.CAMPAIGN,
      });
      await telegramService.telegram.sendMessage(chat.id, msg.success, {
        parse_mode,
      });
    } else {
      await telegramService.telegram.sendMessage(
        chat.id,
        msg.pleaseDoAllRequiredRules
      );
    }
  }
);

//run same cron on particular date to note thta second compain is started
// cron.schedule(" * * * *", checkGiveAwayRetweets);
