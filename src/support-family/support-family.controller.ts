import { Controller, Post, Get, Patch, Delete, Body, UseGuards, Request, Param } from '@nestjs/common';
import { SupportFamilyService } from './support-family.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('support-family')
@UseGuards(JwtAuthGuard)
export class SupportFamilyController {
  constructor(private readonly supportFamilyService: SupportFamilyService) {}

  @Post(':pacienteId')
  async create(
    @Param('pacienteId') pacienteId: string,
    @Body() body: { phoneNumber: string }
  ) {
    return this.supportFamilyService.create(parseInt(pacienteId), body.phoneNumber);
  }

  @Get(':pacienteId')
  async findOne(@Param('pacienteId') pacienteId: string) {
    return this.supportFamilyService.findByPacienteId(parseInt(pacienteId));
  }

  @Patch(':pacienteId')
  async update(
    @Param('pacienteId') pacienteId: string,
    @Body() body: { phoneNumber?: string; status?: string }
  ) {
    return this.supportFamilyService.update(parseInt(pacienteId), body);
  }

  @Delete(':pacienteId')
  async delete(@Param('pacienteId') pacienteId: string) {
    return this.supportFamilyService.delete(parseInt(pacienteId));
  }
} 