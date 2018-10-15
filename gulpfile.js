const gulp = require('gulp'); //gulp主文件
const path = require('path'); //node系统模块
const gulpImagemin = require('gulp-imagemin'); //图片压缩模块
const gulpNewer = require('gulp-newer'); //检测图片是否被压缩过
const gulpHtmlclean = require('gulp-htmlclean'); //压缩html代码
const gulpUglify = require('gulp-uglify'); //压缩js代码
const gulpStripDebug = require('gulp-strip-debug'); //删除console debugger语句
const gulpLess = require('gulp-less'); //处理less 转化成css
const gulpPostcss = require('gulp-postcss'); // css预处理器
const autoprefixer = require('autoprefixer'); //自动添加前缀
const cssnano = require('cssnano'); //压缩css代码
const gulpConnect = require('gulp-connect'); //开启本地服务器

var envMode = process.env.NODE_ENV == 'development';
console.log(envMode)
var folder = {
    src : './src/',
    dist : './dist/'
}

gulp.task('images',function () {
    gulp.src(folder.src + 'images/*')
        .pipe(gulpNewer(folder.dist + 'images'))
        .pipe(gulpImagemin())
        .pipe(gulp.dest(folder.dist + 'images'))
})
gulp.task('html',function () {
    var page = gulp.src(folder.src + 'html/*')
                    .pipe(gulpConnect.reload())
        if(!envMode){
            page.pipe(gulpHtmlclean())
        }
        page.pipe(gulp.dest(folder.dist + 'html'))
})
gulp.task('css',function () {
    var plugins = [autoprefixer(),cssnano()],
        page = gulp.src(folder.src + 'css/*')
                   .pipe(gulpConnect.reload())
                   .pipe(gulpLess())
        if(!envMode){
            page.pipe(gulpPostcss(plugins))
        }
        page.pipe(gulp.dest(folder.dist + 'css'))
})
gulp.task('js',function () {
    var page = gulp.src(folder.src + 'js/*')
                   .pipe(gulpConnect.reload())
    if(!envMode){
        page.pipe(gulpStripDebug())
        page.pipe(gulpUglify())
    }    
        page.pipe(gulp.dest(folder.dist + 'js'))
})

gulp.task('mock',function () {
    var page = gulp.src(folder.src + 'mock/*')
                   .pipe(gulpConnect.reload())
        page.pipe(gulp.dest(folder.dist + 'mock'))
})

gulp.task('watch',function () {
    gulp.watch(folder.src + 'html/*',['html'])
    gulp.watch(folder.src + 'css/*',['css'])
    gulp.watch(folder.src + 'js/*',['js'])
    gulp.watch(folder.src + 'images/*',['images'])
    gulp.watch(folder.src + 'mock/*',['mock'])
})

gulp.task('server',function () {
    gulpConnect.server({
        port : 8888,
        livereload:true,
    })
})

gulp.task('default',['images','html','css','js','mock','watch','server'],function (e) {
    console.log('加载完成')
})