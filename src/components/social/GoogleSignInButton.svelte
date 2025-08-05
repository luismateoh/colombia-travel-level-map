<script>
  import { onMount } from "svelte";
  import GoogleIcon from "@/components/icons/GoogleIcon.svelte";
  import handleGoogleSignIn from "@/firebase/utils/auth/handleGoogleSignIn";
  import Spinner from "../icons/Spinner.svelte";
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
    <Spinner />
    {$t('pleaseWait')}
  {:else}
    <GoogleIcon />
    {$t('signInWithGoogle')}
  {/if}
</Button>
