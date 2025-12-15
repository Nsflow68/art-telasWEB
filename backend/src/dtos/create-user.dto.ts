import { IsString, IsEmail, MinLength, Matches, Validate } from 'class-validator';
import { IsRut } from '../utils/rut.validator';

export class CreateUserDto {
    @IsString()
    @MinLength(2)
    nombre: string;

    @IsString()
    @MinLength(2)
    apellido: string;

    @IsEmail()
    email: string;

    @IsString()
    @Validate(IsRut)
    rut: string;

    @IsString()
    @MinLength(5)
    direccion: string;

    @IsString()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password too weak. Must contain uppercase, lowercase, number/special char'
    })
    password: string;
}
