<template>
    <div class="portfolio_item">
        <img :src="this.storageUrl(url)" :alt="title">
        <div class="port-desc-holder">
            <div class="port-desc">
                <div class="overlay"></div>
            </div>
        </div>
        <div class="port-subtitle-holder">
            <div class="port-subtitle">
                <h1>{{ title }}</h1>
                <span class="subtitleSpan">{{ subtitle }}</span>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['title', 'subtitle', 'url']
    };
</script>
