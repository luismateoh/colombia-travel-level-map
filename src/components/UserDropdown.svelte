<script lang="ts">
    import {Popover} from "@/components/base/popover";
    import LogoutIcon from "./icons/LogoutIcon.svelte";
    import {Button} from "@/components/base/button";
    import { logoutUser } from "@/firebase/utils/authStore";
    import { t } from "@/lib/i18n";
    import type {User} from "firebase/auth";
    import type {UserRecord} from "firebase-admin/auth";

    export let user: User | UserRecord;

    const handleLogout = async () => {
        await logoutUser();
    };
</script>

{#if user?.email}
    <Popover>
        <button
                slot="trigger"
                let:bindTrigger
                use:bindTrigger
                class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-300 transition-all duration-75 focus:outline-none focus:ring-0 active:scale-95 sm:h-9 sm:w-9"
        >
            {#if user?.photoURL}
                <img alt="User Icon" width="40" height="40" src={user?.photoURL}/>
            {:else}
                <img  class="max-w-[150%]" alt="User Icon" width="100" height="100" src="/flag.svg"/>
            {/if}
        </button>
        <div slot="content">
            <div class="p-2">
                {#if user?.displayName}
                    <p class="truncate text-sm font-medium text-gray-900">
                        {user?.displayName}
                    </p>
                {/if}
                <p class="truncate text-sm text-gray-500">
                    {user?.email}
                </p>
            </div>

            <Button on:click={handleLogout} variant="ghost">
                <LogoutIcon/>
                <p class="text-sm">{$t('logout')}</p>
            </Button>
        </div>
    </Popover>
{/if}