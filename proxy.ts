import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/tableau-de-bord", "/chat", "/profil", "/bilan", "/portrait"];

export function proxy(request: NextRequest) {
  const isProtected = PROTECTED.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );

  if (!isProtected) return NextResponse.next();

  // Vérification optimiste : présence du cookie de session Supabase
  const hasSession = request.cookies.getAll().some((c) =>
    c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
  );

  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
