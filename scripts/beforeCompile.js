// scripts/beforeCompile.js
const fs = require('fs');
const path = require('path');
const package = require('../package.json')
var file =  path.join(__dirname, '../version.json')
var data = {}
if(fs.existsSync(file)){
  try{
  data = JSON.parse(fs.readFileSync(file))
  console.log('read',data)
  }catch(e){
    console.log(e)
  }
	//fs.unlinkSync(file)
}

var date = new Date()
date  = date.getFullYear() + '-'+ (date.getMonth() + 1)+'-' +date.getDate()
if(data.date!==date || data.version!= package.version ){
data.version = package.version || '1.0.0'
data.date = date
console.log('write',data)
fs.writeFileSync(file,JSON.stringify(data),{flag :'w'})
}