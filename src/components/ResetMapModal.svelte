<script lang="ts">
    import { Button } from "@/components/base/button";
    import Cross from "@/components/icons/Cross.svelte";

    export let isOpen = false;
    export let onConfirm: () => void;
    export let onCancel: () => void;

    let userAnswer = '';
    let isCorrect = false;
    let showError = false;
    
    // Acertijos simples para verificar la intención
    const puzzles = [
        { question: "¿Cuál es la capital de Colombia?", answer: "bogota" },
        { question: "¿En qué continente está Colombia?", answer: "america" },
        { question: "Escribe 'RESETEAR' en mayúsculas:", answer: "RESETEAR" },
        { question: "¿Cuántos departamentos tiene Colombia? (32 o 33)", answer: "32" },
        { question: "Escribe la palabra 'confirmar':", answer: "confirmar" }
    ];
    
    let currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

    const checkAnswer = () => {
        const normalizedAnswer = userAnswer.toLowerCase().trim();
        const normalizedCorrect = currentPuzzle.answer.toLowerCase().trim();
        
        if (normalizedAnswer === normalizedCorrect) {
            isCorrect = true;
            showError = false;
        } else {
            showError = true;
            setTimeout(() => {
                showError = false;
            }, 3000);
        }
    };

    const handleConfirm = () => {
        if (isCorrect) {
            onConfirm();
            resetModal();
        }
    };

    const handleCancel = () => {
        onCancel();
        resetModal();
    };

    const resetModal = () => {
        userAnswer = '';
        isCorrect = false;
        showError = false;
        currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            if (!isCorrect) {
                checkAnswer();
            } else {
                handleConfirm();
            }
        } else if (event.key === 'Escape') {
            handleCancel();
        }
    };

    // Reset when modal opens
    $: if (isOpen) {
        resetModal();
    }
</script>

{#if isOpen}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" on:click={handleCancel}>
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative" on:click|stopPropagation>
            <!-- Close button -->
            <button
                class="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                on:click={handleCancel}
            >
                <Cross color="currentColor" />
            </button>

            <!-- Title -->
            <h2 class="text-xl font-bold text-red-600 mb-4">⚠️ Resetear Mapa</h2>
            
            <!-- Warning -->
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-yellow-700">
                            <strong>Esta acción no se puede deshacer.</strong> Se perderán todos los niveles marcados en el mapa y volverá al estado inicial.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Puzzle -->
            <div class="mb-4">
                <p class="text-sm font-medium text-gray-700 mb-2">
                    Para confirmar que deseas resetear el mapa, responde esta pregunta:
                </p>
                <p class="text-md font-semibold text-gray-900 mb-3">
                    {currentPuzzle.question}
                </p>
                
                <input
                    type="text"
                    bind:value={userAnswer}
                    on:keydown={handleKeyDown}
                    placeholder="Escribe tu respuesta aquí..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    class:border-red-500={showError}
                    class:border-green-500={isCorrect}
                />
                
                {#if showError}
                    <p class="text-red-500 text-sm mt-1">❌ Respuesta incorrecta. Inténtalo de nuevo.</p>
                {/if}
                
                {#if isCorrect}
                    <p class="text-green-600 text-sm mt-1">✅ ¡Correcto! Ahora puedes resetear el mapa.</p>
                {/if}
            </div>

            <!-- Buttons -->
            <div class="flex gap-3 mt-6">
                <Button variant="ghost" on:click={handleCancel} class="flex-1">
                    Cancelar
                </Button>
                
                {#if !isCorrect}
                    <Button on:click={checkAnswer} class="flex-1 bg-blue-600 hover:bg-blue-700">
                        Verificar Respuesta
                    </Button>
                {:else}
                    <Button on:click={handleConfirm} class="flex-1 bg-red-600 hover:bg-red-700">
                        Resetear Mapa
                    </Button>
                {/if}
            </div>
        </div>
    </div>
{/if}