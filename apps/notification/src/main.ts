import { NestFactory } from "@nestjs/core";
import { NotificationModule } from "./notification.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);

  // Microservice
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.NATS,
      options: {
        servers: process.env.NATS_URL,
      },
    },
    { inheritAppConfig: true },
  );
  await app.startAllMicroservices();

  await app.listen(process.env.port ?? 4005);
}
bootstrap();
