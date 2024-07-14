import {db} from "db";
import { getUser } from '../adapters/db/users'
import { users } from 'db/schema/auth'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from 'axios';

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
    const fileId = randomUUID();
    const key = `${fileId}.jpg`
    const url = await presignUrl((process.env.S3_PROFILE_IMAGE_DIR ? (process.env.S3_PROFILE_IMAGE_DIR + "/") : "") + key);
    return {
        uploadUrl: url,
        key: key
    }
}

const presignUrl = async (key: string): Promise<string | undefined> => {
    let data = JSON.stringify({
        "ttl": 60 * 5
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.telnyx.com/v2/storage/buckets/'+process.env.S3_BUCKET+'/'+key+'/presigned_url',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + process.env.S3_KEY_ID
        },
        data : data
    };

    const res = await axios.request(config)
    console.log(res)
    console.log(res.data)
    console.log(res.data.presigned_url)
    return res.data.presigned_url
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