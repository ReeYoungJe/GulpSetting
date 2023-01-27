const {task, dest, src, watch, series,} = require("gulp");
const uglify = require('gulp-uglify')
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso');
const fs = require('fs');
const replace = require('gulp-replace');
const insert = require('gulp-insert');
const csscomb = require('gulp-csscomb');

/**
 * ==============================+
 * 경로
 * ==============================+
 */

const paths = {
    scss: './src/common/scss/**/*.scss',
    scssDist: './src/dist/css/_entry/**/*.css',
    js: './src/common/js/*.js',
    jsDist: './src/dist/js/**/*.js'
};

/**
 * ==============================+
 * @SCSS : SCSS Config(환경설정)
 * ==============================+
 */
const sassFn = (done) => {

    src(paths.scss)
        .pipe(sass.sync({outputStyle: 'expanded'}).on('error', sass.logError)) //sass 컴파일
        //.pipe()
        .pipe(autoprefixer({cascade: true})) //vendor - prefix 달아주기
        //.pipe(csso())
        .pipe(replace('"UTF-8";', '"UTF-8"\n'))
        .pipe(replace('@charset "UTF-8";', ''))
        .pipe(insert.prepend('@charset "UTF-8"; \n'))
        .pipe(replace(/}/g, '}\n'))
        //.pipe(replace('/*!', '\n/*!'))
        .pipe(replace('{.', '{\n\t.'))
        .pipe(sourcemaps.write('./maps')) // 소스맵 뿌려주고
        .pipe(dest('./src/dist/css/')) //css 폴더에 styles 생성
    src(paths.scssDist)
        //.pipe(csso())
        .pipe(replace('@charset "UTF-8";', ''))
        .pipe(concat('common.min.css')) //./src/dist/css/_entry/**/*.css 에 모든 css 파일을  합치기
        .pipe(dest('./src/dist/css/'))
        .pipe(replace('"UTF-8"', '"UTF-8"; \n'))
        .pipe(insert.prepend('@charset "UTF-8"; \n'))
        .on('end', () => {
            console.log('./src/dist/css/common.min.css DIst 배포 완료')
        })

    if (done) {
        done();
    }
}

const jsFn = (done) => {
    src(paths.js)
        .pipe(uglify())
        .pipe(dest('./src/dist/js')); // dist 폴더에 병합한 파일 생성
    if (done) {
        done();
    }

}
const jsDistFn = (done) => {
    src(paths.jsDist)
        .pipe(concat('main.min.js')) // main.js로 파일이름을 짓고 병합
        .pipe(dest('./src/dist/js')); // dist 폴더에 병합한 파일 생성
    if (done) {
        done();
    }
}


task('sass', sassFn);
task('js', jsFn);
task('js:dist', jsDistFn);


task('watch', series('sass', (done) => {
    watch(paths.scss).on('change', (file) => {
        sassFn();
        console.log(file + '변경감지')
    }).on('ready', () => {
        done();
    });
}));


task('event', async (done) => {
    const selectFolder = require('./node_custormModules/selectFolder');
    const eventPageFilter = require('./node_custormModules/eventPageFilter')

    const eventHtml = await selectFolder('./src/resource/html/event/inc');
    const eventFiles = eventPageFilter(eventHtml);

    await fs.writeFileSync('./src/convention/events/eventList.json', JSON.stringify(eventFiles))
    done();
})

