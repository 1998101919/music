

//渲染数据 通过winodw.player来暴露接口

(function ($, root) {
    //渲染信息
    function renderInfo(data) { 
        var str = `
            <div class="song-name">${data.song}</div>
            <div class="singer-name">${data.singer}</div>
            <div class="album-name">${data.album}</div>
        `
        $('.wrapper').find('.song-info').html(str)
    }
    //渲染图片
    function renderImage(src) { 
        var img = new Image()
        img.src = src;
        img.onload = function () {
            root.blurImg(img,$(document.body)) //调用高斯模糊函数 实现背景
            $('.wrapper').find('.img-wrapper img').attr('src',src)
        }
    }
    //是否喜欢
    function renderIsLike(data) {
        if(data){
            $('.wrapper').find('.like-btn').addClass('liking')
        }else{
            $('.wrapper').find('.like-btn').removeClass('liking')
        }
    }

    //暴露接口 渲染数据
    function render(data) {
        renderInfo(data)
        renderImage(data.image)
        renderIsLike(data.isLike)
    }
    root.render = render

}(window.Zepto, window.player || (window.player = {})))
