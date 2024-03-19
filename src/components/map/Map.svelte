<script>
    import ColombiaMap from './ColombianMap.svelte';
    import {PROVINCES, MENU_OPTIONS} from '@/components/utils/constants.svelte';
    import {onMount, setContext} from 'svelte';
    import {writable} from "svelte/store";
    import {Button} from "@/components/base/button";

    // Create a writable store for the array of levels
    const provinceLevels = writable(new Array(PROVINCES.length).fill(0));

    // Set the store in the context
    setContext('provinceLevels', provinceLevels);

    let selectedProvinceIndex = 0;
    let menuPosition = {x: 0, y: 0};
    let menuVisible = false;


    $: selectedProvinceName = PROVINCES[selectedProvinceIndex]?.id ?? '';
    $: totalLevel = 0;

    const searchUrl = `https://www.google.com/search?q="${selectedProvinceName}, Colombia"`;

    const handleLevelClick = (event) => {
        const newLevel = event.target.getAttribute('level');
        const index = selectedProvinceIndex; // Use the index of the selected province
        // Update the store with the new level
        provinceLevels.update(levels => {
            levels[index] = parseInt(newLevel);
            return levels;
        });
        menuVisible = false;

    };
</script>

<section class="mx-5 w-full max-w-screen-xl items-center justify-between">
    <div class="flex flex-row flex-wrap my-3">
        <aside class="w-full sm:w-1/3 md:w-1/4 px-2">
            <div class="sticky top-20 p-4 w-full rounded-xl bg-gray-200">
                <ul class="nav flex flex-col overflow-hidden align-middle items-center gap-1 md:gap-2">

                    {#each MENU_OPTIONS as {icon, label, level, fill, textColor}}


                        <li id={level}
                            class="flex flex-row rounded align-middle flex-nowrap items-center justify-center w-full p-1 md:p-2"
                            style="
                            color: {textColor};
                            background: {fill}; opacity:1;"
                        >
                            <span
                                    class="flex items-center gap-1"
                            >
                                <svelte:component this={icon} color={textColor}/>
                                {label}
                            </span>
                        </li>

                    {/each}
                </ul>

            </div>
        </aside>
        <main class="w-full sm:w-2/3 md:w-3/4 pt-1 px-2">
            <div class="w-full rounded-xl bg-blue-200 p-2">
                <ColombiaMap
                        bind:selectedProvinceIndex={selectedProvinceIndex}
                        bind:menuPosition={menuPosition}
                        bind:menuVisible={menuVisible}
                        totalLevel={totalLevel}
                />
            </div>
            {#if menuVisible}
                <div class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                     style={
                            `position: absolute;
                            top: ${menuPosition.y}px;
                            left: ${menuPosition.x}px;`
                     }
                >
                    <div class="px-2 py-2 text-sm text-gray-900 dark:text-white">
                        <span class="font-bold">
                            {selectedProvinceName}
                        </span>
                    </div>
                    <div>
                        <div class="py-1 text-sm text-gray-700 dark:text-gray-200">
                            {#each MENU_OPTIONS as {icon, label, level}}
                                <Button
                                        icon={icon}
                                        variant="inRow"
                                        level={level}
                                        class="items-center gap-2"
                                        on:click={handleLevelClick}
                                        on:keydown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ')
                                        {handleLevelClick(event);}}
                                    }>
                                    {label}
                                </Button>
                            {/each}
                        </div>
                    </div>
                </div>
            {/if}
        </main>
    </div>
</section>