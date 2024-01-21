import {
    NumberDear,
    buildGroupAction
} from "./utils/Utils";

let DefaultAction = {
    'default'(videoInstance, cache = new Cache()) {
        return [
            {
                group: "重置",
                name: "重置",
                run: false,
                action() {
                    cache.clear();
                }
            },
            {
                group: "全屏自动隐藏",
                name: "全屏自动隐藏",
                run: false,
                action() {
                    // cache.obj.fullScreenToHide = !cache.obj.fullScreenToHide;
                }
            },
            buildGroupAction({
                group: "音量",
                action: [
                    {
                        name: "undo",
                        action() {},
                        run: true,
                    },
                    {
                        name: "默认音量为 10%",
                        action() {
                            let video = videoInstance.getVideo();
                            if (video) {
                                video.volume = 0.1;
                            }
                        },
                        run: false,
                    }
                ]
            })
        ]
    },
    "bilibili.com"(videoInstance) {
        return [
            {
                group: "屏幕操作",
                name: "宽屏",
                run: false,
                action() {
                    clickDomOnce(() => document.getElementsByClassName('bpx-player-ctrl-web-enter'), "bpx-player-ctrl-web-enter");
                }
            },
            {
                group: "屏幕操作",
                name: "全屏",
                run: false,
                action() {
                    clickDomOnce(() => document.getElementsByClassName('bpx-player-ctrl-full'), "bpx-player-ctrl-full");
                }
            },
            {
                group: "屏幕操作",
                name: "undo",
                run: true,
                action() {
                    console.log("undo");
                }
            }
        ]
    },
    'youtube.com'(videoInstance) {
        return [
            {
                group: "屏幕操作",
                name: "宽屏",
                run: false,
                action() {
                    let video = videoInstance.getVideo();
                    if (video.width < window.innerWidth * .8) {
                        clickDomOnce(() => document.getElementsByClassName('ytp-size-button'), "ytp-size-button");
                    }
                }
            },
            {
                group: "屏幕操作",
                name: "全屏",
                run: false,
                action() {
                    clickDomOnce(() => document.getElementsByClassName('ytp-fullscreen-button'), "ytp-fullscreen-button");
                }
            },
            {
                group: "屏幕操作",
                name: "undo",
                run: true,
                action() {
                    console.log("undo");
                }
            },
            {
                name: "记住最后播放时间",
                action(run, cache) {
                    let video = videoInstance.getVideo();
                    let getVid = () => {
                        let vid = (location.search.split('?')[1] || "").split('&').map(_=>_.split('=')).filter(_=>_[0]==='v');
                        if (vid.length === 1) {
                            vid = vid[0][1];
                        }
                        return vid;
                    }
                    let vid = getVid();
                    if (!vid || vid.length < 3) {
                        return;
                    }
                    if (!KeepVideoTimeInstance) {
                        KeepVideoTimeInstance = new KeepVideoTime();
                        if (vid && vid in KeepVideoTimeInstance.obj) {
                            if (video.currentTime < KeepVideoTimeInstance.obj[vid]) {
                                video.currentTime = KeepVideoTimeInstance.obj[vid];
                            }
                        }
                    }
                    if (run) {
                        KeepVideoTimeInstance.keep(getVid, video);
                    } else {
                        KeepVideoTimeInstance.stop();
                    }
                },
                run: true,
                replay: true,
            }
        ]
    }
};
let KeepVideoTimeInstance = null;
class KeepVideoTime {
    constructor(props) {
        this.key = "_video_cache_";
        this.obj = this.get() || {};
        this.id = null;
    }
    set(key, time) {
        this.obj[key] = time;
        this.store();
    }
    store() {
        localStorage.setItem(this.key, JSON.stringify(this.obj));
    }

    get() {
        let data = localStorage.getItem(this.key);
        if (!data) {
            return null;
        }
        try {
            data = JSON.parse(data)
        } catch (e) {
            return null;
        } finally {
            return data;
        }
    }
    keep(getUrlId, video) {
        if (!this.id) {
            this.id = setInterval(() => {
                let vid = getUrlId();
                if (vid) {
                    this.set(vid, video.currentTime);
                }
            }, 500);
        }
    }
    stop() {
        if (this.id) {
            clearInterval(this.id);
            this.id = null;
        }
    }
}

const DefaultCache = {
    toggleKey: "X",
    top: 0,
    left: 0,
    width: 'unset',
    height: 'unset',
    speed: 1,
    Action: {},
    opacity: 1,
    show: true,
    // fullScreenToHide: false,
};

const DefaultCacheCheck = {
    toggleKey(r) {
        r = r.toString();
        if (r.length > 1) {
            return r[0];
        } else if (r.length < 1) {
            return "X";
        } else {
            return r;
        }
    },
    opacity(r) {
        r = NumberDear.toNumberFloat(r);
        return r <= 0 ? 0.1 : (r > 1 ? 1 : r);
    },
    top: NumberDear.toNumberFloat,
    left: NumberDear.toNumberFloat,
    speed(r) {
        return NumberDear.toNumberFloat(r, 1)
    },
}

export {
    DefaultAction,
    KeepVideoTime,
    KeepVideoTimeInstance,
    DefaultCache,
    DefaultCacheCheck,
}