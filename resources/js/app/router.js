import VueRouter from 'vue-router';
import Home from './components/home/Home';
import Contact from './components/contact/Contact';
import Photography from './components/photography/Photography';
import PageNotFound from './components/PageNotFound';
import Vue from 'vue';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/', name: 'home', component: Home},
        {path: '/contact', name: 'contact', component: Contact},
        {path: '/photography', name: 'photography', component: Photography},
        {path: '*', name: 'page-not-found', component: PageNotFound}
    ]
});

export default router;
