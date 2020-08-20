<template>
    <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
        <router-link class="sidebar-brand d-flex align-items-center justify-content-center" :to="{ name: 'dashboard' }">
            <div class="sidebar-brand-icon">
                <i class="fas fa-camera"></i>
            </div>
            <div class="sidebar-brand-text mx-3">sakowi.cz</div>
        </router-link>

        <hr class="sidebar-divider my-0">

        <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'dashboard' }">
                <i class="fas fa-fw fa-tachometer-alt"></i>
                <span>Dashboard</span>
            </router-link>
        </li>

        <hr class="sidebar-divider">

        <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'photo' }">
                <i class="fas fa-fw fa-camera-retro"></i>
                <span>Zdjęcia</span>
            </router-link>
        </li>

        <hr class="sidebar-divider d-none d-md-block">

        <div class="text-center d-none d-md-inline">
            <button class="rounded-circle border-0" id="sidebarToggle"></button>
        </div>

    </ul>
</template>

<script>
export default {
    mounted() {
        $("#sidebarToggle, #sidebarToggleTop").on('click', () => {
            $("body").toggleClass("sidebar-toggled");
            $(".sidebar").toggleClass("toggled");
            if ($(".sidebar").hasClass("toggled")) {
                $('.sidebar .collapse').collapse('hide');
            }
        });

        $(window).resize(() => {
            if ($(window).width() < 768) {
                $('.sidebar .collapse').collapse('hide');
            }

            if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
                $("body").addClass("sidebar-toggled");
                $(".sidebar").addClass("toggled");
                $('.sidebar .collapse').collapse('hide');
            }
        });
    }
}
</script>

<style scoped>
.nav-item .router-link-exact-active {
    font-weight: bold;
}
</style>
