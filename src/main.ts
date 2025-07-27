import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Permitir localhost y Vercel
  const allowedOrigins = [
    'http://localhost:4200',
    'https://frontend-pastibot-piensa.vercel.app'
  ];

 app.enableCors({
  origin: [
    'http://localhost:4200',
    'https://frontend-pastibot-piensa.vercel.app',
    'https://frontend-pastibot-piensa-oa0ptuy9a.vercel.app'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
});


  // ✅ Validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
