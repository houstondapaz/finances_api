import { Type } from 'class-transformer';
import {
  IsString,
  IsPositive,
  IsOptional,
  IsDateString,
  IsUUID,
  IsNumber,
} from 'class-validator';

export class CreateTransactionDto {
  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  value: number;
  @Type(() => String)
  @IsDateString()
  date: string;
  @Type(() => String)
  @IsString()
  @IsOptional()
  description?: string;
  @IsUUID()
  @Type(() => String)
  categoryId: string;
}
