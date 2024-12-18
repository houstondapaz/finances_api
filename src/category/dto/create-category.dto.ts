import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @Type(() => String)
  @IsString()
  name: string;

  @Type(() => String)
  @IsString()
  icon: string;
}
