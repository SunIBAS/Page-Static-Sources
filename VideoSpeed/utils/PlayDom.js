import {
    DraggableDom
} from "./DraggableDom";

export class PlayDom {
    constructor(video, videoInstance, actions = [], cache = new Cache()) {
        this.video = video;
        this.cache = cache;
        this.draggableDom = new DraggableDom(this.cache, videoInstance.getParentDomMethod());
        this.action = {};
        this.videoInstance = videoInstance;
        this.loopActionRun = false;

        let ret = this.buildAction(actions);

        this.createDom(ret.actionListForDom);
        ret.promise().then(() => {
            this.loopAction();
        });
    }
    addListen() {
        let $this = this;
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        let video = null;

        function handleFullscreenChange() {
            if (!video) {
                video = $this.videoInstance.getVideo();
            }
            if (!document.fullscreenElement) {
                if ($this.cache.obj.Action['全屏自动隐藏'] === '全屏自动隐藏') {
                    $this.draggableDom.toggleShow(true);
                }
                return;
            }
            let isVideoFullscreen = false;
            if (video === document.fullscreenElement) {
                isVideoFullscreen = true;
            } else {
                isVideoFullscreen = !!new Array(...document.fullscreenElement.getElementsByTagName($this.videoInstance.baseDom)).filter(v => v=== video).length;
                if (isVideoFullscreen) {
                    video = document.fullscreenElement;
                }
            }
            if ($this.cache.obj.Action['全屏自动隐藏'] === '全屏自动隐藏') {
                $this.draggableDom.toggleShow(false);
            }
        }
    }
    loopAction() {
        if (this.loopActionRun) return;
        this.loopActionRun = true;
        this.addListen();
        let fn = () => {
            let v = this.videoInstance.getVideo();

            let update = false;
            let windowWidth = window.innerWidth;
            let windowHeight = window.innerHeight;
            if (windowWidth < this.cache.obj.left) {
                this.cache.obj.left = windowWidth - (this.draggableDom.size.width || windowWidth);
                update = true;
            }
            if (windowHeight < this.cache.obj.top) {
                this.cache.obj.top = windowHeight - (this.draggableDom.size.height || windowHeight);
                update = true;
            }

            v.playbackRate = this.cache.obj.speed;
            if (update) {
                this.draggableDom.dom.style.left = `${this.cache.obj.left}px`;
                this.draggableDom.dom.style.top = `${this.cache.obj.top}px`;
            }

            this.videoInstance.LoopAction();
        }
        fn();
        setInterval(() => {
            fn();
        },500);
    }

