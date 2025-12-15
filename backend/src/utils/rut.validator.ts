import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

export function validateRut(rut: string): boolean {
    if (!rut || !/^[0-9]+-[0-9kK]{1}$/.test(rut)) return false;

    const split = rut.split('-');
    let num = parseInt(split[0]);
    const dv = split[1].toLowerCase();

    let m = 0, s = 1;
    for (; num; num = Math.floor(num / 10)) {
        s = (s + num % 10 * (9 - m++ % 6)) % 11;
    }

    const expectedDv = s ? (s - 1).toString() : 'k';
    return dv === expectedDv;
}

@ValidatorConstraint({ name: 'isRut', async: false })
export class IsRut implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments) {
        return validateRut(text);
    }

    defaultMessage(args: ValidationArguments) {
        return 'RUT ($value) is not valid. Format must be 12345678-k without dots';
    }
}
