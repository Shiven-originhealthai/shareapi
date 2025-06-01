import { Controller, Get, Param, Post, Req } from "@nestjs/common";
import { ImageService } from "./images.service";
import { Request } from "express";

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  recieve_images(@Req() req: Request) {
    return this.imageService.read_process(req);
  }

  @Get('/share/:shareToken')
  Validation(@Param('shareToken') shareToken: string) {
    return this.imageService.validate(shareToken);
  }
  @Post('/validateOtp')
  otp_validation(@Req() req:Request){
    return this.imageService.validate_otp(req)
  }
  @Get('/generateotp')
  otp_generation(){
    return this.imageService.generate_otp_sevice
  }
}
