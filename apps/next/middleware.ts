import { NextResponse, NextRequest, userAgent } from 'next/server'
import { withAuth } from 'next-auth/middleware'
const customizedAuthRoutes = {
    signIn: "/api/auth/signin",
    // signOut: "/api/auth/signout",
    // error: "/api/auth/error",
};
function middleware(request: NextRequest) {
    if (request.nextUrl.pathname == '/app/settings') {
        const { device } = userAgent(request)
        if(device.type === 'mobile') {
            return NextResponse.next()
        }
        else {
            return NextResponse.redirect(new URL('/app/settings/user', request.url))
        }
    }

    if(request.nextUrl.pathname == '/') {
        return NextResponse.redirect(new URL('/app', request.url))
    }
}

export default withAuth(middleware, {
    callbacks: {
        authorized: ({ req: { cookies, nextUrl } }) => {
            if(!nextUrl.pathname.startsWith("/auth")) {
                const sessionToken = cookies.get("__Secure-next-auth.session-token");
                return sessionToken != null;
            }
            return true
        },
    },
    pages: {
        signIn: customizedAuthRoutes.signIn,
    },
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}