<script>
    import ColombiaMap from './ColombianMap.svelte';
    import {PROVINCES, MENU_OPTIONS, PROVINCE_LEVEL_FILLS} from '@/components/utils/constants.svelte';
    import {onMount} from 'svelte';
    import {writable} from "svelte/store";
    import {Button} from "@/components/base/button";
    import Cross from "@/components/icons/Cross.svelte";
    import { saveUserMapData, loadUserMapData, getUserMapStats, testFirestoreConnection } from '@/firebase/utils/mapData';
    import { downloadMapImage, downloadMapData } from '@/firebase/utils/downloadMap';
    import { currentUser, isLoading } from '@/firebase/utils/authStore';
    import Download from "@/components/icons/Download.svelte";

    // Props
    let className = '';

    // Create a writable store for the array of levels
    const provinceLevels = writable(new Array(PROVINCES.length).fill(0));

    let selectedProvinceIndex = 0;
    let menuPosition = {x: 0, y: 0};
    let menuVisible = false;
    let isLoadingData = true;
    let isSaving = false;
    let hasLoadedInitialData = false;
    let saveTimeout = null;
    let isDownloading = false;

    // Variables reactivas para estadísticas
    $: stats = getUserMapStats($provinceLevels);
    $: totalLevel = stats.totalScore;
    $: visitedCount = stats.visitedCount;
    $: completionPercentage = stats.completionPercentage;

    $: selectedProvinceName = PROVINCES[selectedProvinceIndex]?.id ?? '';
    $: selectedProvinceCapital = PROVINCES[selectedProvinceIndex]?.capital ?? '';

    // Función para guardar datos con debounce
    const saveDataToFirebase = async (user) => {
        if (!user || !hasLoadedInitialData) return;
        
        // Cancelar guardado anterior si existe
        if (saveTimeout) {
            clearTimeout(saveTimeout);
        }
        
        // Guardar después de 1 segundo de inactividad
        saveTimeout = setTimeout(async () => {
            isSaving = true;
            try {
                const success = await saveUserMapData(user.uid, $provinceLevels);
                if (success) {
                    console.log('✅ Datos guardados exitosamente');
                } else {
                    console.error('❌ Error guardando datos');
                }
            } catch (error) {
                console.error('❌ Error guardando datos:', error);
            } finally {
                isSaving = false;
            }
        }, 1000);
    };

    // Cargar datos cuando cambie el usuario
    $: if (!$isLoading && hasLoadedInitialData) {
        if ($currentUser) {
            console.log('🔄 Usuario detectado, guardando datos...');
            saveDataToFirebase($currentUser);
        }
    }

    // Cargar datos del usuario al montar el componente
    onMount(async () => {
        console.log('🚀 Iniciando Map.svelte...');
        
        // Esperar a que termine de cargar el estado de autenticación
        const unsubscribeLoading = isLoading.subscribe(loading => {
            if (!loading) {
                unsubscribeLoading();
                initializeMapData();
            }
        });

        return () => {
            if (saveTimeout) {
                clearTimeout(saveTimeout);
            }
        };
    });

    const initializeMapData = async () => {
        console.log('🔄 Inicializando datos del mapa...');
        console.log('👤 Usuario actual:', $currentUser?.email || 'No autenticado');
        
        // Probar conexión a Firestore
        const firestoreConnected = await testFirestoreConnection();
        if (!firestoreConnected) {
            console.error('🚫 Firestore no está disponible o no tiene permisos');
        }
        
        if ($currentUser) {
            // Usuario autenticado - cargar sus datos
            try {
                console.log('📥 Cargando datos desde Firebase...');
                const savedData = await loadUserMapData($currentUser.uid);
                if (savedData && Array.isArray(savedData)) {
                    provinceLevels.set(savedData);
                    console.log('✅ Datos cargados desde Firebase:', savedData);
                } else {
                    // No hay datos guardados, usar datos vacíos
                    provinceLevels.set(new Array(PROVINCES.length).fill(0));
                    console.log('📝 No hay datos guardados, usando datos vacíos');
                }
            } catch (error) {
                console.error('❌ Error cargando datos:', error);
                provinceLevels.set(new Array(PROVINCES.length).fill(0));
            }
        } else {
            // Usuario no autenticado - usar datos vacíos
            provinceLevels.set(new Array(PROVINCES.length).fill(0));
            console.log('🚫 Usuario no autenticado, usando datos vacíos');
        }
        
        isLoadingData = false;
        hasLoadedInitialData = true;
        console.log('✅ Inicialización completada');
    };

    const handleLevelClick = (event) => {
        const newLevel = event.target.getAttribute('level');
        const index = selectedProvinceIndex;

        console.log(`🗺️ Cambiando nivel del departamento ${selectedProvinceName} a ${newLevel}`);

        provinceLevels.update(levels => {
            const newLevels = [...levels];
            newLevels[index] = parseInt(newLevel);
            console.log('📊 Nuevos niveles:', newLevels);
            return newLevels;
        });
        
        menuVisible = false;

        // Guardar inmediatamente si hay usuario
        if ($currentUser && hasLoadedInitialData) {
            saveDataToFirebase($currentUser);
        }
    };

    const handleDownloadImage = async () => {
        if (isDownloading) return;
        
        isDownloading = true;
        try {
            const userName = $currentUser?.displayName || $currentUser?.email || 'Usuario';
            await downloadMapImage(userName, totalLevel, visitedCount, PROVINCES.length);
            console.log('✅ Mapa descargado como imagen');
        } catch (error) {
            console.error('❌ Error descargando imagen:', error);
            alert('Error al descargar la imagen. Por favor, inténtalo de nuevo.');
        } finally {
            isDownloading = false;
        }
    };

    const handleDownloadData = () => {
        try {
            const userName = $currentUser?.displayName || $currentUser?.email || 'Usuario';
            downloadMapData(userName, $provinceLevels, stats);
            console.log('✅ Datos descargados como JSON');
        } catch (error) {
            console.error('❌ Error descargando datos:', error);
            alert('Error al descargar los datos. Por favor, inténtalo de nuevo.');
        }
    };
