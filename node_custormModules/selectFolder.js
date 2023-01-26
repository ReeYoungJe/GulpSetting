const fs = require('fs');

let pages = [];
module.exports = (rootPath = './')=>{
   // console.log(rootPath);
    pages = [];
    return new Promise( (resolve, reject)=>{
        selectfile(rootPath);
        setTimeout(
            ()=>{
                resolve(pages)
            },2000
        );
    })
}
function selectfile(path){
    const fileList = fs.readdirSync(path);
    //console.log(fileList);

    fileList.forEach((file)=>{
        if (file.indexOf('_') == 0 ){
            return
        }
        if ((/\./gi).test(file)){
            pages.push(path + '/' + file)
        }else {
            selectfile(path + '/' + file)
        }
    })
}
