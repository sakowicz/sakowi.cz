import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from './components/Dashboard/Dashboard';
import Photo from './components/Photo/Photo';
import PageNotFound from "../app/components/PageNotFound";

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    base: '/admin',
    routes: [
        {path: '/', name: 'dashboard', component: Dashboard},
        {path: '/photo', name: 'photo', component: Photo},
        {path: '*', name: 'page-not-found', component: PageNotFound}
    ]
});

export default router;
