import axios from "axios";
import { token } from "./index";

const foo = async () => {
  const arr = [1443901303957168133, 1443901303957168133];
  await Promise.all(
    Array.from(arr, async (id) => {
      const res = await axios.get(
        `https://api.twitter.com/1.1/statuses/retweeters/ids.json?id=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data.errors);
    })
  );
};

foo();
