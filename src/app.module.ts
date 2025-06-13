import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { MedicinesModule } from './medicines/medicines.module';
import { SupportFamilyModule } from './support-family/support-family.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PacientesModule,
    MedicinesModule,
    SupportFamilyModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
