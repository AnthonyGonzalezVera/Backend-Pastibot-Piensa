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

  // 🔧 Middleware adicional por si Render ignora CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://frontend-pastibot-piensa.vercel.app');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();
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
