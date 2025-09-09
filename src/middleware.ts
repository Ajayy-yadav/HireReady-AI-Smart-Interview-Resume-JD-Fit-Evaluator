import { clerkMiddleware, getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { NextRequest } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
  try {
    const { userId } = await auth();
    const url = req.url;
    const pathname = new URL(url).pathname;
    const isLanding = pathname === '/' || pathname === '/landing';
    const isSignIn = pathname.startsWith('/sign-in');
    const isSignUp = pathname.startsWith('/sign-up');

    if (userId && (isLanding || isSignIn || isSignUp)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if (!userId && pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    return NextResponse.next();
  } catch (error) {
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/',
    '/landing',
    '/sign-in/:path*',
    '/sign-up/:path*',
    '/dashboard/:path*',
  ],
};