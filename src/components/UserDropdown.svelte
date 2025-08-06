<script lang="ts">
    import {Button} from "@/components/base/button";
    import { logoutUser } from "@/firebase/utils/authStore";
    import { t } from "@/lib/i18n";
    import type {User} from "firebase/auth";
    import type {UserRecord} from "firebase-admin/auth";

    export let user: User | UserRecord;
    let isOpen = false;

    const handleLogout = async () => {
        await logoutUser();
        isOpen = false;
    };

    const toggleDropdown = () => {
        isOpen = !isOpen;
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
        if (!event.target.closest('.user-dropdown')) {
            isOpen = false;
        }
    };
</script>

<svelte:window on:click={handleClickOutside} />

{#if user?.email}
    <div class="relative user-dropdown">
        <button
                on:click={toggleDropdown}
                class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-300 dark:border-gray-600 transition-all duration-75 focus:outline-none focus:ring-0 active:scale-95 sm:h-9 sm:w-9 hover:scale-105"
        >
            {#if user?.photoURL}
                <img alt="User Icon" width="40" height="40" src={user?.photoURL} class="rounded-full"/>
            {:else}
                <img class="max-w-[150%]" alt="User Icon" width="100" height="100" src="/flag.svg"/>
            {/if}
        </button>
        
        {#if isOpen}
            <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-scale-in">
                <div class="p-2">
                    {#if user?.displayName}
                        <p class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user?.displayName}
                        </p>
                    {/if}
                    <p class="truncate text-sm text-gray-500 dark:text-gray-400">
                        {user?.email}
                    </p>
                </div>

                <div class="border-t border-gray-200 dark:border-gray-700">
                    <button
                        on:click={handleLogout}
                        class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                        <!-- Logout Icon SVG -->
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                        {$t('logout')}
                    </button>
                </div>
            </div>
        {/if}
    </div>
{/if}