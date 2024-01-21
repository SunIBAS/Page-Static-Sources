const getVideoMethod = {
    default() {
        let videos = document.getElementsByTagName('video');
        let video = false;
        if (videos.length) {
            if (videos.length === 1) {
                video = videos[0];
            } else {
                let ww = parseInt(window.innerWidth * 0.4);
                let v = videos.filter(v => v.width > ww);
                if (v.length) {
                    video = v[0];
                }
            }
        }
        return video;
    },
    'youtube.com'() {
        let videos = document.getElementsByTagName('video');
        return videos.length ? videos[0] : false;
    },
    'bilibili.com'() {
        let bwpVideos = document.getElementsByTagName('bwp-video');
        let trVideos = document.getElementsByTagName('video');
        return bwpVideos.length ? bwpVideos[0] : (trVideos.length ? trVideos[0] : false);
    },
};
const getParentDomMethod = {
    'bilibili.com'() {
        let dom = document.getElementsByClassName('bpx-player-video-area');
        if (dom.length) {
            return dom[0];
        }
        window.loopActionBili = true;
        return document.body;
    }
};
const LoopAction = {
    'bilibili.com'() {
        if (!window.loopActionBili) {
            window.loopActionBili = setInterval(() => {
                new Array(...document.getElementsByClassName('fixed-header')).forEach(ele => ele.style.zIndex = 1);
            }, 500);
        }
    }
};
const RetryTime = {
    'default': {
        time: 60,
        sleepTime: 1000,
    },
    'youtube.com': {
        time: 1e5,
        sleepTime: 3000,
    },
}

export class Video {
    constructor() {
        this.baseDom = null;
        this.host =null;
        this.getVideoMethod = () => false;
        this.getParentDomMethod = () => document.body;
        this.LoopAction = () => {};
    }
    getVideo() {
        return this.getVideoMethod();
    }
    init() {
        return new Promise(s => {
            setTimeout(() => {
                this.host = location.hostname.split('.').reverse().slice(0, 2).reverse().join('.');
                let rt = this.host in RetryTime ? RetryTime[this.host] : RetryTime['default'];
                if (this.host in getVideoMethod) {
                    this.getVideoMethod = getVideoMethod[this.host];
                }
                if (this.host in getParentDomMethod) {
                    this.getParentDomMethod = getParentDomMethod[this.host];
                }
                if (this.host in LoopAction) {
                    this.LoopAction = LoopAction[this.host];
                }
                // 尝试推荐方法2次后使用默认方法不断尝试，超过一分钟后停止所有尝试
                let times = 2;
                let nexter = () => {
                    this.getVideoMethod = getVideoMethod["default"];
                    times = rt.time;
                    let id = setInterval(() => {
                        let video = this.getVideoMethod();
                        if (video) {
                            clearInterval(id);
                            this.baseDom = video.tagName;
                            s();
                        } else {
                            times--;
                            if (!times) {
                                clearInterval(id);
                                console.log("放弃，没有希望了");
                            }
                        }
                    }, rt.sleepTime);
                };

                let id = setInterval(() => {
                    let video = this.getVideoMethod();
                    if (video) {
                        clearInterval(id);
                        this.baseDom = video.tagName;
                        s();
                    } else {
                        times--;
                        if (!times) {
                            clearInterval(id);
                            nexter();
                        }
                    }
                }, 500);
            }, 1000);
        })
    }
    getParentDom() {
        return this.getParentDomMethod();
    }
}

export {
    getParentDomMethod,
    getVideoMethod,
    LoopAction,
    RetryTime
}