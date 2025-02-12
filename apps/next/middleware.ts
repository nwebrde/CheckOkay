import { NextResponse, NextRequest, userAgent } from 'next/server'
import { withAuth } from 'next-auth/middleware'
const customizedAuthRoutes = {
    signIn: "/api/auth/signin",
    // signOut: "/api/auth/signout",
    // error: "/api/auth/error",
};
function middleware(request: NextRequest) {
    if(request.nextUrl.pathname.startsWith("/auth/signin") || request.nextUrl.pathname.startsWith("/auth/demo")) {
        const sessionToken = request.cookies.get("__Secure-next-auth.session-token");
        if(sessionToken != null) {
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next()
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