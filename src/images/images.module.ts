// image.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ImageController } from './images.controller'
import { ImageService } from './images.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'Shiven@1104', 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
