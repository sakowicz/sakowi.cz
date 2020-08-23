<template>
    <div class="container-fluid">
        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Edytuj zdjęcie</h6>
            </div>
            <div class="card-body">
                <PhotoForm :photo="photo"></PhotoForm>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['id'],
    data() {
        return {
            photo: null
        }
    },
    created() {
        axios.get(`/photos/${this.id}`).then(response => {
            this.photo = response.data;
        });
    }
}
</script>
