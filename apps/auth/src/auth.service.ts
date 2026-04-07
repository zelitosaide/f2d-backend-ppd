import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  getHello(create): any {
    console.log(create);
    return create;
    // return 'Hello World!';
  }
}
