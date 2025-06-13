import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, userId: number) {
    return this.prisma.paciente.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAllByUser(userId: number) {
    return this.prisma.paciente.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const paciente = await this.prisma.paciente.findFirst({
      where: { id, userId },
    });
    if (!paciente) throw new NotFoundException('Paciente no encontrado');
    return paciente;
  }

  async update(id: number, userId: number, data: any) {
    await this.findOne(id, userId);
    return this.prisma.paciente.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    return this.prisma.paciente.delete({
      where: { id },
    });
  }
} 