import {
    validate,
    ValidationError as ValidationErrorClass,
    ValidatorOptions,
} from "class-validator";

export interface ErrorMessage {
    message: string;
    field: string;
}

interface IResponse {
    errorsMessages: ErrorMessage[];
    resultCode: number;
}

/**
 * Функция возвращает массив ошибок.
 * @param errors
 * @returns
 */
export const setErrors = (errors: ErrorMessage[]): IResponse => {
    return {
        errorsMessages: errors,
        resultCode: 1,
    };
};

/**
 * Универсальный класс для валидации ошибок с использованием class-validator
 */
export class ValidationErrors {
    static setErrors: (errors: ErrorMessage[]) => IResponse;

    constructor() {
        ValidationErrors.setErrors = (errors: ErrorMessage[]): IResponse => {
            return {
                errorsMessages: errors,
                resultCode: 1,
            };
        };
    }

    static async validate(
        instance: Object,
        validatorOptions?: ValidatorOptions | undefined
    ) {
        const errors: ValidationErrorClass[] = await validate(instance, {
            skipNullProperties: true,
            // skipUndefinedProperties: true,
            ...(validatorOptions ? validatorOptions : {}),
        });

        if (errors.length > 0) {
            const result: ErrorMessage[] = await Promise.all(
                errors
                    .map((e) =>
                        Object.entries(e.constraints ?? []).map(
                            ([_key, value]) => ({
                                field: e.property,
                                message: value,
                            })
                        )
                    )
                    .flat(1)
            );

            return this.setErrors(this.sliceRepeatFields(result));
            // return this.setErrors(result);
        }
    }
    static sliceRepeatFields(errors: ErrorMessage[]): ErrorMessage[] {
        const uniqErrors = new Map();

        errors.map((error) => {
            if (!uniqErrors.has(error.field)) {
                uniqErrors.set(error.field, error);
            }
        });

        return Array.from(uniqErrors.values());
    }
}
