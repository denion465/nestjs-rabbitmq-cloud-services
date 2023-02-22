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
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
    rankink: String,
    urlFotoJogador: String,
    posicaoRanking: Number,
  },
  {
    timestamps: true,
    collection: 'jogadores',
  },
);
