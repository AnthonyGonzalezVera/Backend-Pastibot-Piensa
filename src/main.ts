import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Configurar CORS para desarrollo y producción (Vercel)
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://frontend-pastibot-piensa.vercel.app'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // ✅ Validación global para DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // ✅ Iniciar servidor en puerto del entorno o 3000
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
