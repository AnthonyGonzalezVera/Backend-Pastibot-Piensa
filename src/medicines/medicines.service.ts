import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicineDto, MedicineCreatedBy } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

interface MedicineCreateInput {
  nombre: string;
  dosis: string;
  frecuencia: string;
  horaFecha: Date;
  taken: boolean;
  dosesTaken: number;
  userId: number;
  pacienteId: number | null;
  durationInDays: number | null;
  totalDoses: number | null;
  createdBy: string;
}

@Injectable()
export class MedicinesService {
  constructor(private prisma: PrismaService) {}

  async create(createMedicineDto: CreateMedicineDto, userId: number) {
    const { nombre, dosis, frecuencia, horaFecha, taken, dosesTaken, pacienteId, durationInDays, totalDoses, createdBy } = createMedicineDto;

    const normalizedRest = {
      nombre,
      dosis,
      frecuencia,
      horaFecha,
      taken: taken ?? false,
      dosesTaken: dosesTaken ?? 0,
      pacienteId: pacienteId ?? null,
      durationInDays: durationInDays ?? null,
      totalDoses: totalDoses ?? null,
      createdBy: createdBy ?? MedicineCreatedBy.MANUAL
    };

    if (normalizedRest.durationInDays || normalizedRest.totalDoses) {
      const medicinesToCreate: MedicineCreateInput[] = [];
      const startDate = new Date(normalizedRest.horaFecha);
      const endDate = new Date(startDate);

      if (normalizedRest.durationInDays) {
        endDate.setDate(endDate.getDate() + normalizedRest.durationInDays);
      }

      let dosesPerDay = 1;
      if (normalizedRest.frecuencia.toLowerCase().includes('cada')) {
        const match = normalizedRest.frecuencia.match(/cada (\d+)/i);
        if (match) {
          const hours = parseInt(match[1]);
          dosesPerDay = 24 / hours;
        }
      }

      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const medicineDataForCreateMany: MedicineCreateInput = {
          nombre: normalizedRest.nombre,
          dosis: normalizedRest.dosis,
          frecuencia: normalizedRest.frecuencia,
          horaFecha: new Date(currentDate),
          taken: false,
          dosesTaken: 0,
          userId: userId,
          pacienteId: normalizedRest.pacienteId,
          durationInDays: normalizedRest.durationInDays,
          totalDoses: 1,
          createdBy: normalizedRest.createdBy
        };

        medicinesToCreate.push(medicineDataForCreateMany);

        const hoursToAdd = 24 / dosesPerDay;
        currentDate.setHours(currentDate.getHours() + hoursToAdd);
      }

      return this.prisma.medicine.createMany({
        data: medicinesToCreate,
        skipDuplicates: true,
      });
    } else {
      return this.prisma.medicine.create({
        data: {
          nombre: normalizedRest.nombre,
          dosis: normalizedRest.dosis,
          frecuencia: normalizedRest.frecuencia,
          horaFecha: new Date(normalizedRest.horaFecha),
          taken: normalizedRest.taken,
          dosesTaken: normalizedRest.dosesTaken,
          userId: userId,
          pacienteId: normalizedRest.pacienteId,
          durationInDays: normalizedRest.durationInDays,
          totalDoses: normalizedRest.totalDoses ?? 1,
          createdBy: normalizedRest.createdBy
        },
      });
    }
  }

  // ✅ Para Activar Dispensador (máximo 4 únicos, MANUAL)
  async findAll(userId: number) {
    const meds = await this.prisma.medicine.findMany({
      where: {
        userId,
        createdBy: 'MANUAL',
      },
      orderBy: {
        horaFecha: 'desc',
      },
      take: 50,
    });

    const unicos: any[] = [];
    const nombres = new Set();

    for (const med of meds) {
      if (!nombres.has(med.nombre)) {
        unicos.push(med);
        nombres.add(med.nombre);
      }
      if (unicos.length === 4) break;
    }

    return unicos;
  }

  // ✅ Para Agenda: Diario / Semanal / Mensual (sin límite)
  async findAllExpanded(userId: number) {
    return this.prisma.medicine.findMany({
      where: {
        userId,
      },
      orderBy: {
        horaFecha: 'asc',
      },
      include: {
        paciente: true,
      },
    });
  }

  async findOne(id: number, userId: number) {
    const medicine = await this.prisma.medicine.findFirst({
      where: { id, userId },
      include: {
        paciente: true,
      },
    });

    if (!medicine) {
      throw new NotFoundException(`Medicine with ID ${id} not found`);
    }

    return medicine;
  }

  async update(id: number, updateMedicineDto: UpdateMedicineDto, userId: number) {
    const medicine = await this.findOne(id, userId);

    const updateData: any = { ...updateMedicineDto };
    if (updateMedicineDto.horaFecha) {
      updateData.horaFecha = new Date(updateMedicineDto.horaFecha);
    }

    return this.prisma.medicine.update({
      where: { id },
      data: updateData,
      include: {
        paciente: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    const medicine = await this.findOne(id, userId);

    return this.prisma.medicine.delete({
      where: { id },
    });
  }
}
