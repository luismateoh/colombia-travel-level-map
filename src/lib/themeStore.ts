import { writable } from 'svelte/store';

// Detectar si estamos en el navegador
const isBrowser = typeof window !== 'undefined';

// Detectar preferencia del sistema
const getInitialTheme = () => {
  if (!isBrowser) return 'light';
  
  // Primero verificar si hay una preferencia guardada
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
  }
};

// Escuchar cambios en la preferencia del sistema
if (isBrowser) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    // Solo cambiar si no hay preferencia manual guardada
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
  
  // Aplicar tema inicial
  theme.subscribe(currentTheme => {
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
  });
}