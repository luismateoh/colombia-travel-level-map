<script>
    import {getAuth, confirmPasswordReset} from "firebase/auth";
    import Navbar from "@/components/Navbar.svelte";
    import {Button} from "@/components/base/button";
    import {Input} from "@/components/base/input";
    import getFriendlyErrorMessage from "@/firebase/utils/auth/getFriendlyErrorMessage";
    import {app} from "../firebase/client";

    export let oobCode; // This will hold the oobCode from the URL.
    let newPassword = "";
    let confirmPassword = "";
    let errorMessage;
    let successMessage;
    const auth = getAuth(app);

    async function handlePasswordChange() {
        if (newPassword !== confirmPassword) {
            errorMessage = "Las contraseñas no coinciden.";
            return;
        }

        try {
            await confirmPasswordReset(auth, oobCode, newPassword);
            successMessage = "Su contraseña se ha restablecido correctamente.";
        } catch (error) {
            console.error("Error al restablecer la contraseña:", error);
            errorMessage = getFriendlyErrorMessage(error);
        }
    }
</script>

<Navbar/>

<div
        class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
>
    <div class="max-w-md w-full space-y-8 p-6 rounded-xl shadow-lg bg-white">
        <div>
            <h1 class="mt-6 text-center text-3xl font-extrabold text-black">
                Restablecer contraseña
            </h1>
            <p class="mt-2 text-center text-sm text-black/80">
                Introduzca y confirme su nueva contraseña a continuación.
            </p>
        </div>
        {#if errorMessage}
            <div class="mt-4 mb-3 text-center">
                <p class="text-red-500 text-sm">{errorMessage}</p>
            </div>
        {/if}
        {#if successMessage}
            <div class="mt-4 mb-3 text-center">
                <p class="text-green-500 text-sm">{successMessage}</p>
            </div>
        {/if}
        <form
                class="mt-8 space-y-6"
                on:submit|preventDefault={handlePasswordChange}
        >
            <div class="rounded-md space-y-4">
                <div>
                    <label for="new-password" class="sr-only">Nueva contraseña</label>
                    <Input
                            bind:value={newPassword}
                            type="password"
                            id="new-password"
                            placeholder="New Password"
                            autocomplete="new-password"
                    />
                </div>
                <div>
                    <label for="confirm-password" class="sr-only">Confirmar contraseña</label>
                    <Input
                            bind:value={confirmPassword}
                            type="password"
                            id="confirm-password"
                            placeholder="Confirm Password"
                            autocomplete="new-password"
                    />
                </div>
            </div>
            <div>
                <Button class="w-full" type="submit">Cambiar contraseña</Button>
            </div>
        </form>
    </div>
</div>
