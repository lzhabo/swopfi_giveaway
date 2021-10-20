import telegramService from "./services/telegramService";
import models from "../src/models";
import msg from "./messages_lib";
import {
  checkIfUserRetweeted,
  checkTelegram,
  checkUserExists,
  checkUserTwitterSubscribers,
  getAddressFromDescription,
} from "./services/rulesServise";

require("dotenv").config();

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
      const campaing = process.env.CAMPAING;
      const walletAddress = await getAddressFromDescription(twitterUsername);
      const users = await models.participant.findAll({
        where: { campaign: campaing },
      });

      const findCopies = await models.participant.findAll({
        where: {
          campaign: campaing,
          telegramId: from.id.toString(),
        },
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
      await models.participant.create({
        telegramId: from.id.toString(),
        walletAddress,
        twitterUsername,
        campaign: campaing,
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
        noMsg += `${num++}. You should have more than ${
          process.env.SUBSCRIBERS_COUNT
        } followers\n`;
      }
      if (!success[2]) {
        noMsg += `${num++}. Retweet the [status](${process.env.LINK})\n`;
      }
      if (!success[3]) {
        noMsg += `${num++}. Add your Waves address to your Twitter profile.\n`;
      }
      await telegramService.telegram.sendMessage(from.id, noMsg, {
        parse_mode,
        reply_markup: {
          keyboard: [[{ text: msg.ihavedoneitall }]],
        },
      });
    }
  }
);
