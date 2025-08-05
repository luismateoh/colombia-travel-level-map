<script lang="ts">
    import {onMount} from "svelte";
    import UserDropdown from "@/components/UserDropdown.svelte";
    import { currentUser, isLoading } from "@/firebase/utils/authStore";
    import type {User} from "firebase/auth";
    import type {UserRecord} from "firebase-admin/auth";

    export let user: User | UserRecord | null = null;
    let scrolled = false;

    // Usar el store del cliente que se actualiza en tiempo real
    $: displayUser = $currentUser || user;

    onMount(() => {
        const handleScroll = () => {
            scrolled = window.scrollY > 0;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });
</script>

<nav
        class={`fixed top-0 w-full flex justify-center z-30 transition-all ${
    scrolled
      ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
      : "bg-white/0"
  }`}
>
    <div
            class="mx-5 flex h-16 max-w-screen-xl items-center justify-between w-full"
    >
        <a class="flex items-center font-display text-xl" href="/">
            <img
                    alt="Colombian flag logo"
                    class="mr-2 rounded-sm"
                    height="40"
                    src="/flag.svg"
                    width="40"
            />
            <p class="font-bold">Mapa de Colombia</p>
        </a>

        <div class="flex gap-6 items-center">
            {#if displayUser}
                <UserDropdown user={displayUser}/>
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
