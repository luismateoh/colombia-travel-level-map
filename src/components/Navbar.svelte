<script lang="ts">
    import {onMount} from "svelte";
    import UserDropdown from "@/components/UserDropdown.svelte";
    import LanguageSelector from "@/components/LanguageSelector.svelte";
    import ThemeToggle from "@/components/ThemeToggle.svelte";
    import { currentUser, isLoading } from "@/firebase/utils/authStore";
    import { t, initializeLanguage } from "@/lib/i18n";
    import type {User} from "firebase/auth";
    import type {UserRecord} from "firebase-admin/auth";

    export let user: User | UserRecord | null = null;
    let scrolled = false;

    // Usar el store del cliente que se actualiza en tiempo real
    $: displayUser = $currentUser || user;

    onMount(() => {
        // Inicializar idioma desde localStorage
        initializeLanguage();
        
        const handleScroll = () => {
            scrolled = window.scrollY > 0;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });
</script>

<nav
        class={`fixed top-0 w-full flex justify-center z-30 transition-all duration-300 ${
    scrolled
      ? "border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl"
      : "bg-white/0 dark:bg-gray-900/0"
  }`}
>
    <div
            class="mx-5 flex h-16 max-w-screen-xl items-center justify-between w-full"
    >
        <a class="flex items-center font-display text-xl hover:scale-105 transition-transform duration-200" href="/">
            <img
                    alt="Colombian flag logo"
                    class="mr-2 rounded-sm transition-transform duration-200 hover:rotate-3"
                    height="40"
                    src="/flag.svg"
                    width="40"
            />
            <p class="font-bold text-gray-900 dark:text-gray-100">{$t('title')}</p>
        </a>

        <div class="flex gap-3 items-center">
            <div class="animate-slide-in-right">
                <LanguageSelector />
            </div>
            <div class="animate-slide-in-right" style="animation-delay: 0.1s;">
                <ThemeToggle />
            </div>
            {#if displayUser}
                <div class="animate-slide-in-right" style="animation-delay: 0.2s;">
                    <UserDropdown user={displayUser}/>
                </div>
            {/if}
        </div>
    </div>
</nav>

<!-- Main content below the navbar -->
<div class="w-full">
    <slot />
</div>

<style>
    /* ...existing styles... */
</style>
