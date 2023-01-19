const {task, dest, src, watch, series} = require("gulp");
const uglify = require('gulp-uglify')
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));

/**
 * ==============================+
 * 경로
 * ==============================+
 */

const group = './src';
const dist = './dist';
const paths = {
    html : './**/*.html',
    scss : group + '/_entry/*.scss',
    scss2 : group + '/_uikit/*.scss',
    js : group + '/js/**/*.js',
};

/**
 * 추가 해야될것
 *  csso
 *  csscomb
 *
 */

const sassFn = (done) =>{

    src(paths.scss,paths.scss2)
        .pipe(sourcemaps.init()) //소스 Map 생성
        .pipe(sass.sync().on('error', sass.logError)) //sass 컴파일
        .pipe(autoprefixer()) //vendor - prefix 달아주기
        .pipe(sourcemaps.write('./maps')) // 소스맵 뿌려주고
        .pipe(dest(group + '/dist/css/')); //css 폴더에 styles 생성
    if(done){
        done();
    }
}
task('sass', sassFn);


task('watch',series('sass',(done)=>{
    watch(paths.scss).on('change',(file)=>{
        sassFn();
        console.log(file+'변경감지')
    }).on('ready',()=>{
        done();
    });
}));



