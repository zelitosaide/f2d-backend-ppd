import { Injectable } from "@nestjs/common";

@Injectable()
export class OrderService {
  getHello(): string {
    return "Hello From Order Service!";
  }
}
