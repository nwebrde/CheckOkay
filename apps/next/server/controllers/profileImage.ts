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
            Bucket: process.env.S3_BUCKET, // required
            Key: user.image, // required
        };
        try {
            const command = new DeleteObjectCommand(input);
            await s3.send(command).catch(e => {
                console.log(e)
            }).then(() => {console.log("finished")})
        } catch (e) {
            console.log(e)
        }

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
    return res.data.data["presigned_url"]
}

const getS3 = () => {
    return new S3Client({
        credentials: {
            accessKeyId: process.env.S3_KEY_ID!,
            secretAccessKey: process.env.S3_SECRET ?? ""
        },
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        forcePathStyle: process.env.S3_PATH_STYLE == "ja"
    });
}