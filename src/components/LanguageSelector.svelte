<script lang="ts">
    import { currentLanguage, setLanguage, type Language } from '@/lib/i18n';
    import { onMount } from 'svelte';

    let isOpen = false;

    const languages = [
        { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
        { code: 'en' as Language, name: 'English', flag: '🇺🇸' }
    ];

    $: currentLang = languages.find(lang => lang.code === $currentLanguage) || languages[0];

    function toggleDropdown() {
        isOpen = !isOpen;
    }

    function selectLanguage(lang: Language) {
        setLanguage(lang);
        isOpen = false;
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.language-selector')) {
            isOpen = false;
        }
    }

    onMount(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });
</script>

<div class="language-selector relative">
    <button
        on:click={toggleDropdown}
        class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        aria-label="Cambiar idioma / Change language"
    >
        <span class="text-lg">{currentLang.flag}</span>
        <span class="hidden sm:block">{currentLang.name}</span>
        <svg class="w-4 h-4 transform transition-transform duration-200" class:rotate-180={isOpen} viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
    </button>

    {#if isOpen}
        <div class="absolute right-0 mt-1 w-44 bg-white rounded-md shadow-lg border border-gray-200 z-50">
            <div class="py-1">
                {#each languages as language}
                    <button
                        on:click={() => selectLanguage(language.code)}
                        class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        class:bg-gray-50={$currentLanguage === language.code}
                        class:font-medium={$currentLanguage === language.code}
                    >
                        <span class="text-lg">{language.flag}</span>
                        <span>{language.name}</span>
                        {#if $currentLanguage === language.code}
                            <span class="ml-auto text-blue-600">✓</span>
                        {/if}
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</div>