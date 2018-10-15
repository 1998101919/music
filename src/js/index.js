var $ = window.Zepto, //暴露$
    root = window.player, //render函数暴露的接口 通过变量接收
    index = 0, //默认的索引,用来处理前进后退的按钮
    len; //记录数组的长度,判断点击是否超过边界
    // console.log(index)
var audio = new root.AudioControl() //获取audio模块的构造函数

//点击事件
function bindEvent(data) {
    //提前加载资源,只能写在这里,因为如果写在click事件中,每重新点击就会重新播放音频
    $(document.body).on('play:change', function (e, index,flag) {
        audio.getAudio(data[index].audio) //页面加载歌曲预加载
        //----------------------------------------------
        //当歌曲切换可以依旧播放歌曲,避免重新点击
        if (audio.state == 'play' || flag) {
            audio.play()
            root.process.start() //开始播放歌曲
        } 

        root.process.getTime(data[index].duration) //页面加载渲染歌曲总时间
        root.render(data[index]) //重新渲染页面
        root.process.update(0) //每次切换都让歌曲0开始
    })
    //点击上一首按钮
    $('.wrapper').on('click', '.prev-btn', function () {
        if (index === 0) { //当歌曲到第一首,将索引变成最后一首,从而循环切换
            index = len - 1;
        } else { //正常切换
            index--;
        }
  
        $(document.body).trigger('play:change', index) //触发预加载音频事件
        root.render(data[index]) //重新渲染页面
    })
    //点击下一首按钮
    $('.wrapper').on('click', '.next-btn', function () {
        if (index === len - 1) {//当歌曲到最后一首,将索引变成0,从而循环切换
            index = 0;
        } else {//正常切换
            index++;
        }

        $(document.body).trigger('play:change', index) //触发预加载音频事件
        root.render(data[index])//重新渲染页面
    })

    //点击开始按钮播放和暂停
    $('.wrapper').on('click', '.play-btn', function () {
        if (audio.state == 'play') {
            audio.pause()//暂停播放歌曲
            root.process.stop() //暂停滚动条部分歌曲
        } else {
            root.process.start() //开始滚动条部分歌曲
            audio.play()//开始播放歌曲
        }
        $(this).toggleClass('playing') //切换图标
    })
    var key = true;
    //点击菜单按钮,显示按钮
    $('.wrapper').on('click','.list-btn',function () {
         root.showList.show()
    })
}

//点击拖动滚动条部分
function bindTouch(data) {
    var offset = $('.wrapper').find('.pro-bottom').offset(),
        left = offset.left, //计算滚动条离左边的距离
        width = offset.width; //计算滚动条的宽度

    $('.wrapper').find('.slider-point').on('touchstart',function () {
        root.process.stop() //拖拽过程不播放音频
    }).on('touchmove',function (e) {
        var disX = e.changedTouches[0].clientX, //获取离左边的距离
        pre = (disX - left) / width; // 通过算法计算出百分比 当前位置减去离左边的距离除以总长度

        if(pre > 0 && pre < 1){ //当在0-1之前才进行更新滚动条
            root.process.update(pre)
        }

    }).on('touchend',function (e) {
        var disX = e.changedTouches[0].clientX, //获取离左边的距离
        pre = (disX - left) / width; // 通过算法计算出百分比 当前位置减去离左边的距离除以总长度
        if(pre > 0 && pre < 1){ //当在0-1之前才进行更新滚动条
            var currentTime = pre * data[index].duration;
            audio.playTo(currentTime) //跳转到拖拽的位置
            $('.wrapper').find('.play-btn').addClass('playing') //切换图标
            root.process.start(pre) //点击完暂停 重新开始 将拖拽位置的百分比传入
        }
    })
}


// 获取数据
function getData() {
    $.ajax({
        type: 'GET',
        url: '../mock/data.json',
        success: function (data) {
            bindEvent(data) //执行点击事件
            bindTouch(data) //执行拖拽进度条
            root.showList.addDom(data)
            len = data.length; //获取数据长度
            root.render(data[0]) //渲染第一个页面 
 // ---------------------------------------------------------
             //当请求到数据，进行trigger里面操作
            $(document.body).trigger('play:change', 0)
        },
        error: function () {
            console.log('error')
        }
    })
}

getData()