    buildAction(actions) {
        let cacheAction = this.cache.obj.Action;
        let actionList = [];
        let actionListForDom = {};
        let actionListForDom_ = [];
        actions.forEach(act => {
            this.action[act.name] = {
                action:()=>{},
                replay: false,
            }
            // act = { name: "", action() {}, group: "", run: false }
            if (!act.group) {
                act.group = act.name;
            }
            if (!(act.group in actionListForDom)) {
                actionListForDom[act.group] = [];
            }
            if (!(act.group in cacheAction)) {
                cacheAction[act.group] = "";
            } else if (cacheAction[act.group] === "") {
                cacheAction[act.group] = "none_" + new Date().getTime();
            }
            if (act.name === cacheAction[act.group]) {
                // 该主当前希望运行改方法
                actionList.push(act.action);
                cacheAction[act.group] = act.name;
                act.run = true;
                if (act.replay) {
                    this.action[act.name] = {
                        action: act.action,
                        replay: act.replay,
                    };
                }
            } else {
                if (act.run) {
                    if (cacheAction[act.group] === "") {
                        cacheAction[act.group] = act.name;
                        actionList.push(act.action);
                        if (act.replay) {
                            this.action[act.name] = {
                                action: act.action,
                                replay: act.replay,
                            };
                        }
                    } else {
                        act.run = false;
                        this.action[act.name] = {
                            action: act.action,
                            replay: false,
                        };
                    }
                } else {
                    this.action[act.name] = {
                        action: act.action,
                        replay: false,
                    };
                }
            }
            if (!act.replay) {
                this.action[act.name].replay = true;
            }
            actionListForDom[act.group].push({
                name: act.name,
                run: act.run
            });
        });
        for (let i in actionListForDom) {
            actionListForDom_.push({
                group: i,
                actions: actionListForDom[i]
            });
        }
        this.cache.obj.Action = Object.assign(this.cache.obj.Action, cacheAction);
        this.cache.store();
        return {
            promise: (function (actionLis, cache) {
                return new Promise(s => s()).then(() => {
                    actionList.forEach(act => act(true, cache));
                    return true;
                });
            }).bind(null,actionList,this.cache.obj),
            actionListForDom: actionListForDom_
        };
    }
    createDom(actionListForDom) {
        let styleDom = document.createElement('style');
        styleDom.innerHTML = `.play_dom_box {
        display: flex;
        padding: 5px;
    }
    .play_dom_btn {
        background: gainsboro;
        padding: 2px;
        margin-bottom: 2px;
        border-radius: 4px;
        width: 40px;
        text-align: center;
        cursor: pointer;
    }
    .play_dom_text {
        flex: 1;
        line-height: 80px;
        text-align: center;
    }`;
        let boxDom = document.createElement('div');
        boxDom.innerHTML = `
<div class="play_dom_box">
    <div>
        <div class="play_dom_btn play_dom_btn_speed" tag="speed">-0.1</div>
        <div class="play_dom_btn play_dom_btn_speed" tag="speed">-0.2</div>
        <div class="play_dom_btn play_dom_btn_speed" tag="speed">-0.5</div>
    </div>
    <div class="play_dom_text play_dom_text_speed">${this.cache.obj.speed}</div>
    <div>
        <div class="play_dom_btn play_dom_btn_speed" tag="speed">+0.1</div>
        <div class="play_dom_btn play_dom_btn_speed" tag="speed">+0.2</div>
        <div class="play_dom_btn play_dom_btn_speed" tag="speed">+0.5</div>
    </div>
</div>
<div style="display: flex;">透明 【<div class="play_dom_text_opacity">${this.cache.obj.opacity}</div>】 <div class="play_dom_btn play_dom_btn_opacity" tag="speed">-0.1</div>
&nbsp;&nbsp;&nbsp;<div class="play_dom_btn play_dom_btn_opacity" tag="speed">+0.1</div></div>
<div>
${actionListForDom.map(act => {
            // {
            //      group: "",
            //      actions: [{name: '', run: ''}]
            // }
            if (act.actions.length > 1) {
                let dom = act.actions.map(a => {
                    return `<input type="radio" tag="${a.name}" name="${act.group}" ${a.run ? 'checked' : ''} class="play_dom_check"/> ${a.name}`;
                }).join('');
                return `<div>${act.group} | ${dom}</div>`
            } else {
                let acti = act.actions[0];
                return `<div>${acti.name} <input tag="${acti.name}" type="checkbox" name="${act.group}" ${acti.run ? 'checked' : ''} class="play_dom_check"/></div>`
            }
        }).join(' ')}
</div>`;
        let dom = this.draggableDom.getDom();
        dom.append(styleDom);
        dom.append(boxDom);
        let $this = this;
        let speedTextDom = boxDom.getElementsByClassName('play_dom_text_speed')[0];
        let opacityTextDom = boxDom.getElementsByClassName('play_dom_text_opacity')[0];

        new Array(...boxDom.getElementsByClassName('play_dom_btn_opacity')).forEach(btn => {
            btn.onclick = function () {
                let sp = +this.innerText;
                $this.cache.set('opacity', (+$this.cache.obj.opacity + sp).toFixed(1));
                opacityTextDom.innerText = $this.cache.obj.opacity;
                $this.draggableDom.dom.style.opacity = $this.cache.obj.opacity;
            };
        });
        new Array(...boxDom.getElementsByClassName('play_dom_btn_speed')).forEach(btn => {
            btn.onclick = function () {
                let sp = +this.innerText;
                $this.cache.set('speed', (+$this.cache.obj.speed + sp).toFixed(2));
                speedTextDom.innerText = $this.cache.obj.speed;
                // $this.video.playbackRate = $this.cache.obj.speed;
            };
        });
        new Array(...boxDom.getElementsByClassName('play_dom_check')).forEach(btn => {
            btn.onchange = function () {
                let group = this.getAttribute('name');
                let actionName = this.getAttribute('tag');
                let currentAction = $this.action[actionName];
                if (this.checked) {
                    $this.cache.obj.Action[group] = actionName;
                    if (currentAction.replay) {
                        currentAction.action(true, $this.cache.obj);
                    } else {
                        currentAction.action(true, $this.cache.obj);
                        $this.action[actionName].action = () => {};
                    }
                } else {
                    $this.cache.obj.Action[group] = "";
                    if (currentAction.replay) {
                        currentAction.action(false, $this.cache.obj);
                    }
                }
                $this.cache.store();
            };
        });
    }
}