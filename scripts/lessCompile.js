
const fs = require('fs');
const path = require('path');
//const less = require('less')
const exec = require('child_process').exec;
function convertExt(fpath) {
  return fpath.replace(/(.css|.less)$/, '.acss')
}
/*
function writeFile(fpath) {
  let content = fs.readFileSync(fpath, 'utf-8')
  less.render(content, {
    filename: path.resolve(fpath)
  }).then(({ css }) => {
    fs.writeFileSync(convertExt(fpath), css)
  }).catch(error => {
    console.log(error)
  })
}*/

function lessc(readDirPath, dirs) {
  dirs.forEach((item) => {
    try{
    if(!item || !item.name) 
      {
        return
      }
    if (item.name.indexOf('.') == 0 || item.name.indexOf("node_modules") > -1) {
      return
    }
    else if (item.isDirectory()) {
      let dirPath = path.join(readDirPath, item.name)
      const moduleDirs = fs.readdirSync(dirPath, { withFileTypes: true });
      moduleDirs.length && lessc(dirPath, moduleDirs)
    }
    else if (item.name.endsWith('.less')) {
      let itemPath = path.join(readDirPath, item.name)
      console.log("less", itemPath)
      //writeFile(itemPath)
      exec(`lessc ${itemPath} ${convertExt(itemPath)}`, function (err, stdout, stderr) {
        if (err) console.error(err, stderr)
        else {
          console.log(stdout);
        }
      });
    
      //lessc item item.acss
    }
    }catch(err){
      console.log(err)
    }
  });
}
const rootDirPath = path.join(__dirname, '../')
const dirs = fs.readdirSync(rootDirPath, { withFileTypes: true });
lessc(rootDirPath, dirs)
