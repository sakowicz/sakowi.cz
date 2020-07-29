import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './components/Home';
import Contact from './components/Contact';
import Photography from './components/Photography';
import PageNotFound from './components/PageNotFound';

require('./bootstrap');

Vue.use(VueRouter);

const files = require.context('./', true, /\.vue$/i);
files.keys()
    .map(key => Vue.component(key.split('/')
        .pop()
        .split('.')[0], files(key).default));

const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/', name: 'home', component: Home},
        {path: '/contact', name: 'contact', component: Contact},
        {path: '/photography', name: 'photography', component: Photography},
        {path: '*', name: 'page-not-found', component: PageNotFound}
    ]
});

const app = new Vue({
    el: '#main',
    router
});
