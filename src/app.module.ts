import { Module } from '@nestjs/common';
import { GameGateway } from './gateway/game.gateway';
import { ConfigModule } from '@nestjs/config';
import { GameService } from './game/game.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
  ],
  providers: [GameGateway, GameService],
})
export class AppModule {}
