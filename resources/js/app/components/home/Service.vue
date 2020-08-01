<template>
    <li :data-bg-src="img">
        <i :class="icon"></i>
        <h4>{{ title }}</h4>
        <p>{{ subtitle }}</p>
    </li>
</template>
<script>
export default {
    props: ['img', 'icon', 'title', 'subtitle']
}
</script>
