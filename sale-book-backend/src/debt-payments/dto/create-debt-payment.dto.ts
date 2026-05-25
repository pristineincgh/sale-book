import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateDebtPaymentDto {
  @IsUUID()
  saleId!: string;

  @IsNumber()
  @Min(1)
  amount!: number;

  @IsDateString()
  @IsOptional()
  paidAt?: string;
}
