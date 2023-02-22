import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { ClientProxySmartRanking } from './proxyrmq/client-proxy';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CategoriasModule,
    JogadoresModule,
    ProxyRMQModule,
  ],
  providers: [ClientProxySmartRanking],
})
export class AppModule {}
