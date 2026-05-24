import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateSaleDto {
  @IsInt()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @Min(0)
  amountPaid!: number;

  @IsString()
  @IsOptional()
  customerName?: string;

  @IsDateString()
  @IsOptional()
  soldAt?: string;
}
