import { DataTypes } from "sequelize";

export interface IParticipant {
  telegramId: string;
  walletAddress: string;
  twitterUsername: string;
  campaign: string;
}

const participantModel = {
  telegramId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  walletAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  twitterUsername: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  campaign: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

export default participantModel;
