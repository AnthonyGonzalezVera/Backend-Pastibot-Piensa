import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Configurar CORS para Vercel y localhost
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://frontend-pastibot-piensa.vercel.app',
      'https://frontend-pastibot-piensa-oa0ptuy9a.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 🔧 Middleware adicional por si Render no respeta enableCors
  app.use((req, res, next) => {
    const allowedOrigin = req.headers.origin;
    const allowedOrigins = [
      'http://localhost:4200',
      'https://frontend-pastibot-piensa.vercel.app',
      'https://frontend-pastibot-piensa-oa0ptuy9a.vercel.app',
    ];

    if (allowedOrigins.includes(allowedOrigin)) {
      res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    );

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    next();
  });

  // ✅ Validación global para todos los DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // ✅ Escuchar en el puerto configurado (Render usa process.env.PORT)
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
