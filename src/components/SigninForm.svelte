<script>
    import {
        getAuth,
        setPersistence,
        browserSessionPersistence,
        signInWithEmailAndPassword,
    } from "firebase/auth";
    import {app} from "../firebase/client";
    import getFriendlyErrorMessage from "@/firebase/utils/auth/getFriendlyErrorMessage";
    import {Button} from "@/components/base/button";
    import GoogleSignInButton from "./social/GoogleSignInButton.svelte";
    import {Input} from "@/components/base/input";
    import fetchSignIn from "@/services/api/fetchSignIn";
    import LoadingButton from "@/components/LoadingButton.svelte";

    let email, password, errorMessage, loading;
    const auth = getAuth(app);

    async function handleLogin() {
        loading = true;
        try {
            // Establecer persistencia antes de autenticar
            await setPersistence(auth, browserSessionPersistence);
            
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            
            const idToken = await userCredential.user.getIdToken();
            const redirectedUrl = await fetchSignIn(idToken);
            if (redirectedUrl) {
                window.location.assign(redirectedUrl);
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            errorMessage = getFriendlyErrorMessage(error);
        }
        loading = false;
    }
</script>

<div
        class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
>
    <div class="max-w-md w-full space-y-8 p-6 rounded-xl shadow-lg bg-white">
        <div>
            <h1 class="mt-6 text-center text-3xl font-extrabold text-black">
                <!-- Adjusted to black color here -->
                Iniciar sesión
            </h1>
            <p class="mt-2 text-center text-sm text-black/80">
                New?
                <a href="/signup" class="font-medium text-black hover:text-black/70">
                    Crear una cuenta
                </a>
            </p>
        </div>
        <form class="mt-8 space-y-6" on:submit|preventDefault={handleLogin}>
            <div class="rounded-md space-y-4">
                <div>
                    <label for="email" class="sr-only">Correo electrónico</label>
                    <Input
                            bind:value={email}
                            type="email"
                            id="email"
                            placeholder="Email"
                            autocomplete="email"
                    />
                </div>
                <div>
                    <label for="password" class="sr-only">Contraseña</label>
                    <Input
                            bind:value={password}
                            type="password"
                            id="password"
                            placeholder="Password"
                            autocomplete="current-password"
                    />
                    <div class="text-right mt-2">
                        <a
                                href="/forgot-password"
                                class="font-medium text-sm text-black hover:text-black/70"
                        >
                            ¿Ha olvidado su contraseña?
                        </a>
                    </div>
                </div>
            </div>
            {#if errorMessage}
                <!-- Container for error message with margin for spacing -->
                <div class="mt-4 mb-3 text-center">
                    <p class="text-red-500 text-sm">{errorMessage}</p>
                </div>
            {/if}

            <div>
                {#if loading}
                    <LoadingButton class="w-full"/>
                {:else}
                    <Button class="w-full" type="submit">Sign in</Button>
                {/if}
            </div>
        </form>

        <div class="relative">
            <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t"/>
            </div>
            <div class="relative flex justify-center text-xs uppercase">
                <span class="bg-white px-2 text-[#71717a]">O continuar con</span>
            </div>
        </div>

        <div>
            <GoogleSignInButton/>
        </div>
    </div>
</div>
