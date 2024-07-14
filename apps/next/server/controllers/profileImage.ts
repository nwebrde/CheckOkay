import {db} from "db";
import { getUser } from '../adapters/db/users'
import { users } from 'db/schema/auth'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'



export const setProfileImage = async (userId: string, key: string) => {
    const s3 = getS3();

    const user = await getUser(userId, false, false)

    if(user && user.image) {
        const input = { // DeleteObjectRequest
            Bucket: process.env.S3_BUCKET!, // required
            Key: (process.env.S3_PROFILE_IMAGE_DIR ? (process.env.S3_PROFILE_IMAGE_DIR + "/") : "") + user.image, // required
        };
        const command = new DeleteObjectCommand(input);
        const response = await s3.send(command);
    }

    const res = await db.update(users)
    .set({ image: key })
    .where(eq(users.id, userId));

    return res[0].affectedRows > 0
}

export const getUploadUrl = async () => {
    console.log("s1")
    const s3 = getS3();
    console.log("s2")
    const fileId = randomUUID();
    console.log("s3")
    const signedUrlExpireSeconds = 60 * 15;
    console.log("s4")
    const key = `${fileId}.jpg`
    console.log("s5")
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: (process.env.S3_PROFILE_IMAGE_DIR ? (process.env.S3_PROFILE_IMAGE_DIR + "/") : "") + key,
        ContentType: "image/jpeg"
    });
    console.log("s6")
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    console.log("s7")
    return {
        uploadUrl: url,
        key: key
    }
}

const getS3 = () => {
    return new S3Client({
        credentials: {
            accessKeyId: process.env.S3_KEY_ID!,
            secretAccessKey: process.env.S3_SECRET ?? ""
        },
        region: !process.env.S3_ENDPOINT ? process.env.S3_REGION : undefined,
        endpoint: process.env.S3_ENDPOINT,
    });
}