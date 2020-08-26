const url = (url => {
    if (url.startsWith('public/')) {
        return '/storage/' + url.substr(7);
    }
    return '/' + url;
});

export default {url};
