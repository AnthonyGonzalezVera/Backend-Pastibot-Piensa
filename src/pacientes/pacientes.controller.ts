import { Controller, Get, Post, Body, Param, Delete, Put, Request, UseGuards } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post()
  create(@Body() data: any, @Request() req) {
    return this.pacientesService.create(data, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.pacientesService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.pacientesService.findOne(Number(id), req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.pacientesService.update(Number(id), req.user.id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.pacientesService.remove(Number(id), req.user.id);
  }
} 