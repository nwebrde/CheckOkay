import NextAuth from 'next-auth'
import { authOptions } from '../../../../server/lib/nextAuthOptions'
import { NextApiRequest, NextApiResponse } from 'next'

// @ts-ignore
// const handler = NextAuth(authOptions)

// export { handler as GET, handler as POST }

async function auth(req: NextApiRequest, res: NextApiResponse) {
    let userObject;

    if (req?.url?.includes("callback/apple") && req?.method === "POST") {
        const formData = await req.clone().formData();
        const user = formData.get("user");
        userObject = JSON.parse(user);
    }

    // @ts-ignore
    return await NextAuth(req, res, authOptions(userObject));
}

export { auth as GET, auth as POST };
