<template>
    <li :data-bgscr="url">
        <i :class="icon"></i>
        <h4>{{ title }}</h4>
        <p>{{ subtitle }}</p>
    </li>
</template>
<script>
    export default {
        props: ['url', 'icon', 'title', 'subtitle']
    }
</script>
