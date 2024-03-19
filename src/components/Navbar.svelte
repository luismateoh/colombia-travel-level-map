<script lang="ts">
    import {onMount} from "svelte";
    import UserDropdown from "@/components/UserDropdown.svelte";
    import {Button} from "@/components/base/button";
    import type {User} from "firebase/auth";

    export let user: User;
    let scrolled = false;

    onMount(() => {
        const handleScroll = () => {
            scrolled = window.pageYOffset > 0;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });
</script>

<div
        class={`fixed top-0 w-full flex justify-center z-30 transition-all ${
    scrolled
      ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
      : "bg-white/0"
  }`}
>
    <div
            class="mx-5 flex h-16 max-w-screen-xl items-center justify-between w-full"
    >
        <a href="/" class="flex items-center font-display text-xl">
            <img
                    src="/flag.svg"
                    alt="Colombian flag logo"
                    width="40"
                    height="40"
                    class="mr-2 rounded-sm"
            />
            <p class="font-bold">Mapa de Colombia</p>
        </a>

        <div class="flex gap-6">
            {#if user}
                <UserDropdown {user}/>
            {:else}
                <Button href="/signin" variant="rounded">Sign In</Button>
            {/if}
        </div>
    </div>
</div>
