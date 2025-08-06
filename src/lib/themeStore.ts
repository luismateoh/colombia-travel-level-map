import { writable } from 'svelte/store';

// Extender el tipo Window para incluir __theme
declare global {
  interface Window {
    __theme?: 'light' | 'dark';
  }
}

// Detectar si estamos en el navegador
const isBrowser = typeof window !== 'undefined';

// Detectar preferencia del sistema o usar tema global ya aplicado
const getInitialTheme = () => {
  if (!isBrowser) return 'light';
  
  // Primero verificar si el tema ya fue aplicado por el script inline
  if (window.__theme) {
    return window.__theme;
  }
  
  // Verificar si hay una preferencia guardada
  const stored = localStorage.getItem('theme');
  if (stored && (stored === 'light' || stored === 'dark')) {
    return stored;
  }
  
  // Si no, usar la preferencia del sistema
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Store para el tema
export const theme = writable(getInitialTheme());

// Función para alternar tema
export const toggleTheme = () => {
  theme.update(currentTheme => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    if (isBrowser) {
      localStorage.setItem('theme', newTheme);
      // Aplicar la clase al HTML
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      
      // Actualizar meta theme-color dinámicamente
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#0f172a' : '#1e40af');
      }
      
      // Actualizar color-scheme
      const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
      if (metaColorScheme) {
        metaColorScheme.setAttribute('content', newTheme);
      }
      
      // Actualizar tema global
      window.__theme = newTheme;
    }
    return newTheme;
  });
};

// Función para establecer tema específico
export const setTheme = (newTheme: 'light' | 'dark') => {
  theme.set(newTheme);
  if (isBrowser) {
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    // Actualizar meta theme-color dinámicamente
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#0f172a' : '#1e40af');
    }
    
    // Actualizar color-scheme
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    if (metaColorScheme) {
      metaColorScheme.setAttribute('content', newTheme);
    }
    
    // Actualizar tema global
    window.__theme = newTheme;
  }
};

// Inicializar store cuando esté disponible el tema del script inline
if (isBrowser) {
  // Escuchar cambios en la preferencia del sistema
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    // Solo cambiar si no hay preferencia manual guardada
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
  
  // Sincronizar con el tema ya aplicado si existe
  document.addEventListener('DOMContentLoaded', () => {
    if (window.__theme && window.__theme !== getInitialTheme()) {
      theme.set(window.__theme);
    }
  });
}