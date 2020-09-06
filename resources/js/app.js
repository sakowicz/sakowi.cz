require('./app/_bootstrap');

import Vue from 'vue';
import router from './app/router';
import methods from './_helpers';

const files = require.context('./app', true, /\.vue$/i);
files.keys()
    .map(key => Vue.component(key.split('/')
        .pop()
        .split('.')[0], files(key).default));

Vue.mixin({methods});

const app = new Vue({
    el: '#main',
    router
});
