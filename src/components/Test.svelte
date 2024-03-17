<script>
    let colour = 'red';

    function handleMouseOver(e) {
        colour = 'green';
    }

    function handleMouseOut(e) {
        colour = 'red';
    }

    function handleFocus(e) {
        colour = 'green';
    }

    function handleBlur(e) {
        colour = 'red';
    }
</script>

<svg height="100" width="100">
    <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill={colour}
            on:mouseover={handleMouseOver} on:mouseout={handleMouseOut}
            on:focus={handleFocus} on:blur={handleBlur}
            tabindex="0" role="button"/>
</svg>