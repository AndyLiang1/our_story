import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export enum GET_DOCUMENTS_QUERY_OBJECT_TYPE {
    CALENDAR = 'CALENDAR',
    NEIGHBOURS = 'NEIGHBOURS',
    ALLSTORIES = 'ALLSTORIES',
    SYNC = 'SYNC'
}

export interface CustomRequest extends Request {
    collabToken: string | JwtPayload;
    userId: string;
}
