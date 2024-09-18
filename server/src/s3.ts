import aws from 'aws-sdk'
import {config} from "./config/config"

export const s3 = new aws.S3({
    region: config.awsS3.region,
    accessKeyId: config.awsS3.accessKey,
    secretAccessKey: config.awsS3.secretAccessKey
})

