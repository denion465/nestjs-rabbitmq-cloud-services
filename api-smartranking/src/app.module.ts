import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';
import { CategoriasModule } from './categorias/categorias.module';
import { DesafiosModule } from './desafios/desafios.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DSN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    JogadoresModule,
    CategoriasModule,
    DesafiosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
