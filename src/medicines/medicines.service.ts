import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicineDto, MedicineCreatedBy } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

// Define a type that mimics Prisma.MedicineCreateManyInput as much as possible
interface MedicineCreateInput {
  nombre: string;
  dosis: string;
  frecuencia: string;
  horaFecha: Date; // Prisma expects Date objects for DateTime
  taken: boolean; // Not optional, has default in schema
  dosesTaken: number; // Not optional, has default in schema
  userId: number;
  pacienteId: number | null; // Must be null, not undefined
  durationInDays: number | null; // Must be null, not undefined
  totalDoses: number | null; // Must be null, not undefined
  createdBy: string;
}

@Injectable()
export class MedicinesService {
  constructor(private prisma: PrismaService) {}

  async create(createMedicineDto: CreateMedicineDto, userId: number) {
    const { nombre, dosis, frecuencia, horaFecha, taken, dosesTaken, pacienteId, durationInDays, totalDoses, createdBy } = createMedicineDto;

    // Normalizar los datos
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

    // Si hay duración o dosis totales, crear múltiples entradas
    if (normalizedRest.durationInDays || normalizedRest.totalDoses) {
      const medicinesToCreate: MedicineCreateInput[] = [];
      const startDate = new Date(normalizedRest.horaFecha);
      const endDate = new Date(startDate);

      if (normalizedRest.durationInDays) {
        endDate.setDate(endDate.getDate() + normalizedRest.durationInDays);
      }

      // Calcular dosis por día basado en la frecuencia
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
          totalDoses: 1, // Set to 1 for individual dose in bulk creation
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
      // For single medicine creation, use the provided totalDoses or default to 1
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
          totalDoses: normalizedRest.totalDoses ?? 1, // Use provided totalDoses or default to 1
          createdBy: normalizedRest.createdBy
        },
      });
    }
  }

  async findAll(userId: number) {
    return this.prisma.medicine.findMany({
      where: { userId },
      orderBy: { horaFecha: 'asc' },
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