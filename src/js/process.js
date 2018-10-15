//获取音乐时间
(function ($, root) {
    var durationAll, //总时间
        reqTimer, //requestAnimationFrame的标识
        lastPercent = 0, //记录上一次结束的时间
        firstTime; //记录开始的时间

    //处理时间 处理成04:12这种
    function dealTime(timer) {
         timer = Math.round(timer) //每次将传进来的数取整

        var minute = Math.floor(timer / 60), //处理分钟
            seconds = timer - minute * 60; //处理秒钟

        if (minute < 10) { //如果分钟小于十，前面加一个0 如 04:10
            minute = '0' + minute;
        }
        if (seconds < 10) { //如果秒钟小于十，前面加一个0 如 04:01
            seconds = '0' + seconds;
        }

        return minute + ':' + seconds;  //返回到外部
    }
    //执行更新时间和滚动条变化的函数
    function update(precent) {
        //因为每首歌曲的时间不同,需要通过上面precent算出的百分比来计算出当前时间的位置，获取新的时间
        var timer = precent * durationAll;
        timer = dealTime(timer) //接收dealTime函数处理的值 如 04:13
        $('.wrapper').find('.cur-time').html(timer) //将数据插入到结构中
        var moveWidht = (precent - 1) * 100 + '%' //通过算法计算出移动所占的百分比
        $('.wrapper').find('.pro-top').css({
            transform: `translateX(${moveWidht})` //将百分比赋值给translateX
        })
    }
    //获取时间
    function getTime(time) {
        lastPercent = 0; //为了使进行切换 lastPercent置为0
        durationAll = time; //将总时间暴露到外部
        var data = dealTime(time) //接收dealTime函数处理的值 如 04:13
        $('.wrapper').find('.all-time').html(data)
    }

    //点击开始按钮执行的
    function start(data) {
        //判断data是否有值 有值的话就用 没有就用lastPercent 然后赋值给lastPercent
        // lastPercent = data ? data : lastPercent;
        lastPercent = data === undefined ? lastPercent : data;
        cancelAnimationFrame(frame);
        firstTime = new Date().getTime(); //获取开始时间
        function frame() {
            var curTime = new Date().getTime(); //获取当前的时间
            var precent = lastPercent + (curTime - firstTime) / (durationAll * 1000) //通过计算，将数转换成毫秒
            if (precent < 1) {
                reqTimer = requestAnimationFrame(frame) //执行定时器
                update(precent) //执行更新时间和滚动条变化的函数
            } else {
                cancelAnimationFrame(frame); //如果不在歌曲就不播放 然后跳到下一首
                $('.wrapper').find(".next-btn").trigger("click");
            }
        }
        frame()
    }
    //点击暂停
    function stop() {
        var stopTimer = new Date().getTime();
        //每次点击暂停,记录上一次停止的位置,然后在赋给本身
        lastPercent = lastPercent + (stopTimer - firstTime) / (durationAll * 1000);
        cancelAnimationFrame(reqTimer);
    }

    //对外暴露接口
    root.process = {
        getTime,
        start,
        stop,
        update,
    }

})(window.Zepto, window.player || (window.player = {}))








