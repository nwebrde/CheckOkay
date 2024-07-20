import { NextResponse, NextRequest, userAgent } from 'next/server'
import { withAuth } from 'next-auth/middleware'

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
        authorized: ({ token, req }) => {
            if(req.nextUrl.pathname.startsWith('/app') && !token) {
                return false // sign in
            }
            return true
        }
    }
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}