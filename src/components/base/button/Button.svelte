<script lang="ts">
    import type {SvelteComponent} from "svelte";
    // Define a type for the variant keys
    type ButtonVariant = keyof typeof buttonVariants;
    let className: string | undefined | null = undefined;
    let href: string | undefined = undefined;
    export {className as class, href};
    export let type: "button" | "submit" | "reset" = "button";
    // Ensure that variant is of type ButtonVariant
    export let variant: ButtonVariant = "default";
    // Export the icon component
    export let icon: typeof SvelteComponent = null;

    const buttonVariants = {
        google:
            "disabled:opacity-50 disabled:pointer-events-none group relative w-full flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100",
        outlined:
            "py-2 px-4 rounded-md border border-gray-300 dark:border-gray-600 text-black dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200 ease-in-out",
        ghost:
            "relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100",
        smallGhost:
            "relative flex w-full items-center justify-start space-x-1 rounded-md p-1 text-left text-sm transition-all duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100",
        rounded:
            "rounded-full border border-black dark:border-white bg-black dark:bg-white p-1.5 px-4 text-sm text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 transition duration-200 ease-in-out",
        inRow:
            "flex items-center justify-start gap-2 px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 w-full text-left text-gray-900 dark:text-gray-100",
        xMark:
            "flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 w-full text-gray-900 dark:text-gray-100",
        default:
            "flex justify-center items-center disabled:opacity-30 disabled:pointer-events-none py-2 px-4 rounded-md text-white bg-black dark:bg-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 focus:outline-none focus:ring-2 transition duration-200 ease-in-out",
    };

    // This function returns true if 'href' is a non-empty string
    const isLink = (): boolean => typeof href === "string" && href.length > 0;
</script>


<!--
  * When 'href' is defined, we render an <a> element instead of a <button>.
  This is important for accessibility because screen readers and other
  assistive technologies use the semantic information of HTML elements
  to convey their function to users. An <a> element signifies a hyperlink
  that navigates the user to a new page or resource, while a <button>
  indicates an action or command that the user can perform on the current page.
-->
{#if isLink()}
    <a
            {...$$restProps}
            {href}
            class="text-center {buttonVariants[variant]} {className}"
            on:click
            {type}
            role="button"
            tabindex="0"
    >
        <slot/>
    </a>
{:else}
    <button
            on:click
            {...$$restProps}
            {type}
            class="{buttonVariants[variant]} {className}"
    >
        {#if icon}
            <div>
                <svelte:component color="currentColor" this={icon}/>
            </div>
        {/if}
        <slot/>
    </button>
{/if}
