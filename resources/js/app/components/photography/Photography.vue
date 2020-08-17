<template>
    <div>
        <div id="wrapper">
            <div class="content-holder elem scale-bg2 transition3">
                <div class="content full-height">
                    <div class="resize-carousel-holder">
                        <div class="p_horizontal_wrap">
                            <div id="portfolio_horizontal_container">
                                <photo-single v-for="photo in photos"
                                              v-bind:key="photo.url"
                                              :url="photo.image"
                                              :title="photo.title"
                                              :subtitle="photo.subtitle"
                                >
                                </photo-single>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="left-decor"></div>
    </div>
</template>
<script>
export default {
    created() {
        axios.get('/photos').then(res => {
            res.data.forEach(data => {
                this.photos.push(data);
                this.shuffleArray(this.photos);
            });

        }).finally(() => {
            this.initEvent('initOutdoorSlider');
        });
    },
    data() {
        return {
            photos: []
        };
    }
};
</script>
