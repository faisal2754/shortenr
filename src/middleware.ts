import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const middleware = async (req: NextRequest) => {
  const origin = req.nextUrl.origin;
  const path = req.nextUrl.pathname.substring(1);

  // path includes "/""
  if (path.length !== 6) {
    return NextResponse.next();
  } else {
    const apiResponse = await fetch(`${origin}/api/get-full-url`, {
      method: "POST",
      body: JSON.stringify({ alias: path }),
    });

    const apiResponseJson = await apiResponse.json();

    if (apiResponseJson.fullUrl) {
      console.log(apiResponseJson.fullUrl.url);
      return NextResponse.redirect(apiResponseJson.fullUrl.url, {
        status: 301,
      });
    } else {
      return NextResponse.next();
    }
  }
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|bg.webp|_next/image|favicon.ico).*)",
  ],
};
