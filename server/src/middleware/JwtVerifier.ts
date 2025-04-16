import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { NextFunction, Request, Response } from 'express';
import { default as jsonwebtoken, default as jwt, JwtPayload } from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import { config } from '../config/config';
import { services } from '../services/services';
import { DocumentData } from '../types/DocumentTypes';

export interface CustomRequest extends Request {
    collabToken: string | JwtPayload;
    userId: string;
}

type DecodedFields = {
    userId: string;
};

export class JwtVerifier {
    private static verifier = CognitoJwtVerifier.create({
        userPoolId: config.awsUser.cognitoUserPoolId as string,
        tokenUse: 'id',
        clientId: config.awsUser.cognitoClientId as string
    });
    private static tiptapSecret = config.tiptap.appSecret as string;

    static async verifyAwsCognitoJwt(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) {
                throw new Error('No token found.');
            }
            await JwtVerifier.verifier.verify(token);
            console.log('Verified.');
        } catch (err) {
            console.error(err);
            return res.status(403).json({
                message: 'Not authorized.'
            });
        }
        next();
    }

    static async generateTipTapCollabToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) {
                throw new Error('No token found.');
            }
            var data: any = jwtDecode(token);
            const user = await services.userService.getUserByEmail(data.email);
            const userId = user?.getDataValue('userId');
            const docs = (await services.documentService.getDocuments(userId, null)) as DocumentData[];
            const allowDocumentNames = docs.map((doc) => doc.documentId);
            data = {
                ...data,
                allowDocumentNames,
                userId
            };
            const jwt = jsonwebtoken.sign(data, JwtVerifier.tiptapSecret);
            return res.status(200).json({
                token: jwt
            });
        } catch (err) {
            console.error(err);
            return res.status(403).json({
                message: 'Not authorized.'
            });
        }
    }

    static async verifyCollabToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) {
                throw new Error('No token found.');
            }
            const decoded = jwt.verify(token, JwtVerifier.tiptapSecret) as DecodedFields;
            (req as CustomRequest).collabToken = decoded;
            (req as CustomRequest).userId = decoded.userId;
            console.log('Verified.');
        } catch (err) {
            console.error(err);
            return res.status(403).json({
                message: 'Not authorized.'
            });
        }
        next();
    }
}
