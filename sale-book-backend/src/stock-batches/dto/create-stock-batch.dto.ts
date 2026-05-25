import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStockBatchDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantityBought!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  costPerBag!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  sellingPricePerBag!: number;

  @IsOptional()
  @IsDateString()
  suppliedAt?: string;
}
