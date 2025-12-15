import { IsString, IsInt, IsOptional, Min, Length } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @Length(3, 100)
    nombre: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsInt()
    @Min(0)
    precio: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    stock?: number;

    @IsString()
    @IsOptional()
    imagen?: string;
}
