import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupportFamilyService {
  constructor(private prisma: PrismaService) {}

  async create(pacienteId: number, phoneNumber: string) {
    // Verificar que el paciente existe
    const paciente = await this.prisma.paciente.findUnique({
      where: { id: pacienteId },
    });

    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }

    return this.prisma.supportFamily.create({
      data: {
        phoneNumber,
        pacienteId,
      },
    });
  }

  async findByPacienteId(pacienteId: number) {
    const supportFamily = await this.prisma.supportFamily.findMany({
      where: { pacienteId },
    });

    return supportFamily;
  }

  async update(pacienteId: number, data: { phoneNumber?: string; status?: string }) {
    const existingSupportFamily = await this.prisma.supportFamily.findFirst({
      where: { pacienteId },
    });

    if (!existingSupportFamily) {
      throw new NotFoundException('No se encontró un familiar de apoyo para este paciente');
    }

    return this.prisma.supportFamily.update({
      where: { id: existingSupportFamily.id },
      data,
    });
  }

  async delete(pacienteId: number) {
    const existingSupportFamily = await this.prisma.supportFamily.findFirst({
      where: { pacienteId },
    });

    if (!existingSupportFamily) {
      throw new NotFoundException('No se encontró un familiar de apoyo para este paciente');
    }

    return this.prisma.supportFamily.delete({
      where: { id: existingSupportFamily.id },
    });
  }
} 