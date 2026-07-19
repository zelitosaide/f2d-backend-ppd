import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { MPESA_BEARER_TOKEN, NATS_CLIENT } from "./constants";
import {
  PaginationQueryDto,
  PaymentMethod,
  PaymentStatus,
} from "libs/common/src";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";

@Injectable()
export class PaymentService {
  constructor(
    @Inject(NATS_CLIENT)
    private readonly natsClient: ClientProxy,
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
  ) {}
  private readonly logger = new Logger(PaymentService.name);

  private async processMpesa(
    dto: CreatePaymentDto,
    transactionReference: string,
    thirdPartyReference: string,
  ) {
    try {
      const res = await fetch(
        "https://api.sandbox.vm.co.mz:18352/ipg/v1x/c2bPayment/singleStage/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: "developer.mpesa.vm.co.mz",
            Authorization: `Bearer ${MPESA_BEARER_TOKEN}`,
          },
          body: JSON.stringify({
            input_TransactionReference: transactionReference,
            input_CustomerMSISDN: dto.phone_number,
            input_Amount: dto.amount,
            input_ThirdPartyReference: thirdPartyReference,
            input_ServiceProviderCode: "171717",
          }),
        },
      );

      const data = await res.json();

      return {
        success: data.output_ResponseCode === "INS-0",
        conversation_id: data.output_ConversationID,
        transaction_id: data.output_TransactionID,
        response_code: data.output_ResponseCode,
        response_desc: data.output_ResponseDesc,
      };

      // // Returning a mock response for testing purposes
      // return {
      //   success: true,
      //   conversation_id: "mock_conversation_id",
      //   transaction_id: "mock_transaction_id",
      //   response_code: "INS-0",
      //   response_desc: "Success",
      // };
    } catch (error) {
      this.logger.error(error);
      return { success: false };
    }
  }

  async create(createPaymentDto: CreatePaymentDto) {
    const payment = this.paymentsRepository.create(createPaymentDto);
    let response: any;

    const transactionReference = `${createPaymentDto.order_id}PAYZAASTEC`;
    const thirdPartyReference = `${createPaymentDto.order_id}ORDER${Date.now()}`;

    switch (createPaymentDto.method) {
      case PaymentMethod.MPESA:
        response = await this.processMpesa(
          createPaymentDto,
          transactionReference,
          thirdPartyReference,
        );
        break;
      case PaymentMethod.EMOLA:
        response = await this.processEmola(createPaymentDto);
        break;
      case PaymentMethod.MKESH:
        response = await this.processMkesh(createPaymentDto);
        break;
      case PaymentMethod.CARD:
        response = await this.processCard(createPaymentDto);
        break;
      case PaymentMethod.CASH:
        response = await this.processCash(createPaymentDto);
        break;
      default:
        throw new BadRequestException("Unsupported payment method");
    }

    payment.status = response.success
      ? PaymentStatus.PAID
      : PaymentStatus.FAILED;

    payment.mpesa_conversation_id = response.conversation_id ?? null;
    payment.mpesa_transaction_id = response.transaction_id ?? null;
    payment.mpesa_response_code = response.response_code ?? null;
    payment.mpesa_response_desc = response.response_desc ?? null;

    return this.paymentsRepository.save(payment);
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<Payment[]> {
    const { limit, offset } = paginationQuery;
    return this.paymentsRepository.find({
      skip: offset,
      take: limit,
    });
  }

  private async processEmola(createPaymentDto: CreatePaymentDto) {}

  private async processMkesh(createPaymentDto: CreatePaymentDto) {}

  private async processCard(createPaymentDto: CreatePaymentDto) {}

  private async processCash(createPaymentDto: CreatePaymentDto) {}
}
