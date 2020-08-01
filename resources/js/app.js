require('./_bootstrap');

import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './app/components/home/Home';
import Contact from './app/components/contact/Contact';
import Photography from './app/components/photography/Photography';
import PageNotFound from './app/components/PageNotFound';

Vue.use(VueRouter);

const files = require.context('./app', true, /\.vue$/i);
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


Vue.mixin({
    methods: {
        initEvent(name) {
            const event = document.createEvent('Event');
            event.initEvent(name);
            window.dispatchEvent(event);
        },
    }
})

const app = new Vue({
    el: '#main',
    router
});
