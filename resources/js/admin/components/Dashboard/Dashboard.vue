<template>
    <div class="container-fluid">

        <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800"></h1>
        </div>

        <div class="row">
            <SingleStats
                :title="'Zdjęć w ogóle'"
                :value="stats.photosAll"
                :icon="'fas fa-camera'"
                :cardClass="'border-left-primary'">
            </SingleStats>
            <SingleStats
                :title="'Zdjęć na stronie głównej'"
                :value="stats.photosOnHomepage"
                :icon="'fas fa-camera-retro'"
                :cardClass="'border-left-success'">
            </SingleStats>
        </div>

    </div>
</template>

<script>
export default {
    created() {
        axios.get('/stats').then(res => {
            this.stats = res.data;
        });
    },
    data() {
        return {
            stats: []
        };
    }
}
</script>
