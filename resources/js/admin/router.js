import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from './components/Dashboard/Dashboard';
import Photo from './components/Photo/Photo';
import PhotoCreate from './components/Photo/PhotoCreate';
import PhotoEdit from './components/Photo/PhotoEdit';
import PageNotFound from "./components/PageNotFound";

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    base: '/admin',
    routes: [
        {path: '/', name: 'dashboard', component: Dashboard},
        {path: '/photo', name: 'photo', component: Photo},
        {path: '/photo/create', name: 'photo-create', component: PhotoCreate},
        {path: '/photo/edit/:id', name: 'photo-edit', component: PhotoEdit, props: true},
        {path: '*', name: 'page-not-found', component: PageNotFound}
    ]
});

export default router;
