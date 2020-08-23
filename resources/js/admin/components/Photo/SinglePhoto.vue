<template>
    <tr>
        <td class="photo">
            <img :alt="title" :src="`/${image}`"></td>
        <td>{{ title }}</td>
        <td class="action">
            <router-link class="btn btn-info" :to="{ name: 'photo-edit',  params: {id}}">
                <i class="fas fa-edit"></i>
            </router-link>
            <button v-on:click="toggleIsOnHomepage" class="btn" :class=switchColorClass title="Pokaż na głównej">
                <i class="fas" :class=switchIconClass></i>
            </button>
            <a class="btn btn-light" :href="`/${image}`" target="_blank">
                <i class="fas fa-link"></i>
            </a>
        </td>
    </tr>
</template>
<script>
export default {
    props: ['title', 'image', 'id', 'isOnHomepage'],
    computed: {
        switchColorClass() {
            return this.isOnHomepage ? 'btn-success' : 'btn-danger'
        },
        switchIconClass() {
            return this.isOnHomepage ? 'fa-toggle-on' : 'fa-toggle-off'
        },
    },
    methods: {
        toggleIsOnHomepage() {
            axios.patch(`/photos/toggle-is-on-homepage/${this.id}`).then((res) => {
                this.$emit('update-is-on-homepage', res.data, this.id)
            })
        }
    }
}
</script>
