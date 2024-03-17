<script>
    import ColombiaMap from '../components/ColombianMap.svelte';
    import {PROVINCES, MENU_OPTIONS} from '../components/utils/constants.svelte';
    import {setContext} from 'svelte';
    import {writable} from "svelte/store";

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
                <ul class="nav flex flex-col overflow-hidden">
                    <li class="nav-item">
                        <a class="nav-link text-purple-800 hover:text-purple-600 truncate" href="/#home">
                            <span class="fa fa-home mr-2"></span> Home
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-purple-800 hover:text-purple-600 truncate" href="/#orders">
                            <span class="fa fa-list-alt mr-2"></span> Orders </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-purple-800 hover:text-purple-600" href="/#products">
                            <span class="fa fa-cart-plus mr-2"></span> Products </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-purple-800 hover:text-purple-600" href="/#customers">
                            <span class="fa fa-user mr-2"></span> Customers </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-purple-800 hover:text-purple-600" href="/#reports">
                            <span class="fa fa-chart-bar mr-2"></span> Reports </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-purple-800 hover:text-purple-600" href="/#int">
                            <span class="fa fa-layer-group mr-2"></span> Integrations </a>
                    </li>
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
                <div class="level-menu"
                     style={
                            `position: absolute;
                            top: ${menuPosition.y}px;
                            left: ${menuPosition.x}px;`
                     }
                >

                    <div>
                        <a class="menu-header"
                           href={searchUrl}
                        >
                            {selectedProvinceName} ↗
                        </a>
                        {#each MENU_OPTIONS as {label, level}}
                            <button
                                    class="level-{level}"
                                    level={level}
                                    on:click={handleLevelClick}
                                    on:keydown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ')
                                        {handleLevelClick(event);}}
                                    }>
                                {label}
                            </button>
                        {/each}
                    </div>
                </div>
            {/if}
        </main>
    </div>
</section>

<style>
    .level-menu {
        background-color: white;
        width: 200px;
        border-style: solid;
        border-width: thin;
        border-radius: 10px;
        border-color: black;
        text-indent: 10px;
        z-index: 1000;
    }

    .menu-header {
        display: flex;
        min-height: 25px;
        align-items: center;
    }

</style>