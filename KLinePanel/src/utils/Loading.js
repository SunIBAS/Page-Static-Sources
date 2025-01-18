const loadingDomId = "loading_dom_id_001";

function createLoadingDom() {
    if (document.getElementById(loadingDomId)) {
        return;
    }
    const dom = document.createElement("div");
    dom.style.position = "absolute";
    dom.style.width = "100%";
    dom.style.height = "100%";
    dom.style.display = "none";
    dom.style.background = "#ff9a2357";
    document.body.appendChild(dom);
    dom.id = loadingDomId;
    window[loadingDomId] = dom;
};

function showLoading() {
    createLoadingDom();
    window[loadingDomId].style.display = "unset";
}

function hideLoading() {
    createLoadingDom();
    window[loadingDomId].style.display = "none";
}

export {
    createLoadingDom,
    showLoading,
    hideLoading
}
