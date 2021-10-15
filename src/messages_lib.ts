const msg = {
  takePart: `How to participate:\n
  1️⃣ Make sure you have at least 50 followers on Twitter.
  2️⃣ Add your Waves address to your Twitter profile.
  3️⃣ Follow Swop.fi on [Twitter](https://twitter.com/swopfi)
  4️⃣ Retweet the status: ${process.env.LINK}
  5️⃣ Join Swop.fi group in [Telegram](https://t.me/swopfisupport)`,
  allCompaniesAreFinished:
    "Sorry, all the campaigns are finished. See you on next Launchpad!\n",
  triggerCheck: "Thank you! Now tell me your username on Twitter",
  ihavedoneitall: " I've done it all!",
  success:
    "Congratulations! 100 tokens is reserved for you. You can deposit USDN on the Launchpad page until date\n",
  noFreePlaces:
    "Sorry, the list of participants is already full. Despite this, " +
    "you can deposit USDN on the Launchpad page until datetime3 (CEST): ссылка 3. " +
    "If someone drops out (for example, deletes the retweet), " +
    "you will receive имя_токена; if not, you will get your USDN back. \n",
  somethingIsNotDone:
    "Sorry, the quest is not completed. These requirements are still not met:\n",
  pleaseDoAllRequiredRules:
    "Sorry, the quest is not completed. Not all requirements are met",
};
export default msg;
