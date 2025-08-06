import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios'; // 👈 asegurarse de haber hecho: npm install axios

@Injectable()
export class SupportFamilyService {
  constructor(private prisma: PrismaService) {}

  async create(pacienteId: number, phoneNumber: string) {
    // 1. Verificar que el paciente existe
    const paciente = await this.prisma.paciente.findUnique({
      where: { id: pacienteId },
    });

    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }

    // 2. Enviar mensaje WhatsApp usando UltraMsg
    try {
      const mensaje = `👋 Hola, eres el nuevo cuidador de este paciente: ${paciente.nombre} en la app Pastibot 🩺. 


Recibirás recordatorios de medicamentos y actualizaciones importantes. 

¡Gracias por tu apoyo! ❤️

📲 Accede a la app aquí:
 https://frontend-pastibot-pien-git-f9c51b-anthonygonzalezveras-projects.vercel.app/caregiver`; // ← cambia esto si subes a Vercel
      await axios.post(
        'https://api.ultramsg.com/instance133754/messages/chat',
        new URLSearchParams({
          token: 'ngp8lassoao0iz6d',
          to: phoneNumber,
          body: mensaje,
          priority: '10',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
    } catch (error) {
      console.error('❌ Error al enviar WhatsApp:', error.message);
    }

    // 3. Guardar en base de datos
    return this.prisma.supportFamily.create({
      data: {
        phoneNumber,
        pacienteId,
      },
    });
  }

  async findByPacienteId(pacienteId: number) {
    return this.prisma.supportFamily.findMany({
      where: { pacienteId },
    });
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