</script>

<section class="mx-5 w-full max-w-screen-xl items-center justify-between">
    <div class="flex flex-row flex-wrap my-3">
        <aside class="order-last w-full md:w-1/3 px-2 mb-2 md:mb-0">
            <div class="flex flex-col sticky top-20 gap-2">
                <!-- Estadísticas del usuario -->
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
                            {#if $isLoading}
                                <span class="text-xs text-gray-500">Cargando...</span>
                            {:else if isSaving}
                                <span class="text-xs text-blue-600 flex items-center gap-1">
                                    <div class="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    Guardando...
                                </span>
                            {:else if $currentUser && hasLoadedInitialData}
                                <div class="group relative">
                                    <span class="text-green-600 cursor-default text-lg">✅</span>
                                    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                        Guardado en la nube
                                        <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>

                <!-- Estadísticas adicionales -->
                {#if $currentUser}
                    <div class="p-4 w-full rounded-lg border shadow-sm shadow-indigo-100 bg-gray-50">
                        <div class="flex flex-col gap-2">
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-700">Departamentos visitados:</span>
                                <span class="text-sm font-bold text-gray-900">{visitedCount}/{PROVINCES.length}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-700">Progreso:</span>
                                <span class="text-sm font-bold text-gray-900">{completionPercentage}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                     style="width: {completionPercentage}%"></div>
                            </div>
                            <div class="text-xs text-gray-600 mt-1">
                                👤 {$currentUser.email}
                            </div>
                        </div>
                    </div>
                {:else if !$isLoading}
                    <div class="p-4 w-full rounded-lg border shadow-sm shadow-yellow-100 bg-yellow-50">
                        <div class="flex flex-col">
                            <span class="text-md font-bold text-yellow-800">
                                🔐 Inicia sesión para guardar
                            </span>
                            <p class="text-sm text-yellow-700 mb-3">
                                Tu progreso se guardará automáticamente en la nube
                            </p>
                            <div class="flex gap-2">
                                <a href="/signin" class="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors">
                                    Iniciar sesión
                                </a>
                                <a href="/signup" class="bg-yellow-800 text-white px-3 py-1 rounded text-sm hover:bg-yellow-900 transition-colors">
                                    Registrarse
                                </a>
                            </div>
                        </div>
                    </div>
                {/if}

                <!-- Botones de descarga - Disponibles para todos los usuarios -->
                <div class="p-4 w-full rounded-lg border shadow-sm shadow-indigo-100 bg-gray-50">
                    <h3 class="text-md font-bold text-gray-900 mb-3">📥 Descargar mapa</h3>
                    <div class="flex flex-col gap-2">
                        <button
                            on:click={handleDownloadImage}
                            disabled={isDownloading}
                            class="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                            <Download size="16" color="white" />
                            {#if isDownloading}
                                Generando imagen...
                            {:else}
                                Descargar como imagen PNG
                            {/if}
                        </button>
                        <button
                            on:click={handleDownloadData}
                            class="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                            <Download size="16" color="white" />
                            Descargar datos como JSON
                        </button>
                    </div>
                    <p class="text-xs text-gray-600 mt-2">
                        {#if $currentUser}
                            💡 Guarda tu progreso y compártelo con otros
                        {:else}
                            💡 Crea tu mapa personalizado y descárgalo
                        {/if}
                    </p>
                </div>

                <!-- Guía de niveles -->
                <div class="p-4 w-full rounded-lg border shadow-sm shadow-indigo-100 bg-gray-50">
                    <h3 class="text-md font-bold text-gray-900 mb-3">📖 Guía de niveles</h3>
                    <ul class="nav flex flex-col overflow-hidden align-middle gap-2">
                        {#each MENU_OPTIONS as {icon, label, level, fill, textColor, textDescription}}
                            <li id={level} class="flex flex-row gap-3">
                                <span
                                    class="flex justify-center align-middle mt-1 items-center h-8 min-w-8 rounded-md border border-gray-300"
                                    style="background: {fill}; opacity:1;"
                                >
                                    <svelte:component this={icon} color={textColor}/>
                                </span>
                                <div class="flex flex-col">
                                    <span class="text-sm font-bold text-gray-900">
                                        {label}
                                    </span>
                                    <p class="text-xs text-gray-600">
                                        {textDescription}
                                    </p>
                                </div>
                            </li>
                        {/each}
                    </ul>
                    <div class="mt-3 pt-3 border-t border-gray-200">
                        <p class="text-xs text-gray-600">
                            💡 Haz clic en cualquier departamento del mapa para asignar tu nivel de experiencia
                        </p>
                    </div>
                </div>

                <!-- Información del proyecto -->
                <div class="p-4 w-full rounded-lg border shadow-sm shadow-indigo-100 bg-gray-50">
                    <h3 class="text-md font-bold text-gray-900 mb-3">ℹ️ Acerca del proyecto</h3>
                    <p class="text-sm text-gray-700 mb-3">
                        Este proyecto está basado en una serie de mapas de viajes interactivos:
                    </p>
                    <div class="flex flex-col gap-1 text-xs">
                        <a href="https://zhung.com.tw/japanex/" target="_blank" rel="noopener noreferrer" 
                           class="text-blue-600 hover:text-blue-800 underline">
                            🇯🇵 Mapa original de Japón
                        </a>
                        <a href="https://github.com/OSSPhilippines/philippines-travel-level-map" target="_blank" rel="noopener noreferrer"
                           class="text-blue-600 hover:text-blue-800 underline">
                            🇵🇭 Versión de Filipinas
                        </a>
                        <a href="https://github.com/aumentada/colombia" target="_blank" rel="noopener noreferrer"
                           class="text-blue-600 hover:text-blue-800 underline">
                            🇨🇴 Datos del mapa de Colombia
                        </a>
                    </div>
                    <p class="text-xs text-gray-600 mt-2">
                        Construido con Astro + Svelte + Firebase
                    </p>
                    
                    <!-- Marca personal -->
                    <div class="mt-3 flex text-center text-sm text-gray-500 dark:text-gray-400 lg:text-right">
                        Mapa de Colombia · Site by 
                        <a class="flex items-center justify-center text-center" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/luismateoh/">
                            <div class="mx-1 w-5 rounded-sm bg-blue-900 py-1 align-middle text-[9px] text-white hover:animate-spin">
                                <p class="-m-1 align-middle">LM</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </aside>

        <main class="w-full md:w-2/3 pt-1 px-2 mb-2 md:mb-0">
            <div class="w-full rounded-xl bg-blue-200 p-2 border shadow-sm shadow-indigo-100">
                {#if isLoadingData || $isLoading}
                    <div class="flex justify-center items-center h-96">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span class="ml-2 text-gray-600">
                            {#if $currentUser}
                                📥 Cargando tu progreso...
                            {:else}
                                🗺️ Cargando mapa...
                            {/if}
                        </span>
                    </div>
                {:else}
                    <ColombiaMap
                        bind:selectedProvinceIndex={selectedProvinceIndex}
                        bind:menuPosition={menuPosition}
                        bind:menuVisible={menuVisible}
                        provinceLevels={provinceLevels}
                    />
                {/if}
            </div>

            <!-- Menú de selección de nivel -->
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