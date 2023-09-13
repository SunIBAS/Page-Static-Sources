window.init_menus = function () {
    let menusDiv = document.getElementById('menus');
    menusDiv.innerHTML = menus.map((_,ind) => {
        return `<li tar="${ind}">
<div>
<span class="chart-icon">${_.icon}</span>
<span class="chart-name">${_.title}</span>
</div>
</li>`;
    }).join('\r\n');
    let lis = new Array(...menusDiv.children);
    lis.forEach(li => {
        li.onclick = function () {
            if (this.classList.contains('selected')) {
                return;
            }
            lis.forEach(li => li.classList.remove('selected'));
            this.classList.add('selected');
            let index = this.getAttribute('tar');
            document.getElementById('echarts').innerHTML = charts[index].map(chart => {
                let img = chart.img.split('?')[0].split('/').reverse()[0];
                return `<div class="card" name="${chart.name}">
<img src="./images/${img}"/>
<span style="text-align: center;white-space: nowrap; /* 防止内容文本换行 */">${chart.text}</span>
</div>`;
            }).join('\r\n');
            document.getElementsByClassName('content')[0].scrollTop = 0;
            new Array(...document.getElementsByClassName('card')).forEach(card => {
                card.onclick = function() {
                    let name = this.getAttribute('name');
                    let code = echart_scripts[name];
                    document.getElementById('ifr').contentWindow.setOption(code);
                    const popup = document.querySelector('.popup');
                    popup.style.display = 'block';
                };
            });
        }
    });
    lis[0].click();
};
window.onload = function() {
    init_menus();
};

function closePopup() {
    const popup = document.querySelector('.popup');
    popup.style.display = 'none';
    document.getElementById('ifr').contentWindow.setOption('{}');
}