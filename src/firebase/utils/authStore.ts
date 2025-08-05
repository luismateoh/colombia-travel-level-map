import { writable } from 'svelte/store';
import { getAuth, onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { app } from '../client';

// Store para el usuario autenticado
export const currentUser = writable<User | null>(null);
export const isLoading = writable(true);

// Inicializar la escucha del estado de autenticación
const auth = getAuth(app);

// Variable para asegurar que solo se ejecute una vez
let hasInitialized = false;

onAuthStateChanged(auth, (user) => {
  if (!hasInitialized) {
    hasInitialized = true;
    console.log('🔄 Inicializando authStore...');
  }
  
  currentUser.set(user);
  isLoading.set(false);
  
  if (user) {
    console.log('✅ Usuario autenticado en el cliente:', user.uid, user.email);
  } else {
    console.log('❌ Usuario no autenticado en el cliente');
  }
});

/**
 * Obtiene el usuario actual si está autenticado
 * @returns {Promise<User|null>} - Usuario actual o null
 */
export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = currentUser.subscribe((user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

/**
 * Cierra la sesión del usuario completamente
 * Incluye tanto Firebase como las cookies del servidor
 */
export async function logoutUser(): Promise<void> {
  try {
    console.log('🚪 Cerrando sesión...');
    
    // 1. Cerrar sesión en Firebase
    await signOut(auth);
    
    // 2. Eliminar cookie del servidor
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
    });
    
    if (response.ok) {
      console.log('✅ Sesión cerrada exitosamente');
      // 3. Redirigir a la página principal
      window.location.href = '/';
    } else {
      console.error('❌ Error al cerrar sesión en el servidor');
    }
    
  } catch (error) {
    console.error('❌ Error al cerrar sesión:', error);
  }
}