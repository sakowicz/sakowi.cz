const initEvent = (name => {
    const event = document.createEvent('Event');
    event.initEvent(name);
    window.dispatchEvent(event);
});
const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);

export default {initEvent, shuffleArray};
