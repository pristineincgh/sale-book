import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 6)
  pin!: string;
}
