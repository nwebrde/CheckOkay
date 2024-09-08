import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    console.error("report", req.headers.get("ReportName"), req.headers.get("ReportDescription"))
    return new Response('invitation code not found or expired', {
        status: 200,
    })
}