(function ($, root) {
    var control = 0; //用来标记索引位置
    //创建主体结构
    var $playList = $(`<div class="play-list"> 
                    <div class="play-header">播放列表</div>
                    <ul class="list-wrapper"></ul>
                    <div class="close-btn">关闭</div>
                  </div>`)

    //渲染结构部分
    function addDom(data) {
        var str = '';
        data.forEach(function (ele,index) {
             str += `<li>
                <h3>
                ${ele.song}--
                    <span>${ele.singer}</span>
                </h3>
            </li>`
        })
        $playList.find('ul').html(str)
        $(document.body).append($playList)
        bindEvent(data)
    }

    function show() { //点击菜单 显示结构
        $playList.addClass('show')
        toggleClass(control)
    }

    function bindEvent(data) {
        $playList.find('.close-btn').on('click',function () { //点击关闭 隐藏结构
            $playList.removeClass('show')
        })
        $playList.find('li').on('click',function () {
            var index = $(this).index();
            control = index //每次点击li 将索引重新赋值
            $('.wrapper').trigger('play:change',[index,true]) //触发预加载音频事件
            $('.wrapper').find('.play-btn').addClass('playing') //切换图标
            setTimeout(function () {
                $playList.removeClass('show') //移除菜单结构
            },300)
        })
    }

    function toggleClass(index) { //切换点击的索引添加类名
        $playList.find('.sign').removeClass('sign')
        $playList.find('ul li').eq(index).addClass('sign')
    }

    root.showList = {
        show, //点击菜单展示组件
        addDom, //渲染结构部分
    }

})(window.Zepto, window.player || (window.player = {}))



