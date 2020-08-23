require('./admin/_bootstrap');
require('datatables.net');
require('datatables.net-bs4');
window.toastr = require('toastr');

import Vue from 'vue';
import router from './admin/router';

const files = require.context('./admin', true, /\.vue$/i);
files.keys()
    .map(key => Vue.component(key.split('/')
        .pop()
        .split('.')[0], files(key).default));

const app = new Vue({
    el: '#app',
    router
});
