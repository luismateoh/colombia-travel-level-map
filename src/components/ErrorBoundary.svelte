<script>
  import { onMount } from 'svelte';
  
  export let fallback = null;
  
  let hasError = false;
  let errorInfo = null;
  
  // Handle unhandled promise rejections
  onMount(() => {
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      hasError = true;
      errorInfo = {
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack || '',
        type: 'promise'
      };
    };
    
    // Handle general errors
    const handleError = (event) => {
      console.error('Global error:', event.error);
      hasError = true;
      errorInfo = {
        message: event.error?.message || 'Unknown error occurred',
        stack: event.error?.stack || '',
        type: 'javascript'
      };
    };
    
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  });
  
  const retry = () => {
    hasError = false;
    errorInfo = null;
  };
  
  const reportError = () => {
    if (errorInfo) {
      // Log to console for development
      console.error('Error reported:', errorInfo);
      
      // In production, you might want to send this to an error tracking service
      // like Sentry, LogRocket, etc.
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'exception', {
          description: errorInfo.message,
          fatal: false
        });
      }
    }
  };
</script>

{#if hasError}
  {#if fallback}
    <svelte:component this={fallback} {errorInfo} {retry} {reportError} />
  {:else}
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <div class="mx-auto h-12 w-12 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            Algo salió mal
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            Lo sentimos, ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.
          </p>
          {#if errorInfo}
            <details class="mt-4 text-left">
              <summary class="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Detalles técnicos
              </summary>
              <div class="mt-2 p-3 bg-gray-100 rounded text-xs font-mono break-all">
                <p><strong>Tipo:</strong> {errorInfo.type}</p>
                <p><strong>Mensaje:</strong> {errorInfo.message}</p>
                {#if errorInfo.stack}
                  <p><strong>Stack:</strong></p>
                  <pre class="whitespace-pre-wrap">{errorInfo.stack}</pre>
                {/if}
              </div>
            </details>
          {/if}
        </div>
        <div class="flex flex-col space-y-2">
          <button
            on:click={retry}
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Intentar de nuevo
          </button>
          <button
            on:click={reportError}
            class="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reportar error
          </button>
          <button
            on:click={() => window.location.reload()}
            class="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Recargar página
          </button>
        </div>
      </div>
    </div>
  {/if}
{:else}
  <slot />
{/if}