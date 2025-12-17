import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { PaymentsModule } from './payments/payments.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [PaymentsModule],
})
export class PaymentModule {}
