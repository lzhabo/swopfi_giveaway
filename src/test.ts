import axios from "axios";

const foo = async () => {
  const res = await axios
    .get(
      `https://api.twitter.com/1.1/lists/subscribers/show.json?slug=team&owner_screen_name=twitter&screen_name=episod`,
      {
        headers: { ...process.env },
      }
    )
    .catch(({ response: { statusText } }) => console.log(statusText));
};

foo();
