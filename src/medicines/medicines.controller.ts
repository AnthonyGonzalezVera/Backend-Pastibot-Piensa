import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request
} from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('medicines')
@UseGuards(JwtAuthGuard)
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Post()
  create(@Body() createMedicineDto: CreateMedicineDto, @Request() req) {
    return this.medicinesService.create(createMedicineDto, req.user.id);
  }

  // ✅ Para Activar Dispensador (4 medicamentos únicos)
  @Get()
  findAll(@Request() req) {
    return this.medicinesService.findAll(req.user.id);
  }

  // ✅ NUEVO: Para cargar la Agenda completa (sin límite, con paciente incluido)
  @Get('agenda')
  findAllExpanded(@Request() req) {
    return this.medicinesService.findAllExpanded(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.medicinesService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicineDto: UpdateMedicineDto,
    @Request() req,
  ) {
    return this.medicinesService.update(+id, updateMedicineDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.medicinesService.remove(+id, req.user.id);
  }
}
