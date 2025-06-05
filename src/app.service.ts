import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): {} {
    return  {
      status:"The api is responding  / images is the main endpoint for response "
    }
  }
}
