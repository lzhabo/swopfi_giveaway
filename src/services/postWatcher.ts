import { GiveAway } from "../models/GiveAway";
import axios from "axios";

const checkRetweetsForTweet = async (giveaway: any) => {
  try {
    const res = await axios.get(
      `https://api.twitter.com/1.1/statuses/retweeters/ids.json?id=${giveaway.postId}`,
      {
        headers: { Authorization: `Bearer ${process.env.BEARER_TOKEN}` },
      }
    );
    const lastRetweets = res.data.ids;

    let updatedRetweets = lastRetweets.filter(
      (x) => !giveaway.usersRetweets.includes(x)
    );
    if (giveaway.usersRetweets.length == 0) {
      updatedRetweets = lastRetweets;
    }
    await GiveAway.findByIdAndUpdate(giveaway._id, {
      usersRetweets: giveaway.usersRetweets.concat(updatedRetweets),
    });
  } catch (e) {
    console.log(e);
  }
};

export const checkGiveAwayRetweets = async () => {
  const giveaways = await GiveAway.find({
    expirationDate: {
      $gte: new Date(2021, 10, 3),
    },
  });
  for (let index in giveaways) {
    await checkRetweetsForTweet(giveaways[index]);
  }
};
