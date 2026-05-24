import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
export class CreateSaleDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amountPaid!: number;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @IsDateString()
  @IsOptional()
  soldAt?: string;
}
