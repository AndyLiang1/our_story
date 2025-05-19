export const documentNotFoundMessage = (documentId: string) => {
    return `Error. Document with documentId: ${documentId} could not be found or you do not have permission to access it.`;
};

export const userNotFoundMessage = (emailOrUserId: string) => {
    return `Error. User with email or userId: ${emailOrUserId} could not be found.`;
};

export const defaultNotFoundMessage = 'Not found.';
export const defaultBadRequestMessage = 'Bad Request.';
export const defaultUnauthorizedMessage = 'Error. Unauthorized.';

export enum errorType {
    NOT_FOUND = 'NotFoundError',
    BAD_REQUEST = 'BadRequestError',
    UNAUTHORIZED = 'Unauthorized'
}

function getCallerFunctionName(): string | undefined {
    const err = new Error();
    const stack = err.stack?.split('\n') || [];
    const callerLine = stack[3];
    const match = callerLine?.match(/\(([^)]+)\)/);
    return match?.[1];
}

export class NotFoundError extends Error {
    constructor(message?: string) {
        const location = getCallerFunctionName();
        super(`${location} ${message ? message : defaultNotFoundMessage}`);
        this.name = errorType.NOT_FOUND;
    }
}

export class BadRequestError extends Error {
    constructor(message?: string) {
        const location = getCallerFunctionName();
        super(`${location} ${message ? message : defaultBadRequestMessage}`);
        this.name = errorType.BAD_REQUEST;
    }
}

export class UnauthorizedError extends Error {
    constructor(message?: string) {
        const location = getCallerFunctionName();
        super(`${location} ${message ? message : defaultUnauthorizedMessage}`);
        this.name = errorType.UNAUTHORIZED;
    }
}