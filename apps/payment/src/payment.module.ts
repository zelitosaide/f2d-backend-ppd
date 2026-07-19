import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { NATS_CLIENT } from "./constants";
import { Payment } from "./entities/payment.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT!,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Payment]),
    ClientsModule.register([
      {
        name: NATS_CLIENT,
        transport: Transport.NATS,
        options: {
          servers: process.env.NATS_URL,
        },
      },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
