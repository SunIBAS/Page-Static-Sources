window.init_toggle_button = function () {
    const toggleSidebarButton = document.getElementById('toggleSidebar');
    const container = document.querySelector('.sidebar');

    toggleSidebarButton.addEventListener('click', () => {
        container.classList.toggle('open');
        setTimeout(() => {
            window.ifr.contentWindow.ec.resize();
        },500);
    });
}

window.onload = function () {
    window.ifr = window.document.getElementById('ec_iframe');
    init_toggle_button();
    document.getElementById('draw').onclick = function () {
        window.setOption(document.getElementById('text').value);
    };
    // init_ec_dom();
};

window.setOption = function(text) {
    // let ifr = window.document.getElementById('ec_iframe');
    window.ifr.contentWindow.location.reload();
    let id = setInterval(function () {
        if (window.ifr.contentWindow.setOption) {
            document.getElementById('text').value = text;
            window.ifr.contentWindow.setOption(text);
            clearInterval(id);
        }
    }, 500);
};