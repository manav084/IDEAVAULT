import { NextResponse } from "next/server";
import * as jose from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function middleware(req) {
    const url = req.nextUrl.clone();
    const pathname = url.pathname;

    const isApiRequest = pathname.startsWith("/api");
    try {
        const tokens = req.cookies.get("token")?.value;

        if (!tokens) {
            if (isApiRequest) {
                return NextResponse.json(
                    { success: false, message: "Unauthorised" },
                    { status: 401 }
                );
            }
            return NextResponse.redirect(new URL("/", req.url));
        }
        const { payload } = await jose.jwtVerify(tokens, secret);
        if (payload.role !== "admin") {

            if (isApiRequest) {
                 return NextResponse.next();
            }
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorised... can't access to Admin panel!",
                },
                {
                    status: 403,
                }
            );
        }
        return NextResponse.next();
    } catch (error) {
        // console.error(error);

        if (isApiRequest) {
            return NextResponse.json(
                { success: false, message: "Unauthorised" },
                { status: 401 }
            );
        }
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            {
                status: 403,
            }
        );
    }
}

export const config = { matcher: ["/admin", "/api/admin/:path*"] };
