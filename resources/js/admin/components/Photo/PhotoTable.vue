<template>
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Zdjęcia</h6>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered" id="photosDataTable" width="100%" cellspacing="0">
                    <thead>
                    <tr>
                        <th class="no-sort">Podgląd</th>
                        <th>Tytuł</th>
                        <th class="no-sort"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <SinglePhoto
                        v-for="photo in photos"
                        :title="photo.title"
                        :image="photo.image"
                        :id="photo.id"
                        :key="photo.id"
                        :isOnHomepage="photo.is_on_homepage"
                        @update-is-on-homepage="updateIsOnHomepage"
                    ></SinglePhoto>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    created() {
        axios.get('/photos').then(res => {
            this.photos = res.data;
            this.$nextTick(this.initDatatables);
        });
    },
    data() {
        return {
            photos: [],
        }
    },
    methods: {
        initDatatables: () => {
            $('#photosDataTable').DataTable({
                pageLength: 100,
                lengthMenu: [[10, 50, 100, -1], [10, 50, 100, "All"]],
                order: [],
                columnDefs: [{
                    targets: 'no-sort',
                    orderable: false,
                }],
            });
        },
        updateIsOnHomepage(isOnHomepage, photoId) {
            const photo = this.photos.find(photo => photo.id === photoId);
            photo.is_on_homepage = isOnHomepage;
        }
    }
}
</script>

<style lang="scss">
#photosDataTable {
    td {
        vertical-align: middle;
    }

    .photo {
        text-align: center;
        width: 1%;

        img {
            height: 100px;
        }
    }

    .action {
        text-align: right;
        white-space: nowrap;
        width: 1%;
    }
}

</style>
