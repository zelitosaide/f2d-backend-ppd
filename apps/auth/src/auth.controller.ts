import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Get()
  // getHello(): string {
  //   return this.authService.getHello();
  // }
  @Post()
  getHello(@Body() create): string {
    return this.authService.getHello(create);
  }
}
