<script lang="ts">
    import { Button } from "@/components/base/button";
    import Cross from "@/components/icons/Cross.svelte";
    import { t } from "@/lib/i18n";

    export let isOpen = false;
    export let onConfirm: () => void;
    export let onCancel: () => void;

    let userAnswer = '';
    let isCorrect = false;
    let showError = false;
    
    // Acertijos simples para verificar la intención
    const puzzles = [
        { question: $t('puzzles.capitalColombia'), answer: "bogota" },
        { question: $t('puzzles.continent'), answer: "america" },
        { question: $t('puzzles.typeReset'), answer: "RESETEAR" },
        { question: $t('puzzles.departments'), answer: "32" },
        { question: $t('puzzles.typeConfirm'), answer: "confirmar" }
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
    <div 
        class="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50" 
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabindex="-1"
    >
        <div 
            class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 relative shadow-xl" 
            role="document"
        >
            <button
                class="absolute top-3 right-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                on:click={handleCancel}
                aria-label="Cerrar modal"
            >
                <Cross color="currentColor" />
            </button>

            <!-- Title -->
            <h2 id="modal-title" class="text-xl font-bold text-red-600 dark:text-red-400 mb-4">{$t('resetMapTitle')}</h2>
            
            <!-- Warning -->
            <div class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-4 mb-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-yellow-400 dark:text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-yellow-700 dark:text-yellow-300">
                            <strong>{$t('resetWarning')}</strong> {$t('resetWarningDescription')}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Puzzle -->
            <div class="mb-4">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {$t('confirmReset')}
                </p>
                <p class="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {currentPuzzle.question}
                </p>
                
                <input
                    type="text"
                    bind:value={userAnswer}
                    on:keydown={handleKeyDown}
                    placeholder="Escribe tu respuesta aquí..."
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    class:border-red-500={showError}
                    class:border-green-500={isCorrect}
                    class:dark:border-red-400={showError}
                    class:dark:border-green-400={isCorrect}
                />
                
                {#if showError}
                    <p class="text-red-500 dark:text-red-400 text-sm mt-1">{$t('incorrectAnswer')}</p>
                {/if}
                
                {#if isCorrect}
                    <p class="text-green-600 dark:text-green-400 text-sm mt-1">{$t('correctAnswer')}</p>
                {/if}
            </div>

            <!-- Buttons -->
            <div class="flex gap-3 mt-6">
                <Button variant="ghost" on:click={handleCancel} class="flex-1">
                    {$t('cancel')}
                </Button>
                
                {#if !isCorrect}
                    <Button on:click={checkAnswer} class="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-colors">
                        {$t('verifyAnswer')}
                    </Button>
                {:else}
                    <Button on:click={handleConfirm} class="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white transition-colors">
                        {$t('resetMapButton')}
                    </Button>
                {/if}
            </div>
        </div>
    </div>
{/if}