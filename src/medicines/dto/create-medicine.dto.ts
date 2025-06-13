import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, IsBoolean, IsEnum } from 'class-validator';

export enum MedicineCreatedBy {
  MANUAL = 'manual',
  CHATBOT = 'chatbot',
  SYSTEM = 'system'
}

export class CreateMedicineDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  dosis: string;

  @IsString()
  @IsNotEmpty()
  frecuencia: string;

  @IsDateString()
  @IsNotEmpty()
  horaFecha: string;

  @IsBoolean()
  @IsOptional()
  taken?: boolean;

  @IsInt()
  @IsOptional()
  pacienteId?: number;

  @IsInt()
  @IsOptional()
  durationInDays?: number;

  @IsInt()
  @IsOptional()
  totalDoses?: number;

  @IsInt()
  @IsOptional()
  dosesTaken?: number;

  @IsEnum(MedicineCreatedBy)
  @IsOptional()
  createdBy?: MedicineCreatedBy;
} 