<script>
    import {PROVINCE_LEVEL_FILLS, PROVINCES} from '@/components/utils/constants.svelte';
    import {getContext, onMount} from "svelte";


    let color = '#ffffff';

    const provinceLevels = getContext('provinceLevels');


    onMount(() => {
        provinceLevels.subscribe(levels => {

            levels.forEach((level, index) => {
                const provinceElement = document.getElementById(PROVINCES[index].id);
                if (provinceElement) {
                    const path = provinceElement.querySelector('path');
                    if (path) {
                        path.style.fill = PROVINCE_LEVEL_FILLS[level];
                    }
                }
            });
        });
    });

    export let selectedProvinceIndex;
    export let menuPosition;
    export let menuVisible;

    let tooltipVisible = false;
    let tooltipPosition = {x: 0, y: 0};
    let tooltipContent = '';

    const handleProvinceClick = (event) => {
        const offsetY =
            event.target.getBoundingClientRect().y + 210 - window.innerHeight < 0
                ? 0
                : event.target.getBoundingClientRect().y + 210 - window.innerHeight;
        const offsetX =
            event.target.getBoundingClientRect().x + 200 - window.innerWidth < 0
                ? 0
                : event.target.getBoundingClientRect().x + 200 - window.innerWidth;
        selectedProvinceIndex = event.target.getAttribute('index');
        menuPosition = {
            x: event.target.getBoundingClientRect().x + window.scrollX - offsetX,
            y: event.target.getBoundingClientRect().y + window.scrollY - offsetY,
        };
        menuVisible = true;
    };

    const handleMouseEnter = (event) => {
        try {
            const targetElement = event.currentTarget;
            const provIndex = targetElement.getAttribute('index');
            const currentColor = $provinceLevels[provIndex] ? PROVINCE_LEVEL_FILLS[$provinceLevels[provIndex]] : color;
            
            // Validar que el color sea una string válida antes de usar darkenColor
            if (typeof currentColor === 'string' && currentColor.startsWith('#')) {
                targetElement.style.fill = darkenColor(currentColor, 20);
            } else {
                // Fallback a color por defecto si el color no es válido
                targetElement.style.fill = darkenColor('#ffffff', 20);
            }
            
            const position = targetElement.getBoundingClientRect();
            tooltipPosition = {
                x: position.x + window.scrollX,
                y: position.y + window.scrollY,
            }
            tooltipContent = targetElement.getAttribute('id').replace(/_/g, ' ');
            tooltipVisible = true;
        } catch (error) {
            console.error('Error in handleMouseEnter:', error);
            // Fallback silencioso - no cambiar el color si hay error
        }
    };

    const handleMouseLeave = (event) => {
        try {
            const targetElement = event.currentTarget;
            const provIndex = targetElement.getAttribute('index');
            const originalColor = $provinceLevels[provIndex] ? PROVINCE_LEVEL_FILLS[$provinceLevels[provIndex]] : color;
            
            // Validar el color antes de aplicarlo
            if (typeof originalColor === 'string') {
                targetElement.style.fill = originalColor;
            } else {
                targetElement.style.fill = color;
            }
            tooltipVisible = false;
        } catch (error) {
            console.error('Error in handleMouseLeave:', error);
            // Fallback silencioso
            tooltipVisible = false;
        }
    };

    function darkenColor(colorValue, percent) {
        try {
            // Validar entrada
            if (!colorValue || typeof colorValue !== 'string') {
                console.warn('Invalid color value:', colorValue);
                return '#ffffff'; // Color por defecto
            }
            
            // Asegurar que el color comience con #
            const cleanColor = colorValue.startsWith('#') ? colorValue : '#' + colorValue;
            
            // Validar formato hexadecimal
            if (!/^#[0-9A-F]{6}$/i.test(cleanColor)) {
                console.warn('Invalid hex color format:', cleanColor);
                return '#ffffff'; // Color por defecto
            }
            
            const num = parseInt(cleanColor.replace("#", ""), 16);
            const amt = Math.round(2.55 * percent);
            const R = Math.max(0, Math.min(255, (num >> 16) - amt));
            const B = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) - amt));
            const G = Math.max(0, Math.min(255, (num & 0x0000FF) - amt));
            
            return "#" + (0x1000000 + R * 0x10000 + B * 0x100 + G).toString(16).slice(1);
        } catch (error) {
            console.error('Error in darkenColor:', error);
            return '#ffffff'; // Color por defecto en caso de error
        }
    }

    const handleOutsideClick = () => {
        menuVisible = false;
    };
</script>

{#if tooltipVisible}
    <span style={
        `top: ${tooltipPosition.y}px; left: ${tooltipPosition.x}px;`
    } class="map-tooltip">{tooltipContent}</span>
{/if}
<svg
        xmlns="http://www.w3.org/2000/svg"
        id="svg574"
        version="1.1"
        viewBox="0 0 840 1155"
        xmlSpace="preserve"

>
    <g id="Background">
        <path
                id="rect11351"
                fill-opacity="0"
                stroke-width="0.75"
                d="M -1.031 1.031 H 841.288 V 1155 H 9 z"
                onClick={(event) => handleOutsideClick(event)}

        >
        </path>
    </g>

    {#each PROVINCES as province, provIndex}
        <g
                key={province.id}
                class="province-layer"
                id={province.id}
                transform={province.transform}

        >
            <path
                    id={province.id}
                    index={provIndex}
                    fill={$provinceLevels[provIndex] ? PROVINCE_LEVEL_FILLS[$provinceLevels[provIndex]] : color}
                    fill-rule="nonzero"
                    stroke="#BFDBFE"
                    stroke-dasharray="none"
                    stroke-dashoffset="0"
                    stroke-linecap="butt"
                    stroke-linejoin="miter"
                    stroke-miterlimit="4"
                    stroke-width="1.5"
                    stroke-opacity="1"
                    d={province.drawPath}
                    opacity="2"
                    vector-effect="non-scaling-stroke"
                    style="cursor: pointer;"
                    on:click={handleProvinceClick}
                    on:mouseenter={handleMouseEnter}
                    on:mouseleave={handleMouseLeave}
                    on:focus={handleProvinceClick}
                    on:blur={handleProvinceClick}
                    on:keydown={(event) => { if (event.key === 'Enter') handleProvinceClick(event); }}
                    tabindex="0"
                    role="button"
            >
            </path>
        </g>
    {/each}
</svg>
