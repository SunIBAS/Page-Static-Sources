// ==UserScript==
// @name         video speed
// @namespace    http://tampermonkey.net/
// @version      20240114.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484447/video%20speed.user.js
// @updateURL https://update.greasyfork.org/scripts/484447/video%20speed.meta.js
// ==/UserScript==

import {
    Video
} from "./utils/Video";
import {
    Cache
} from "./utils/Cache";
import {
    PlayDom
} from "./utils/PlayDom";
import {
    DefaultAction,
    DefaultCache,
    DefaultCacheCheck,
} from './DefaultSetting'
import{
    checkWindow
} from "./utils/Utils";

(function() {
    'use strict';
    // window.customElements.defineOld = window.customElements.define;
    // window.customElements.define = function (name, clz) {
    //     clz.prototype.attachShadowOld = clz.prototype.attachShadow;
    //     clz.prototype.attachShadow = function (obj) {
    //         return this.attachShadowOld({...obj||{},mode: 'open'})
    //     }
    //     return window.customElements.defineOld(name, clz);
    // }
    if (checkWindow()) {
        let video = new Video();
        video.init().then(() => {
            let v = video.getVideo();
            let cache = new Cache(DefaultCache, DefaultCacheCheck);
            if (v) {
                console.log("play dom");
                window.playDom = new PlayDom(v, video, [
                    ...((DefaultAction[video.host] || (() => []))(video, cache)),
                    ...DefaultAction['default'](video, cache),
                ],cache);
            }
        });
    }
    // Your code here...
})();