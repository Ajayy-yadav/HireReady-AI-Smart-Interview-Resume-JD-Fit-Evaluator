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
    const isDashboard = pathname.startsWith('/dashboard');



    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (userId && (isLanding || isSignIn || isSignUp)) {
      console.log('Redirecting authenticated user to dashboard');
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    // Only redirect to sign-in if user is definitely not authenticated
    // Allow dashboard access to proceed and let the component handle the redirect
    if (!userId && isDashboard) {
      console.log('No userId found, allowing dashboard access to handle redirect');
      // Don't redirect here, let the dashboard component handle it
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // If there's an error, allow the request to proceed but log it
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