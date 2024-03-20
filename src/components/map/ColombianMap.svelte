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
                    provinceElement.style.fill = PROVINCE_LEVEL_FILLS[level];
                }
            });
        });
    });

    export let selectedProvinceIndex;
    export let menuPosition;
    export let menuVisible;
    export const totalLevel = 5;

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
        const targetElement = event.currentTarget;
        const provIndex = targetElement.getAttribute('index');
        const currentColor = $provinceLevels[provIndex] ? PROVINCE_LEVEL_FILLS[$provinceLevels[provIndex]] : color;
        targetElement.style.fill = darkenColor(currentColor, 20);
        const position = targetElement.getBoundingClientRect();
        tooltipPosition = {
            x: position.x + window.scrollX,
            y: position.y + window.scrollY,
        }
        tooltipContent = targetElement.getAttribute('id').replace(/_/g, ' ');
        tooltipVisible = true;
    };

    const handleMouseLeave = (event) => {
        const targetElement = event.currentTarget;
        const provIndex = targetElement.getAttribute('index');
        targetElement.style.fill = $provinceLevels[provIndex] ? PROVINCE_LEVEL_FILLS[$provinceLevels[provIndex]] : color;
        tooltipVisible = false;
    };

    function darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) - amt,
            B = (num >> 8 & 0x00FF) - amt,
            G = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
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
                    on:click={handleProvinceClick}
                    on:mouseover={handleMouseEnter}
                    on:mouseleave={handleMouseLeave}
                    on:focus={handleProvinceClick}
                    on:blur={handleProvinceClick}
                    on:keydown={(event) => { if (event.key === 'Enter') handleProvinceClick(event); }}
                    tabindex="-1"
                    role="button"
            >

            </path>

        </g>
    {/each}
</svg>
