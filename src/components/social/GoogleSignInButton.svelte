<script>
  import { onMount } from "svelte";
  import GoogleIcon from "@/components/icons/GoogleIcon.svelte";
  import handleGoogleSignIn from "@/firebase/utils/auth/handleGoogleSignIn";
  import { Button } from "../base/button";
  import { t } from "@/lib/i18n";

  let loading = false;

  async function signIn() {
    loading = true;
    await handleGoogleSignIn();
    loading = false;
  }
</script>

<Button variant="google" on:click={signIn} disabled={loading}>
  {#if loading}
    <div class="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
    {$t('pleaseWait')}
  {:else}
    <GoogleIcon />
    {$t('signInWithGoogle')}
  {/if}
</Button>
