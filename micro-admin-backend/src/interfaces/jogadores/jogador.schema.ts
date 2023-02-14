import mongoose from 'mongoose';

export const JogadorSchema = new mongoose.Schema(
  {
    nome: String,
    email: {
      type: String,
      unique: true,
    },
    telefoneCelular: {
      type: String,
    },
    rankink: String,
    posicaoRanking: Number,
  },
  {
    timestamps: true,
    collection: 'jogadores',
  },
);
