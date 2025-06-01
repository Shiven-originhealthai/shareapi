import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImageModule } from './images/images.module';

@Module({
  imports: [ImageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
