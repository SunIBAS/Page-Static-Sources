function LayerControl(layer, options = {}) {
    return L.Control.extend({
        onAdd: function (map) {
            const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            container.style.background = '#03A9F4';
            container.style.padding = '6px';
            // container.style.minWidth = '160px';
            container.style.display = 'flex';

            // 复选框
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = map.hasLayer(layer);
            container.appendChild(checkbox);

            const nameDom = document.createElement('div');
            nameDom.innerText = options.name || "_layer_";
            nameDom.style.padding = '0px 2px'
            nameDom.style.margin = '0px 4px'
            nameDom.style.cursor = 'pointer';
            nameDom.style.background = '#78909C';
            nameDom.style.color = 'white';
            nameDom.style.minWidth = '60px';
            nameDom.style.lineHeight = '20px';
            nameDom.style.textAlign = 'center';
            container.appendChild(nameDom);

            // 删除按钮
            const delBtn = document.createElement('button');
            delBtn.innerText = '🗑️';
            delBtn.style.fontSize = '14px';
            delBtn.style.padding = '0px';
            delBtn.style.background = 'unset';
            delBtn.style.border = 'unset';
            delBtn.style.cursor = 'pointer';
            delBtn.style.marginRight = '3px';
            delBtn.title = "删除";
            container.appendChild(delBtn);

            // 编辑按钮
            const exportBtn = document.createElement('button');
            if (options.onExport) {
                exportBtn.innerText = '✍️';
                exportBtn.style.fontSize = '14px';
                exportBtn.style.padding = '0px';
                exportBtn.style.background = 'unset';
                exportBtn.style.border = 'unset';
                exportBtn.style.cursor = 'pointer';
                exportBtn.style.marginRight = '3px';
                exportBtn.title = "查看GeoJSON";
                container.appendChild(exportBtn);
            }
            // 修改按钮
            const editBtn = document.createElement('button');
            if (options.onEdit) {
                editBtn.innerText = '🪡';
                editBtn.style.fontSize = '14px';
                editBtn.style.padding = '0px';
                editBtn.style.background = 'unset';
                editBtn.style.border = 'unset';
                editBtn.style.cursor = 'pointer';
                editBtn.style.marginRight = '3px';
                editBtn.title = "编辑";
                container.appendChild(editBtn);
            }

            nameDom.onclick = function () {
                map.fitBounds(layer.getBounds())
            };

            // 阻止事件冒泡
            L.DomEvent.disableClickPropagation(container);

            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    map.addLayer(layer);
                } else {
                    map.removeLayer(layer);
                }
                options.onToggle?.(e.target.checked, layer);
            });

            delBtn.addEventListener('click', event => {
                map.removeControl(this);  // 移除控件自身
                map.removeLayer(layer);   // 移除图层
                options.onDelete?.(layer, options);
            });

            if (options.onExport) {
                exportBtn.addEventListener('click', event => {
                    options.onExport?.(layer, options);
                });
            }
            if (options.onEdit) {
                editBtn.addEventListener('click', event => {
                    options.onEdit?.(layer, options);
                });
            }

            return container;
        },

        onRemove: function (map) {
            // 清理逻辑（可选）
        }
    });
}