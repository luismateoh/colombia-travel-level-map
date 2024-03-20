<script>
    import ColombiaMap from './ColombianMap.svelte';
    import {PROVINCES, MENU_OPTIONS} from '@/components/utils/constants.svelte';
    import {onMount, setContext} from 'svelte';
    import {writable} from "svelte/store";
    import {Button} from "@/components/base/button";
    import Cross from "@/components/icons/Cross.svelte";

    // Create a writable store for the array of levels
    const provinceLevels = writable(new Array(PROVINCES.length).fill(0));

    // Set the store in the context
    setContext('provinceLevels', provinceLevels);

    let selectedProvinceIndex = 0;
    let menuPosition = {x: 0, y: 0};
    let menuVisible = false;


    $: selectedProvinceName = PROVINCES[selectedProvinceIndex]?.id ?? '';
    $: selectedProvinceCapital = PROVINCES[selectedProvinceIndex]?.capital ?? '';
    $: totalLevel = 0;

    const searchUrl = `https://www.google.com/search?q="${selectedProvinceName}, Colombia"`;

    const handleLevelClick = (event) => {
        const newLevel = event.target.getAttribute('level');
        const index = selectedProvinceIndex; // Use the index of the selected province

        provinceLevels.update(levels => {
            levels[index] = parseInt(newLevel);
            return levels;
        });
        menuVisible = false;

    };
</script>

<section class="mx-5 w-full max-w-screen-xl items-center justify-between">
    <div class="flex flex-row flex-wrap my-3">
        <aside class="order-last w-full md:w-1/3 px-2 mb-2 md:mb-0">
            <div class="flex flex-col sticky top-20 gap-2">
                <div class="p-4 w-full rounded-lg border shadow-sm shadow-indigo-100 bg-gray-50">
                    <div class="flex flex-row justify-between items-center">
                        <div class="flex flex-col">
                        <span class="text-md font-bold text-gray-900">
                            Puntaje total
                        </span>
                            <p class="text-sm text-gray-700">
                                Suma de los puntajes de cada departamento
                            </p>
                        </div>
                        <div class="flex flex-row items-center gap-2">
                        <span class="text-2xl font-bold text-gray-900">
                            {totalLevel}
                        </span>
                        </div>
                    </div>
                </div>

                <div class="p-4 w-full rounded-lg border shadow-sm shadow-indigo-100 bg-gray-50">
                    <ul class="nav flex flex-col overflow-hidden align-middle gap-1 md:gap-2">

                        {#each MENU_OPTIONS as {icon, label, level, fill, textColor, textDescription}}


                            <li id={level}
                                class="flex flex-row gap-2"
                            >
                            <span
                                    class="flex justify-center align-middle mt-1.5 items-center h-10 min-w-10 min rounded-md bg-gray-100  shadow-sm shadow-indigo-100"
                                    style="background: {fill}; opacity:1;"
                            >
                                <svelte:component this={icon} color={textColor}/>
                            </span>

                                <div class="flex flex-col">
                                <span class="text-md font-bold text-gray-900">
                                   {label}
                                </span>
                                    <p class="text-sm text-gray-700">
                                        {textDescription}
                                </div>
                            </li>

                        {/each}
                    </ul>

                </div>
                <div class="p-4 w-full"
                     style="background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);">
                    <div class="flex flex-row justify-between items-center">
                        <div class="flex flex-col">
                        <span class="text-md font-bold text-gray-900">
                            Acerca del proyecto
                        </span>
                            <p class="text-sm text-gray-700">
                                Este proyecto está basado en la versión de Colombia, que a su vez está basado en la
                                versión de Filipinas, que a su vez está basado en la versión de Japón y fue construido
                                usando Astro + Svelte.
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </aside>
        <main class="w-full md:w-2/3 pt-1 px-2 mb-2 md:mb-0">
            <div class="w-full rounded-xl bg-blue-200 p-2 border shadow-sm shadow-indigo-100">
                <ColombiaMap
                        bind:selectedProvinceIndex={selectedProvinceIndex}
                        bind:menuPosition={menuPosition}
                        bind:menuVisible={menuVisible}
                        totalLevel={totalLevel}
                />
            </div>
            {#if menuVisible}
                <div class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
                     style={
                            `position: absolute;
                            top: ${menuPosition.y}px;
                            left: ${menuPosition.x}px;`
                     }
                >
                    <Button
                            variant="xMark"
                            class="absolute flex flex-col max-w-4 max-h-4 top-1 right-1 rounded-md p-0"
                            on:click={() => menuVisible = false}
                            on:keydown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ')
                            {menuVisible = false;}}
                        }>
                       <Cross color="#000000"/>
                    </Button>
                    <div class="flex flex-col px-2 py-2 text-sm text-gray-900">
                        <span class="font-bold">
                            {selectedProvinceName}
                        </span>
                        <span class="text-xs text-gray-700">
                            {selectedProvinceCapital}
                        </span>
                    </div>
                    <div>
                        <div class="py-1 text-sm text-gray-700">
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