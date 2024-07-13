import { Credentials } from 'aws-sdk'
import S3 from 'aws-sdk/clients/s3'
import {db} from "db";
import { getUser } from '../adapters/db/users'
import { users } from 'db/schema/auth'
import { eq } from 'drizzle-orm'
import { v4 as uuid } from 'uuid'

/*

export const setProfileImage = async (userId: string, key: string) => {
    const s3 = getS3();

    const user = await getUser(userId, false, false)

    if(user && user.image) {
        s3.deleteObject({
            Bucket: process.env.S3_BUCKET!,
            Key: process.env.S3_PROFILE_IMAGE_DIR ?? "" + user.image
        })
    }

    const res = await db.update(users)
    .set({ image: key })
    .where(eq(users.id, userId));

    return res[0].affectedRows > 0
}

export const getUploadUrl = async () => {
    const s3 = getS3();

    const fileId = uuid();
    const signedUrlExpireSeconds = 60 * 15;

    const key = `${fileId}.jpg`

    const url = await s3.getSignedUrlPromise("putObject", {
        Bucket: process.env.S3_BUCKET,
        Key: process.env.S3_PROFILE_IMAGE_DIR ?? "" + key,
        ContentType: "image/jpeg",
        Expires: signedUrlExpireSeconds,
    });

    return {
        uploadUrl: url,
        key: key
    }
}

const getS3 = () => {
    const access = new Credentials({
        accessKeyId: process.env.S3_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET!,
    });

    return new S3({
        credentials: access,
        endpoint: process.env.S3_ENDPOINT,
        region: !process.env.S3_ENDPOINT ? process.env.S3_REGION : undefined,
        signatureVersion: "v4",
    });
}

 */