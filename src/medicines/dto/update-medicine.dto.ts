import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class UpdateMedicineDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  dosis?: string;

  @IsString()
  @IsOptional()
  frecuencia?: string;

  @IsDateString()
  @IsOptional()
  horaFecha?: string;

  @IsInt()
  @IsOptional()
  pacienteId?: number;

  @IsBoolean()
  @IsOptional()
  taken?: boolean;

  @IsInt()
  @IsOptional()
  durationInDays?: number;

  @IsInt()
  @IsOptional()
  totalDoses?: number;

  @IsInt()
  @IsOptional()
  dosesTaken?: number;
} 