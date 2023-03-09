import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  private readonly logger = new Logger(AwsService.name);

  public async uploadArquivo(file: any, id: string) {
    const AWS_REGION = process.env.AWS_REGION;
    const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
    const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
    const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

    const s3 = new AWS.S3({
      region: AWS_REGION,
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    });
    const fileExtension = file.originalname.split('.')[1];
    const urlKey = `${id}.${fileExtension}`;
    const params = {
      Body: file.buffer,
      Bucket: `${AWS_S3_BUCKET_NAME}`,
      Key: urlKey,
    };
    const data = s3
      .putObject(params)
      .promise()
      .then(
        () => {
          return {
            url: `https://${AWS_S3_BUCKET_NAME}.s3-${AWS_REGION}.amazonaws.com/${urlKey}`,
          };
        },
        (err) => {
          this.logger.error(err);
          return err;
        },
      );
    return data;
  }
}
