import { NestFactory } from "@nestjs/core";
import { UserModule } from "./user.module";
import { ValidationPipe } from "@nestjs/common";

// https://learn.nestjs.com/courses/591712/lectures/23193765

async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(process.env.port ?? 4004);
}
bootstrap();
