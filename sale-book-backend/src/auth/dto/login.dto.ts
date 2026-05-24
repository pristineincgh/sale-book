import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @Length(4, 6)
  pin!: string;
}
