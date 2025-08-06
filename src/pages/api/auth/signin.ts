import type { APIRoute } from 'astro';
import { getAuth } from 'firebase-admin/auth';
import { app } from '../../../firebase/server';

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const auth = getAuth(app);

  // Obtener el token del header Authorization
  const idToken = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!idToken) {
    return new Response('No token provided', { status: 401 });
  }

  try {
    // Verificar el token
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Crear una sesión (cookie)
    const fiveMinutes = 60 * 5 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: fiveMinutes,
    });

    // Establecer la cookie
    cookies.set('__session', sessionCookie, {
      path: '/',
      maxAge: fiveMinutes / 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    console.log('✅ Usuario autenticado:', decodedToken.uid, decodedToken.email);
    
    return redirect('/');
  } catch (error) {
    console.error('❌ Error verificando token:', error);
    return new Response('Invalid token', { status: 401 });
  }
};