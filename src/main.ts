
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from './app.module';
import {join} from 'path';
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('Evergreen')
    .setDescription('The flower-club API description')
    .setVersion('1.0')
    .addBearerAuth()

    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)


  app.useStaticAssets(join(__dirname, '..', 'public'))

  const Port = process.env.PORT || 5000
  await app.listen(Port)
}
bootstrap()
