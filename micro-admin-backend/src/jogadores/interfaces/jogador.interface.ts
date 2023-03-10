import { Document } from 'mongoose';
import { Categoria } from 'src/categorias/interfaces/categoria.interface';

export interface Jogador extends Document {
  readonly telefoneCelular: string;
  readonly email: string;
  categoria: Categoria;
  nome: string;
  rankings: string;
  posicaoRanking: number;
  urlFotoJogador: string;
}
