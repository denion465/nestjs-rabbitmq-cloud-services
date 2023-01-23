import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];
  private readonly logger = new Logger(JogadoresService.name);

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return this.jogadores;
  }

  async consultarJogadoresPorEmail(email: string): Promise<Jogador> {
    const jogador = this.jogadores.find((jogador) => jogador.email === email);
    if (!jogador) {
      throw new NotFoundException(
        `Jogador com e-mail ${email} não encontrado.`,
      );
    }
    return jogador;
  }

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;
    const jogador = this.jogadores.find((jogador) => jogador.email === email);
    if (!jogador) this.criar(criarJogadorDto);
    else this.atualizar(jogador, criarJogadorDto);
  }

  async deletarJogador(email: string): Promise<void> {
    this.jogadores = this.jogadores.filter(
      (jogador) => jogador.email !== email,
    );
  }

  private criar(criarJogadorDto: CriarJogadorDto): void {
    const { nome, email, telefoneCelular } = criarJogadorDto;
    const jogador: Jogador = {
      _id: randomUUID(),
      nome,
      email,
      telefoneCelular,
      rankings: 'A',
      posicaoRanking: 1,
      urlFotoJogador: '//',
    };
    this.logger.log(`\n criarJogadorDto: ${JSON.stringify(jogador, null, 2)}`);
    this.jogadores.push(jogador);
  }

  private atualizar(jogador: Jogador, criarJogadorDto: CriarJogadorDto): void {
    const { nome } = criarJogadorDto;
    jogador.nome = nome;
  }
}
