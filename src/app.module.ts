import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImageModule } from './images/images.module';

@Module({
  imports: [ImageModule], // Imports the image module
  controllers: [AppController],// Runs the intial function  for the api
  providers: [AppService], // Main logic behind the code is present here
})
export class AppModule {}
