import {
    IsInt,
    Length,
    Matches,
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
        resultCode: 0,
    };
};

export class ValidationErrors {
    static setErrors: (errors: ErrorMessage[]) => IResponse;

    constructor() {
        ValidationErrors.setErrors = (errors: ErrorMessage[]): IResponse => {
            return {
                errorsMessages: errors,
                resultCode: 0,
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
            const result = await Promise.all(
                errors
                    .map((e) =>
                        Object.entries(e.constraints ?? []).map(
                            ([key, value]) => ({
                                field: e.property,
                                message: value,
                            })
                        )
                    )
                    .flat(1)
            );

            return this.setErrors(result);
        }
    }
}
