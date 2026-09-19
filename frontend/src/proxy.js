{
  /* 
import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const payloadBase64 = token.split(".")[1];

    if (payloadBase64) {
      const decodedPayload = JSON.parse(atob(payloadBase64));

      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedPayload.exp && decodedPayload.exp < currentTime) {
        console.log("Token süresi dolmuş, çıkış yapılıyor...");

        const response = NextResponse.redirect(new URL("/", request.url));

        response.cookies.delete("token");

        return response;
      }
    }
  } catch (error) {
    console.error("Token çözümlenirken hata oluştu:", error);
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("token");
    return response;
  }

  return NextResponse.next();
}

 export const config = {
   matcher: ["/ayarlar/:path*", "/profil/:path*"],
};

*/
}

import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/ayarlar") || pathname.startsWith("/profil");

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token) {
    try {
      const payloadBase64 = token.split(".")[1];

      if (payloadBase64) {
        const decodedPayload = JSON.parse(atob(payloadBase64));
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedPayload.exp && decodedPayload.exp < currentTime) {
          if (isProtectedRoute) {
            const response = NextResponse.redirect(new URL("/", request.url));
            response.cookies.delete("token");
            return response;
          }
        }
      }
    } catch (error) {
      console.error("Token çözümlenirken hata:", error);

      if (isProtectedRoute) {
        const response = NextResponse.redirect(new URL("/", request.url));
        response.cookies.delete("token");
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
