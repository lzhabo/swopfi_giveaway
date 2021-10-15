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
      await getAddressFromDescription(twitterUsername),
    ]);

    if (success.every((v) => v)) {
      const walletAddress = await getAddressFromDescription(twitterUsername);
      const users = await User.find({ campaign: process.env.CAMPAIGN });
      const findCopies = await User.find({
        campaign: process.env.CAMPAIGN,
        telegramId: from.id,
      });

      if (findCopies.length >= 1) {
        await telegramService.telegram.sendMessage(
          from.id,
          "You are already taking a part"
        );
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
      let noMsg =
        "Sorry, the quest is not completed. These requirements are still not met:\n\n";
      let num = 1;
      if (!success[0]) {
        noMsg += `${num++}. Join Swop.fi group in [Telegram](https://t.me/swopfisupport)\n`;
      }
      if (!success[1]) {
        noMsg += `${num++}. You should have more than 50 followers\n`;
      }
      if (!success[2]) {
        noMsg += `${num++}. Retweet the [status](${process.env.LINK})\n`;
      }
      if (!success[3]) {
        noMsg += `${num++}. Add your Waves address to your Twitter profile.\n`;
      }
      await telegramService.telegram.sendMessage(from.id, noMsg, {
        parse_mode,
      });
    }
  }
);
