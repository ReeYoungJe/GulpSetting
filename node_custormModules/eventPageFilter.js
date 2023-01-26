
//파일 json 추출
const fs = require('fs');
module.exports = (filelist) =>{
    let pages = []
    let DATA = {
        title:'', //  주석 에있는 첫줄
        fileName:'', //파일 이름
        path:'', //실제파일경로
        url:'', //파일 경로
    };
    filelist.forEach((path,idx)=>{
        if(path.indexOf('bk') > - 1){ //bk 이라는게 존재한다면  -1보다 큼  존재하지 않으면 -1 같거나 작음
            return false //  존재한다면  리턴
        }
        const fileLang = fs.readFileSync(path,'utf8'); //비동기
        const title = fileLang.match(/(<!--) (.*d?) (-->)/); // <!-- 여기 안애있는 내용 -->
        const fileName = path.split('/').reverse()[0].split('.')[0];
       if (title){
           DATA = {
               title:title[0].replace("<!--","").replace('-->',""),
               fileName:fileName,
               path: path,
               url:'',
           }
           pages.push(DATA);
       }
    })
    return pages;
}
