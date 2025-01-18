const registWindowResize = () => {
    window.resizeMethods = [];
    window.resizeTimeoutId = null;
    window.onresize = function () {
        if (window.resizeTimeoutId) {
            clearTimeout(window.resizeTimeoutId);
            window.resizeTimeoutId = null;
        }
        window.resizeTimeoutId = setTimeout(() => {
            clearTimeout(window.resizeTimeoutId);
            window.resizeTimeoutId = 0;
            window.resizeMethods.map(_ => _());
        }, 100);
    }
};

const addResizeListener = (m) => {
    window.resizeMethods.push(m);
}

export {
    registWindowResize,
    addResizeListener,
}
