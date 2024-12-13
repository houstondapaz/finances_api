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
  @Type(() => Date)
  @IsDateString()
  date: Date;
  @Type(() => String)
  @IsString()
  @IsOptional()
  description?: string;
  @IsUUID()
  @Type(() => String)
  categoryId: string;
}
