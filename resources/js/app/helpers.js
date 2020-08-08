const initEvent = function initEvent(name) {
    const event = document.createEvent('Event');
    event.initEvent(name);
    window.dispatchEvent(event);
};

export default {initEvent};
