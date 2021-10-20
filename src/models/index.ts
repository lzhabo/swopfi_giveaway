import { Model, ModelCtor, Sequelize } from "sequelize";
import participantModel, { IParticipant } from "./Participant";

class Models {
  private sequelize: Sequelize;
  public participant: ModelCtor<Model<IParticipant>>;

  // public basket: ModelCtor<Model<IBasket, any>>;

  constructor() {
    try {
      this.sequelize = new Sequelize(process.env.POSTGRESS_URL, {
        dialect: "postgres",
      });
      console.log("\nConnected to Posgress ✅  ");
    } catch (e) {
      console.log("🪓", e);
      console.log("\nFailed to connect to Posgress ❌  ");
    }

    this.participant = this.sequelize.define("participant", participantModel);
    this.participant.sync({ alter: true });
  }
}

export default new Models();
