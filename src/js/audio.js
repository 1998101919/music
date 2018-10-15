


(function ($,root) {
    function AudioControl() {
        this.audio = new Audio();
        this.state = 'pause';
    }
    AudioControl.prototype = {
        play : function () { //播放音频
            this.audio.play();
            this.state = 'play'
        },
        pause : function () { //暂停音频
            this.audio.pause();
            this.state = 'pause'
        },
        getAudio : function (src) { //获得音频
            this.audio.src = src;
            this.audio.load();
        },
        playTo : function (timer) { //跳转到拖拽区域
            this.audio.currentTime = timer;
            this.play()
        }
    }

    root.AudioControl = AudioControl;
})(window.Zepto, window.player || (window.player = {}))