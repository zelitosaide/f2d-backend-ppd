import { NestFactory } from "@nestjs/core";
import { RestaurantModule } from "./restaurant.module";

async function bootstrap() {
  const app = await NestFactory.create(RestaurantModule);
  // app.enableCors({
  //   origin: "*",
  //   methods: ["GET", "POST", "PATCH", "DELETE"],
  //   allowedHeaders: ["Content-Type", "Authorization"],
  // });
  await app.listen(process.env.port ?? 3003);
}
bootstrap();
