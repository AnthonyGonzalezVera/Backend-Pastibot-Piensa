import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'http://localhost:4200',
    'https://frontend-pastibot-piensa.vercel.app',
    'https://frontend-pastibot-piensa-oa0ptuy9a.vercel.app',
    'https://frontend-pastibot-piensa-rol74k7ns.vercel.app',
  ];

  // ✅ Primero habilita CORS correctamente
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // ✅ Luego agrega el middleware EXPRESS manual (antes del listen)
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );

    // ⚠️ MUY IMPORTANTE: respuesta rápida para preflight
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }

    next();
  });

  // ✅ Validaciones
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // ✅ Escucha
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
