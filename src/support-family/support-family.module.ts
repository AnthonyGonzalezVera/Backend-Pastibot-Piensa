import { Module } from '@nestjs/common';
import { SupportFamilyController } from './support-family.controller';
import { SupportFamilyService } from './support-family.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SupportFamilyController],
  providers: [SupportFamilyService, PrismaService],
  exports: [SupportFamilyService],
})
export class SupportFamilyModule {} 