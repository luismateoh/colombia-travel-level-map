<script lang="ts">
    import {Button} from "@/components/base/button";
    import type {User} from "firebase/auth";
    import EditAccountForm from "./EditAccountForm.svelte";

    export let user: User;
</script>

<div
        class="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20"
>
    <div class="max-w-md w-full rounded-xl shadow-lg p-5 mt-16 bg-white">
        <div class="flex flex-col items-center justify-center">
            <h1 class="text-3xl font-bold mb-4">Dashboard</h1>
            <p class="text-xl mb-4">Welcome, {user.displayName}!</p>
            <p>Nos alegramos de verle por aquí. ¿Listo para sumergirte?</p>
            <div class="mt-6">
                <Button href="/account">Editar su cuenta</Button>
            </div>
        </div>
    </div>
</div