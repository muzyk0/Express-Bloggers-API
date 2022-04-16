interface ErrorMessage {
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
