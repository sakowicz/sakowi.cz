<template>
    <div class="container-fluid">

        <div class="text-center">
            <div class="error mx-auto" data-text="404">404</div>
            <p class="lead text-gray-800 mb-5">Strona nie odnaleziona</p>
            <router-link :to="{ name: 'dashboard' }">Dashboard</router-link>
        </div>

    </div>
</template>
