import axios from "axios";
import {
  IUserRetweetStore,
  UserRetweetStore,
} from "../models/UserRetweetStore";

const token =
  "AAAAAAAAAAAAAAAAAAAAAD3ZUAEAAAAAApmD6LEk2YIdsjVlYSkoelrQXIc%3DvLLQddBKT9Zq01N5qUWRJ5w8ci5KomCLvQkTaDPnOWmEs0Ltzw";
export const updateRetweetStore = async () => {
  const res = await axios.get(
    "https://api.twitter.com/1.1/statuses/retweeters/ids.json?id=1443891369035042820",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  console.log(res);
  const items = await UserRetweetStore.find({}).exec();
  console.log(items);
  // const newRetweets = array1.filter(function (obj) {
  //   return array2.indexOf(obj) == -1;
  // });
};
