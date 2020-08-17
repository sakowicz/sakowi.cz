window._ = require('lodash');
try {
    require('bootstrap');
    window.Popper = require('popper.js').default;
    window.$ = window.jQuery = require('jquery');
    require('jquery.easing')(jQuery);
} catch (e) {
}
window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.baseURL = '/admin';
