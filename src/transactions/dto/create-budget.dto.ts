import { Type } from 'class-transformer';
import { IsPositive, IsNumber } from 'class-validator';

export class CreateBudgetDto {
  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  value: number;
}
