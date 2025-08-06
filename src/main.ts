import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Lista de orígenes permitidos (Vercel + localhost)
  const allowedOrigins = [
    'http://localhost:4200',
    'https://frontend-pastibot-piensa.vercel.app',
    'https://frontend-pastibot-piensa-oa0ptuy9a.vercel.app',
    'https://frontend-pastibot-piensa-rol74k7ns.vercel.app',
  ];

  // ✅ Configurar CORS usando solo enableCors
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
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

  // ✅ Escuchar en el puerto de Render
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
