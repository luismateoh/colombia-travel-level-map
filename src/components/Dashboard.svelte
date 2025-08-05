<script lang="ts">
    import {Button} from "@/components/base/button";
    import { t } from "@/lib/i18n";
    import type {User} from "firebase/auth";
    import EditAccountForm from "./EditAccountForm.svelte";

    export let user: User;
</script>

<div
        class="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20"
>
    <div class="max-w-md w-full rounded-xl shadow-lg p-5 mt-16 bg-white">
        <div class="flex flex-col items-center justify-center">
            <h1 class="text-3xl font-bold mb-4">{t('dashboard')}</h1>
            <p class="text-xl mb-4">{t('welcome').replace('{name}', user.displayName || '')}</p>
            <p>{t('welcomeMessage')}</p>
            <div class="mt-6">
                <Button href="/account">{t('editAccount')}</Button>
            </div>
        </div>
    </div>
</div>