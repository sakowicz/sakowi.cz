export default {
    storageUrl: (url => {
        if (url.startsWith('public/')) {
            return '/' + url.substr(7);
        }
        return url;
    }),
    initEvent: (name => {
        const event = document.createEvent('Event');
        event.initEvent(name);
        window.dispatchEvent(event);
    }),
    shuffleArray: arr => arr.sort(() => Math.random() - 0.5)
};
