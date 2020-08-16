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
const path = require('path');

const routeName = document.head.querySelector('meta[name="route-name"]').content;
window.Route = (route, callback) => {
    if (route === routeName) {
        callback(route);
    }
};

const requireAll = require.context('../admin', true, /.js$/);
requireAll.keys()
    .forEach((key) => {
        const dir = `admin.${path.normalize(key)
            .replace('.js', '')
            .split(path.sep)
            .join('.')}`;

        if (path.basename(key)
            .indexOf('_') !== 0) {
            requireAll(key)(dir);
        }
    });
