export const documentNotFound = (documentId: string) => {
    return `Error. Document with documentId: ${documentId} could not be found (for this use case).`;
};

export enum errorType {
    NOT_FOUND = 'NotFoundError',
    BAD_REQUEST = 'BadRequestError'
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = errorType.NOT_FOUND;
    }
}

export class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
        this.name = errorType.BAD_REQUEST;
    }
}
