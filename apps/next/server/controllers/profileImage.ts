import {db} from "db";
import { users } from 'db/schema/auth'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import {
    S3Client,
    DeleteObjectCommand,
    PutObjectCommand,
    PutObjectAclCommand,
    ObjectCannedACL
} from '@aws-sdk/client-s3'
import axios from 'axios';

export const setProfileImage = async (userId: string, key: string) => {
    await deleteCurrentProfileImage(userId)
    //await makeProfileImagePublic(key)

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

export const deleteCurrentProfileImage = async (userId: string) => {
    const s3 = getS3();

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
    })

    if(user && user.image) {
        const input = { // DeleteObjectRequest
            Bucket: process.env.S3_BUCKET, // required
            Key: user.image, // required
        };
        const command = new DeleteObjectCommand(input);
        await s3.send(command)
    }
}

/*
required if s3 bucket should also hold private files (not the case now)
const makeProfileImagePublic = async (key: string) => {
    const s3 = getS3();
    const input = {
        Bucket: process.env.S3_BUCKET, // required
        Key: key, // required
        ACL: ObjectCannedACL.public_read
    }
    const command = new PutObjectAclCommand(input);
    await s3.send(command)
}
 */

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
    if(process.env.S3_UPLOAD_URL && process.env.S3_UPLOAD_URL != "") {
        const token = res.data.data["token"]
        return process.env.S3_UPLOAD_URL + "/" + key + "?X-AMZ-Security-Token=" + token
    }
    return res.data.data["presigned_url"]
}
const getS3 = () => {
    return new S3Client({
        credentials: {
            accessKeyId: process.env.S3_KEY_ID!,
            secretAccessKey: process.env.S3_SECRET ?? ""
        },
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION
    });
}