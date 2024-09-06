import { CognitoJwtVerifier } from "aws-jwt-verify"
import { config } from "../config/config"
import { NextFunction, Request, Response} from "express"

// export const JwtVerifier = CognitoJwtVerifier.create({
//     userPoolId: config.awsCognito.userPoolId as string,
//     tokenUse: "id",
//     clientId: config.awsCognito.clientId,
// })

export class JwtVerifier {
    private static verifier = CognitoJwtVerifier.create({
        userPoolId: config.awsCognito.userPoolId as string,
        tokenUse: "id",
        clientId: config.awsCognito.clientId as string,
    })

    static async verifyJwt(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) {
                throw new Error("No token found.")
            }
            await JwtVerifier.verifier.verify(token)
            console.log("Verified.")
        } catch (err) {
            console.error(err)
            return res.status(403).json({
                message: "Not authorized."
            })
        }
        next()
    }
}