import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { StockBatchStatus } from 'src/generated/prisma/enums';

export class UpdateStockBatchDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  quantityBought?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  costPerBag?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  sellingPricePerBag?: number;

  @IsDateString()
  @IsOptional()
  suppliedAt?: string;

  @IsEnum(StockBatchStatus)
  @IsOptional()
  status?: StockBatchStatus;
}
