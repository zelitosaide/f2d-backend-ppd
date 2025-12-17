import { Inject, Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { lastValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { PAYMENTS_SERVICE } from "../constants";

@Injectable()
export class OrdersService {
  constructor(
    @Inject(PAYMENTS_SERVICE)
    private readonly paymentsService: ClientProxy,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    return "This action adds a new order";
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  createOrderFromCart(orderPayload: { userId: number }) {
    this.processPayment();
  }

  private async processPayment() {
    await lastValueFrom(
      this.paymentsService.send("createPayment", {
        currency: "BRL",
        paymentMethod: "credit_card",
      }),
    );
  }
}
