import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateStockBatchDto {
  @IsInt()
  @Min(1)
  quantityBought!: number;

  @IsNumber()
  @Min(0)
  costPerBag!: number;

  @IsNumber()
  @Min(0)
  sellingPricePerBag!: number;

  @IsDateString()
  @IsOptional()
  suppliedAt?: string;
}
