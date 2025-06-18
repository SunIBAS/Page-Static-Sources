L.Control.CustomButtons = L.Control.extend({
    options: {
        position: "bottomleft", // 位置
        id: `cb_${new Date().getTime()}`,
        btns: [
            {
                text: "btn1",
                action: function () {}
            }
        ],
        // button1Text: "Button 1",
        // button2Text: "Button 2",
        // button3Text: "Button 3",
        // button1Click: function () {}, // 默认空函数
        // button2Click: function () {},
        // button3Click: function () {},
    },

    onAdd: function (map) {
        let container = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-custom-buttons");
        container.id = this.options.id;

        this.options.btns.forEach(btn => {
            let dom = L.DomUtil.create("a", "leaflet-bar-part", container);
            dom.innerHTML = btn.text;
            dom.href = "#";
            dom.style.width = "auto"
            dom.style.padding = "0 5px"

            // 绑定点击事件
            L.DomEvent.on(dom, "click", ((action) => {
                return function (e) {
                    L.DomEvent.stopPropagation(e);
                    L.DomEvent.preventDefault(e);
                    action();
                }
            })(btn.action));
        })
        return container;
    }
});

// 注册控件到 Leaflet
L.control.customButtons = function (opts) {
    return new L.Control.CustomButtons(opts);
};

