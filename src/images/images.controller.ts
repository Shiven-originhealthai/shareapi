import { Controller, Get, Param, Post, Req } from "@nestjs/common";
import { ImageService } from "./images.service";
import { Request } from "express";

//function for handling /images 
@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}// constructor for reading imge service which contain function for validatins

  //post request for recieving the images and responding back in string form for shareurl 
  @Post()
  recieve_images(@Req() req: Request) {
    return this.imageService.read_process(req);
  }

  // GET request for sharing validating a token 
  @Get('/share/:shareToken')
  Validation(@Param('shareToken') shareToken: string) {
    return this.imageService.validate(shareToken);
  }
  //POST request for validating otp
  @Post('/validateOtp')
  otp_validation(@Req() req:Request){
    return this.imageService.validate_otp(req)
  }
  //GET request for calling the endpoint of /generateotp 
  @Get('/generateotp')
  otp_generation(){
    return this.imageService.generate_otp_sevice
  }
}
