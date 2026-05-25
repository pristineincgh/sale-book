import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @Length(4, 6)
  @IsOptional()
  pin?: string;
}
