<template>
    <div class="container-fluid">
        <router-link class="btn btn-secondary mb-4" :to="{ name: 'photo-create' }">
            <i class="fas fa-fw fa-camera-retro"></i>
            <span>Dodaj zdjęcie</span>
        </router-link>
        <PhotoTable></PhotoTable>
    </div>
</template>
