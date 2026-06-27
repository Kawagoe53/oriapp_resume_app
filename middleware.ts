import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // ↓middleware では cookie 参照の API が違うので先ほどのコードは使えない.
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // ↓middleware では cookie 参照の API が違うので先ほどのコードは使えない.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const user = await supabase.auth.getUser();
  // Redirect to /login page.
  if (user.error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return response;
}
export const config = {
  matcher: ["/resumes/:path*"],
};
