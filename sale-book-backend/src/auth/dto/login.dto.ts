import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @Length(4, 6)
  pin!: string;
}
