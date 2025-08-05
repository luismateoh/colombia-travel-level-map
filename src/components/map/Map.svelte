<script>
    import ColombiaMap from './ColombianMap.svelte';
    import {PROVINCES, MENU_OPTIONS, PROVINCE_LEVEL_FILLS} from '@/components/utils/constants.svelte';
    import {onMount, setContext} from 'svelte';
    import {writable} from "svelte/store";
    import {Button} from "@/components/base/button";
    import Cross from "@/components/icons/Cross.svelte";
    import { saveUserMapData, loadUserMapData, getUserMapStats, testFirestoreConnection } from '@/firebase/utils/mapData';
    import { downloadMapImage, downloadMapData } from '@/firebase/utils/downloadMap';
    import { currentUser, isLoading } from '@/firebase/utils/authStore';
    import Download from "@/components/icons/Download.svelte";
    import GoogleSignInButton from '@/components/social/GoogleSignInButton.svelte';
    import ResetMapModal from '@/components/ResetMapModal.svelte';
    import { t } from '@/lib/i18n';

    // Props
    let className = '';

    // Create a writable store for the array of levels
    const provinceLevels = writable(new Array(PROVINCES.length).fill(0));

    // Set the store in the context
    setContext('provinceLevels', provinceLevels);

    let selectedProvinceIndex = 0;
    let menuPosition = {x: 0, y: 0};
    let menuVisible = false;
    let isLoadingData = true;
    let isSaving = false;
    let hasLoadedInitialData = false;
    let saveTimeout = null;
    let isDownloading = false;
    let showResetModal = false;

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

    const handleResetMap = async () => {
        console.log('🔄 Reseteando mapa...');
        
        // Resetear los datos localmente
        provinceLevels.set(new Array(PROVINCES.length).fill(0));
        
        // Si hay usuario autenticado, también resetear en Firebase
        if ($currentUser && hasLoadedInitialData) {
            try {
                const success = await saveUserMapData($currentUser.uid, new Array(PROVINCES.length).fill(0));
                if (success) {
                    console.log('✅ Mapa reseteado y guardado en Firebase');
                } else {
                    console.error('❌ Error guardando mapa reseteado en Firebase');
                }
            } catch (error) {
                console.error('❌ Error guardando mapa reseteado:', error);
            }
        }
        
        showResetModal = false;
        console.log('✅ Mapa reseteado exitosamente');
    };

    // Función helper para convertir etiquetas a claves de traducción
    const getLevelTranslationKey = (label) => {
        const labelMap = {
            'Viví ahí': 'vivíahí',
            'Me quede ahí': 'mequedeahí',
            'Visité ahí': 'visitéahí',
            'Aterrice ahí': 'aterriceahí',
            'Pasé por ahí': 'paséporahí',
            'Nunca estuve ahí': 'nuncaestuveahí'
        };
        return labelMap[label] || label.toLowerCase().replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

</script>

<section class="mx-5 w-full max-w-screen-xl items-center justify-between">
    <div class="flex flex-row flex-wrap my-3">
        <aside class="order-last w-full md:w-1/3 px-2 mb-2 md:mb-0">
            <div class="flex flex-col sticky top-20 gap-2">
                <!-- Mensaje de sitio en construcción -->
                <div class="p-4 w-full rounded-lg border shadow-sm shadow-orange-100 bg-orange-50">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <h3 class="text-sm font-bold text-orange-800">
                                {$t('siteUnderConstruction')}
                            </h3>
                            <p class="text-xs text-orange-700 mt-1">
                                {$t('improvingExperience')}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Estadísticas del usuario -->
                <div class="p-4 w-full rounded-lg border shadow-sm shadow-indigo-100 bg-gray-50">
                    <div class="flex flex-row justify-between items-center">
                        <div class="flex flex-col">
                            <span class="text-md font-bold text-gray-900">
                                {$t('totalScore')}
                            </span>
                            <p class="text-sm text-gray-700">
                                {$t('totalScoreDescription')}
                            </p>
                        </div>
                        <div class="flex flex-row items-center gap-2">
                            <span class="text-2xl font-bold text-gray-900">
                                {totalLevel}
                            </span>
                            {#if $isLoading}
                                <span class="text-xs text-gray-500">{$t('loading')}</span>
                            {:else if isSaving}
                                <span class="text-xs text-blue-600 flex items-center gap-1">
                                    <div class="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                </span>
                            {:else if $currentUser && hasLoadedInitialData}
                                <div class="group relative">
                                    <span class="text-green-600 cursor-default text-lg">✅</span>
                                    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                        {$t('savedInCloud')}
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
                                <span class="text-sm text-gray-700">{$t('visitedDepartments')}:</span>
                                <span class="text-sm font-bold text-gray-900">{visitedCount}/{PROVINCES.length}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-700">{$t('progress')}:</span>
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
                                {$t('signInToSave')}
                            </span>
                            <p class="text-sm text-yellow-700 mb-3">
                                {$t('progressWillBeSaved')}
                            </p>
                            <div class="flex justify-center">
                                <GoogleSignInButton />
                            </div>
                        </div>
                    </div>
                {/if}

                <!-- Guía de niveles -->
                <div class="p-4 w-full rounded-lg border shadow-sm shadow-indigo-100 bg-gray-50">
                    <h3 class="text-md font-bold text-gray-900 mb-3">{$t('levelGuide')}</h3>
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
                                        {$t(`levels.${getLevelTranslationKey(label)}`)}
                                    </span>
                                    <p class="text-xs text-gray-600">
                                        {$t(`levels.${getLevelTranslationKey(label)}Description`)}
                                    </p>
                                </div>
                            </li>
                        {/each}
                    </ul>
                    <div class="mt-3 pt-3 border-t border-gray-200">
                        <p class="text-xs text-gray-600">
                            {$t('levelGuideTooltip')}
                        </p>
                    </div>
                </div>

                <!-- Botones de descarga -->
                <div class="p-4 w-full rounded-lg border shadow-sm shadow-indigo-100 bg-gray-50">
                    <h3 class="text-md font-bold text-gray-900 mb-3">{$t('downloadMap')}</h3>
                    <div class="flex flex-col gap-2">
                        <button
                            on:click={handleDownloadImage}
                            disabled={isDownloading}
                            class="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                            <Download size="16" color="white" />
                            {#if isDownloading}
                                {$t('generatingImage')}
                            {:else}
                                {$t('downloadAsPNG')}
                            {/if}
                        </button>
                        <button
                            on:click={handleDownloadData}
                            class="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                            <Download size="16" color="white" />
                            {$t('downloadAsJSON')}
                        </button>
                    </div>
                    <p class="text-xs text-gray-600 mt-2">
                        {#if $currentUser}
                            {$t('saveAndShare')}
                        {:else}
                            {$t('createCustomMap')}
                        {/if}
                    </p>
                </div>

                <!-- Opción de resetear mapa -->
                {#if $currentUser}
                    <div class="p-4 w-full rounded-lg border shadow-sm shadow-red-100 bg-red-50">
                        <h3 class="text-md font-bold text-red-800 mb-3">{$t('resetMap')}</h3>
                        <p class="text-sm text-red-700 mb-3">
                            {$t('resetDescription')}
                        </p>
                        <button
                            on:click={() => showResetModal = true}
                            class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                            {$t('resetAllMap')}
                        </button>
                    </div>
                {/if}

                <!-- Información del proyecto -->
                <div class="p-4 w-full rounded-lg border shadow-sm shadow-indigo-100 bg-gray-50">
                    <h3 class="text-md font-bold text-gray-900 mb-3">{$t('aboutProject')}</h3>
                    <p class="text-sm text-gray-700 mb-3">
                        {$t('projectDescription')}
                    </p>
                    <div class="flex flex-col gap-1 text-xs">
                        <a href="https://zhung.com.tw/japanex/" target="_blank" rel="noopener noreferrer" 
                           class="text-blue-600 hover:text-blue-800 underline">
                            {$t('originalJapanMap')}
                        </a>
                        <a href="https://github.com/OSSPhilippines/philippines-travel-level-map" target="_blank" rel="noopener noreferrer"
                           class="text-blue-600 hover:text-blue-800 underline">
                            {$t('philippinesVersion')}
                        </a>
                        <a href="https://github.com/aumentada/colombia" target="_blank" rel="noopener noreferrer"
                           class="text-blue-600 hover:text-blue-800 underline">
                            {$t('colombiaMapData')}
                        </a>
                    </div>
                    <p class="text-xs text-gray-600 mt-2">
                        {$t('builtWith')}
                    </p>
                    
                    <!-- Marca personal -->
                    <div class="mt-3 flex text-center text-sm text-gray-500 dark:text-gray-400 lg:text-right">
                        {$t('title')} · {$t('siteBy')} 
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
                <ColombiaMap
                    bind:selectedProvinceIndex={selectedProvinceIndex}
                    bind:menuPosition={menuPosition}
                    bind:menuVisible={menuVisible}
                />
                
                <!-- Overlay de carga discreto solo para datos del usuario -->
                {#if isLoadingData && $currentUser}
                    <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
                        <div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span class="text-sm text-gray-600">{$t('loadingProgress')}</span>
                    </div>
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
                                    {$t(`levels.${getLevelTranslationKey(label)}`)}
                                </Button>
                            {/each}
                        </div>
                    </div>
                </div>
            {/if}
        </main>
    </div>
</section>

<!-- Modal de reseteo -->
<ResetMapModal 
    isOpen={showResetModal}
    onConfirm={handleResetMap}
    onCancel={() => showResetModal = false}
/>