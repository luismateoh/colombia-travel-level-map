<script lang="ts">
  import { theme, toggleTheme } from '@/lib/themeStore';
  import { onMount } from 'svelte';
  
  let mounted = false;
  
  onMount(() => {
    mounted = true;
  });
</script>

{#if mounted}
  <button
    on:click={toggleTheme}
    class="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
    aria-label={$theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
    title={$theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
  >
    <div class="relative w-6 h-6 overflow-hidden">
      <!-- Sol (modo claro) -->
      <div 
        class="absolute inset-0 transform transition-all duration-500 ease-in-out"
        class:translate-y-0={$theme === 'light'}
        class:-translate-y-8={$theme === 'dark'}
        class:rotate-0={$theme === 'light'}
        class:rotate-180={$theme === 'dark'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-6 h-6 text-yellow-500"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
        </svg>
      </div>
      
      <!-- Luna (modo oscuro) -->
      <div 
        class="absolute inset-0 transform transition-all duration-500 ease-in-out"
        class:translate-y-8={$theme === 'light'}
        class:translate-y-0={$theme === 'dark'}
        class:rotate-180={$theme === 'light'}
        class:rotate-0={$theme === 'dark'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-6 h-6 text-blue-400"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
      </div>
    </div>
  </button>
{/if}