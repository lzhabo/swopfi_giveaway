import { initMongo } from "./services/mongo";
import telegramService from "./services/telegramService";
import msg from "./messages_lib";
import {
  checkIfUserRetweeted,
  checkTelegram,
  checkUserExists,
  checkUserTwitterSubscribers,
  getAddressFromDescription,
} from "./services/rulesServise";
import { User } from "./models/User";

require("dotenv").config();
initMongo().then();

const parse_mode = "Markdown";

telegramService.telegram.onText(/\/start/, async ({ from }) => {
  let text = "";
  if (process.env.CAMPAING === "1" || process.env.CAMPAING === "2") {
    text = msg.takePart;
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
  async ({ from, text: twitterUsername }) => {
    if (twitterUsername === "/start" || twitterUsername === "I've done it all!")
      return;
    if (!(await checkUserExists(twitterUsername))) {
      await telegramService.telegram.sendMessage(
        from.id,
        "There is no user with such username"
      );
      return;
    }
    await telegramService.telegram.sendMessage(from.id, "Checking...");
    const success = await Promise.all([
      await checkTelegram(from.id.toString()),
      await checkUserTwitterSubscribers(twitterUsername),
      await checkIfUserRetweeted(twitterUsername),
    ]);
    if (success.every((v) => v)) {
      const walletAddress = await getAddressFromDescription(twitterUsername);
      const users = await User.find({ campaign: process.env.CAMPAIGN });
      const findCopies = await User.find({
        campaign: process.env.CAMPAIGN,
        telegramId: from.id,
      });

      if (findCopies) {
        await telegramService.telegram.sendMessage(from.id, msg.noFreePlaces);
        return;
      }
      if (users.length >= 500) {
        await telegramService.telegram.sendMessage(from.id, msg.noFreePlaces);
        return;
      }
      await User.create({
        telegramId: from.id,
        walletAddress,
        twitterUsername,
        campaign: process.env.CAMPAIGN,
      });
      await telegramService.telegram.sendMessage(from.id, msg.success);
    } else {
      await telegramService.telegram.sendMessage(
        from.id,
        msg.pleaseDoAllRequiredRules
      );
    }
  }
);
