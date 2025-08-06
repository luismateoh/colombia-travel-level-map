import { writable, derived } from 'svelte/store';

export type Language = 'es' | 'en';

// Store para el idioma actual
export const currentLanguage = writable<Language>('es');

// Traducciones
export const translations = {
  es: {
    // Navbar
    title: 'Mapa de Colombia',
    
    // Authentication
    signInWithGoogle: 'Iniciar sesión con Google',
    pleaseWait: 'Espera un momento',
    signInToSave: '🔐 Inicia sesión para guardar',
    progressWillBeSaved: 'Tu progreso se guardará automáticamente',
    logout: 'Cerrar sesión',
    
    // Map and Stats
    totalScore: 'Puntaje total',
    totalScoreDescription: 'Suma de los puntajes de cada departamento',
    visitedDepartments: 'Departamentos visitados',
    progress: 'Progreso',
    loading: 'Cargando...',
    loadingProgress: 'Cargando tu progreso...',
    savedInCloud: 'Guardado en la nube',
    
    // Construction notice
    siteUnderConstruction: '🚧 Sitio en construcción',
    improvingExperience: 'Estamos mejorando la experiencia. Algunos detalles están siendo arreglados.',
    
    // Level guide
    levelGuide: '📖 Guía de niveles',
    levelGuideTooltip: '💡 Haz clic en cualquier departamento del mapa para asignar tu nivel de experiencia',
    
    // Download
    downloadMap: '📥 Descargar mapa',
    downloadAsPNG: 'Descargar como imagen PNG',
    downloadAsJSON: 'Descargar datos como JSON',
    generatingImage: 'Generando imagen...',
    saveAndShare: '💡 Guarda tu progreso y compártelo con otros',
    createCustomMap: '💡 Crea tu mapa personalizado y descárgalo',
    
    // Reset
    resetMap: '🔄 Resetear mapa',
    resetDescription: 'Elimina todo el progreso y vuelve al estado inicial',
    resetAllMap: 'Resetear todo el mapa',
    resetMapTitle: '⚠️ Resetear Mapa',
    resetWarning: 'Esta acción no se puede deshacer.',
    resetWarningDescription: 'Se perderán todos los niveles marcados en el mapa y volverá al estado inicial.',
    confirmReset: 'Para confirmar que deseas resetear el mapa, responde esta pregunta:',
    cancel: 'Cancelar',
    verifyAnswer: 'Verificar Respuesta',
    resetMapButton: 'Resetear Mapa',
    incorrectAnswer: '❌ Respuesta incorrecta. Inténtalo de nuevo.',
    correctAnswer: '✅ ¡Correcto! Ahora puedes resetear el mapa.',
    
    // Project info
    aboutProject: 'ℹ️ Acerca del proyecto',
    projectDescription: 'Este proyecto está basado en una serie de mapas de viajes interactivos:',
    originalJapanMap: '🇯🇵 Mapa original de Japón',
    philippinesVersion: '🇵🇭 Versión de Filipinas',
    colombiaMapData: '🇨🇴 Datos del mapa de Colombia',
    builtWith: 'Construido con Astro + Svelte + Firebase',
    siteBy: 'Site by',
    
    // Level labels
    levels: {
      // Nuevas traducciones que coinciden con las etiquetas del mapa
      vivíahí: 'Viví ahí',
      vivíahíDescription: 'Pasaste una parte significativa de tu vida en ese departamento.',
      mequedeahí: 'Me quedé ahí',
      mequedeahíDescription: 'Pasaste al menos una noche en ese departamento.',
      visitéahí: 'Visité ahí', 
      visitéahíDescription: 'Pasaste algunas horas explorando el departamento.',
      aterriceahí: 'Aterricé ahí',
      aterriceahíDescription: 'Hiciste escala en el departamento.',
      paséporahí: 'Pasé por ahí',
      paséporahíDescription: 'Pasaste por el departamento sin detenerte.',
      nuncaestuveahí: 'Nunca estuve ahí',
      nuncaestuveahíDescription: 'Nunca estuviste en el departamento.',
      
      // Traducciones anteriores (mantener para compatibilidad)
      notVisited: 'No visitado',
      notVisitedDescription: 'Nunca he estado aquí',
      visited: 'Visitado',
      visitedDescription: 'He estado aquí brevemente',
      explored: 'Explorado',
      exploredDescription: 'He explorado este lugar',
      lived: 'Vivido',
      livedDescription: 'He vivido aquí por un tiempo'
    },
    
    // Puzzles for reset
    puzzles: {
      capitalColombia: '¿Cuál es la capital de Colombia?',
      continent: '¿En qué continente está Colombia?',
      typeReset: 'Escribe "RESETEAR" en mayúsculas:',
      departments: '¿Cuántos departamentos tiene Colombia? (32 o 33)',
      typeConfirm: 'Escribe la palabra "confirmar":'
    },
    
    // Meta
    pageTitle: 'Mapa de Colombia',
    pageDescription: 'Mapa de Colombia para visualizar los departamentos visitados'
  },
  
  en: {
    // Navbar
    title: 'Colombia Map',
    
    // Authentication
    signInWithGoogle: 'Sign in with Google',
    pleaseWait: 'Please wait',
    signInToSave: '🔐 Sign in to save',
    progressWillBeSaved: 'Your progress will be saved automatically',
    logout: 'Sign out',
    
    // Map and Stats
    totalScore: 'Total Score',
    totalScoreDescription: 'Sum of scores from each department',
    visitedDepartments: 'Visited departments',
    progress: 'Progress',
    loading: 'Loading...',
    loadingProgress: 'Loading your progress...',
    savedInCloud: 'Saved in the cloud',
    
    // Construction notice
    siteUnderConstruction: '🚧 Site under construction',
    improvingExperience: 'We are improving the experience. Some details are being fixed.',
    
    // Level guide
    levelGuide: '📖 Level guide',
    levelGuideTooltip: '💡 Click on any department on the map to assign your experience level',
    
    // Download
    downloadMap: '📥 Download map',
    downloadAsPNG: 'Download as PNG image',
    downloadAsJSON: 'Download data as JSON',
    generatingImage: 'Generating image...',
    saveAndShare: '💡 Save your progress and share it with others',
    createCustomMap: '💡 Create your custom map and download it',
    
    // Reset
    resetMap: '🔄 Reset map',
    resetDescription: 'Delete all progress and return to initial state',
    resetAllMap: 'Reset entire map',
    resetMapTitle: '⚠️ Reset Map',
    resetWarning: 'This action cannot be undone.',
    resetWarningDescription: 'All levels marked on the map will be lost and it will return to the initial state.',
    confirmReset: 'To confirm that you want to reset the map, answer this question:',
    cancel: 'Cancel',
    verifyAnswer: 'Verify Answer',
    resetMapButton: 'Reset Map',
    incorrectAnswer: '❌ Incorrect answer. Try again.',
    correctAnswer: '✅ Correct! Now you can reset the map.',
    
    // Project info
    aboutProject: 'ℹ️ About the project',
    projectDescription: 'This project is based on a series of interactive travel maps:',
    originalJapanMap: '🇯🇵 Original Japan map',
    philippinesVersion: '🇵🇭 Philippines version',
    colombiaMapData: '🇨🇴 Colombia map data',
    builtWith: 'Built with Astro + Svelte + Firebase',
    siteBy: 'Site by',
    
    // Level labels
    levels: {
      // Traducciones que coinciden con las etiquetas del mapa
      vivíahí: 'I lived there',
      vivíahíDescription: 'You spent a significant part of your life in that department.',
      mequedeahí: 'I stayed there',
      mequedeahíDescription: 'You spent at least one night in that department.',
      visitéahí: 'I visited there',
      visitéahíDescription: 'You spent some hours exploring the department.',
      aterriceahí: 'I landed there',
      aterriceahíDescription: 'You made a stopover in the department.',
      paséporahí: 'I passed through there',
      paséporahíDescription: 'You passed through the department without stopping.',
      nuncaestuveahí: 'I was never there',
      nuncaestuveahíDescription: 'You were never in the department.',
      
      // Traducciones anteriores (mantener para compatibilidad)
      notVisited: 'Not visited',
      notVisitedDescription: 'I have never been here',
      visited: 'Visited',
      visitedDescription: 'I have been here briefly',
      explored: 'Explored',
      exploredDescription: 'I have explored this place',
      lived: 'Lived',
      livedDescription: 'I have lived here for a while'
    },
    
    // Puzzles for reset
    puzzles: {
      capitalColombia: 'What is the capital of Colombia?',
      continent: 'In which continent is Colombia?',
      typeReset: 'Type "RESET" in uppercase:',
      departments: 'How many departments does Colombia have? (32 or 33)',
      typeConfirm: 'Type the word "confirm":'
    },
    
    // Meta
    pageTitle: 'Colombia Map',
    pageDescription: 'Map of Colombia to visualize visited departments'
  }
};

// Función para obtener traducciones - ahora reactiva
export const t = derived(
  currentLanguage,
  ($currentLanguage) => 
    (key: string) => {
      const keys = key.split('.');
      let value: any = translations[$currentLanguage];
      
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          return key; // Retorna la clave si no encuentra la traducción
        }
      }
      
      return typeof value === 'string' ? value : key;
    }
);

// Función para cambiar idioma
export function setLanguage(lang: Language) {
  currentLanguage.set(lang);
  // Guardar preferencia en localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('language', lang);
  }
}

// Inicializar idioma desde localStorage
export function initializeLanguage() {
  if (typeof localStorage !== 'undefined') {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
      currentLanguage.set(savedLang);
    }
  }
}