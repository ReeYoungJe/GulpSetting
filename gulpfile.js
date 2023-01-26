const {task, dest, src, watch, series} = require("gulp");
const uglify = require('gulp-uglify')
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso')
const fs = require('fs')
/**
 * ==============================+
 * 경로
 * ==============================+
 */

const group = './src';
const dist = './dist';
const paths = {
    html : './**/*.html',
    scss : group + '/**/*.scss',
    dist : group + '/dist/css/_entry/*.css',
    js : group + '/js/**/*.js',
};

const pageArr = [
    paths.dist,
]

/**
* ==============================+
* @SCSS : SCSS Config(환경설정)
* ==============================+
*/
const scssOptions = {
    /**
     * CSS의 컴파일 결과 코드스타일 지정
     * Values : nested, expanded, compact, compressed
     *
     * sourceComments (Type : Boolean , Default : false)
     * 컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시.
     */
    outputStyle : "compressed",
    sourceComments: true

};

/**
 * 추가 해야될것
 *  csso
 *  csscomb
 *
 */

const sassFn = (done) =>{

    src(paths.scss)
        .pipe(sourcemaps.init({loadMaps: true})) //소스 Map 생성
        .pipe(sass({outputStyle: 'expanded',sourceComments:  true}).on('error', sass.logError)) //sass 컴파일
        .pipe(autoprefixer({cascade: true})) //vendor - prefix 달아주기
        .pipe(csso())
        .pipe(sourcemaps.write('./maps')) // 소스맵 뿌려주고
        .pipe(dest(group + '/dist/css/')) //css 폴더에 styles 생성
    src(paths.dist)
        .pipe(concat('style.min.css'))
        .pipe(dest(group + '/dist/css/')) //css 폴더에 styles 생성

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



task('event',async (done)=>{
    const selectFolder = require('./node_custormModules/selectFolder');
    const eventPageFilter = require('./node_custormModules/eventPageFilter')

    const eventHtml = await selectFolder('./src/resource/event/inc');
    const eventFiles = eventPageFilter(eventHtml);

    await fs.writeFileSync('./src/convention/worklist/eventlist.json',JSON.stringify(eventFiles))
    done();
})

