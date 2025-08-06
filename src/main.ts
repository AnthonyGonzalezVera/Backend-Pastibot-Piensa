import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS dinámico para dominios temporales de Vercel y localhost
  app.enableCors({
    origin: (origin, callback) => {
      const regexVercel = /^https:\/\/frontend-pastibot-piensa.*\.vercel\.app$/;
      const isAllowed =
        !origin || origin === 'http://localhost:4200' || regexVercel.test(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`❌ Bloqueado por CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // ✅ Validaciones globales
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // ✅ Escuchar en el puerto asignado por Render
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
