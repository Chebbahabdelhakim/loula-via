import { createServerClient } from "@supabase/ssr";
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { createAdminClient } from "./lib/supabase/admin";
import { getSupabasePublicEnv } from "./lib/supabase/env";

const handleI18n = createMiddleware(routing);

function carryCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie);
  });
  return to;
}

async function protectAdmin(request: NextRequest) {
  const { url, key } = getSupabasePublicEnv();
  let response = NextResponse.next({ request });

  if (!url || !key) {
    const path = request.nextUrl.pathname.replace(/\/$/, "") || "/";
    if (path === "/admin/login") {
      const loginUrl = request.nextUrl.clone();
      loginUrl.search = "erreur=config";
      return NextResponse.rewrite(loginUrl);
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = "erreur=config";
    return NextResponse.redirect(loginUrl);
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname.replace(/\/$/, "") || "/";
  const isLogin = path === "/admin/login";

  if (!user) {
    if (isLogin) return response;
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.search = "";
    return carryCookies(response, NextResponse.redirect(redirectUrl));
  }

  let isAdmin = false;
  let checkFailed = false;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) checkFailed = true;
    isAdmin = Boolean(data);
  } catch {
    checkFailed = true;
  }

  if (isAdmin) {
    if (!isLogin) return response;
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin";
    redirectUrl.search = "";
    return carryCookies(response, NextResponse.redirect(redirectUrl));
  }

  if (isLogin) return response;

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/admin/login";
  redirectUrl.search = checkFailed ? "erreur=cle" : "erreur=acces";
  return carryCookies(response, NextResponse.redirect(redirectUrl));
}

export default async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return protectAdmin(request);
  }
  return handleI18n(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
