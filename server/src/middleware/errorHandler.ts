import { NextFunction, Request, Response } from 'express';
import { errorType } from '../helpers/ErrorHelpers';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    switch (err.name) {
        case errorType.NOT_FOUND:
            return res.status(404).json({
                message: 'Resource not found or you do not have permission to access it.'
            });

        case errorType.BAD_REQUEST:
            return res.status(400).json({
                message: 'Bad request.'
            });

        case errorType.UNAUTHORIZED:
            return res.status(401).json({
                message: 'Unauthorized.'
            });

        default:
            return res.status(500).json({
                message: 'Something went wrong.'
            });
    }
};
