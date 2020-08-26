<template>
    <form @submit.prevent="onSubmit" @keydown="form.errors.clear($event.target.name)">
        <div class="form-group">
            <label for="title">Tytuł:</label>
            <input class="form-control" id="title" name="title" v-model="form.title">
            <span class="text-danger" v-if="form.errors.has('title')" v-text="form.errors.get('title')"></span>
        </div>
        <div class="form-group">
            <label for="subtitle">Podtytuł:</label>
            <input class="form-control" id="subtitle" name="subtitle" v-model="form.subtitle">
            <span class="text-danger" v-if="form.errors.has('subtitle')" v-text="form.errors.get('subtitle')"></span>
        </div>
        <div v-if="!this.photo">
            <div class="form-group">
                <label for="image">Zdjęcie</label>
                <input type="file" class="form-control-file" id="image" name="image" @change="onFileChange"
                       accept="image/*">
                <span class="text-danger" v-if="form.errors.has('image')" v-text="form.errors.get('image')"></span>
            </div>
            <div class="form-group">
                <label for="image">Nazwa pliku</label>
                <input class="form-control" id="image_name" name="image_name" v-model="form.image_name">
                <span class="text-danger" v-if="form.errors.has('image_name')"
                      v-text="form.errors.get('image_name')"></span>
            </div>
        </div>
        <div class="form-check">
            <input type="checkbox" class="form-check-input" id="is_on_homepage" name="is_on_homepage"
                   v-model="form.is_on_homepage">
            <label class="form-check-label" for="is_on_homepage">Wyświetl na stronie głównej:</label>
            <span class="text-danger" v-if="form.errors.has('is_on_homepage')"
                  v-text="form.errors.get('is_on_homepage')"></span>
        </div>
        <button type="submit" class="btn btn-primary mt-4" :disabled="form.errors.any()">Wyślij</button>
    </form>
</template>

<script>
const {Form} = require("../../Form");

export default {
    props: ['photo'],
    data() {
        return {
            form: new Form({
                title: '',
                subtitle: '',
                image: '',
                image_name: '',
                is_on_homepage: false,
            }),
        }
    },
    methods: {
        onSubmit() {
            if (this.photo) {
                return this.updatePhoto();
            } else {
                return this.storePhoto();
            }
        },
        updatePhoto() {
            this.form.put(`/photos/${this.photo.id}`).then(this.handleResponse);
        },
        storePhoto() {
            this.form.post('/photos').then(this.handleResponse);
        },
        handleResponse(response) {
            toastr.success(response.message);
            this.$router.push('/photo');
        },
        onFileChange(e) {
            if (e.target.files.length) {
                this.form.image = e.target.files[0];
            } else {
                this.form.image = '';
            }
        },
    },
    watch: {
        photo() {
            this.form.update(this.photo);
        }
    }
}
</script>
