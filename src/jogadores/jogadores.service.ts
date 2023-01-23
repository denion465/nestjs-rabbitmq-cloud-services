import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];
  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    this.criar(criarJogadorDto);
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
}
