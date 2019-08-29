var fs = require('fs')
var path = require('path');

fs.readFile(path.resolve('src/assets/styles/QuakeledgerStyle.sld'), 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/<Size>\d*/gm, (searchvalue) => {
    const str = '<Size>';
    const replacev = searchvalue.substr(str.length, searchvalue.length);
    return str + parseFloat(replacev) / 2;
  });


  fs.writeFile(path.resolve('src/assets/styles/_QuakeledgerStyle.sld'), result, 'utf8', function (err) {
    if (err) return console.log(err);
    console.log(`new file ${path.resolve('src/assets/styles/_QuakeledgerStyle.sld')}`);
  });
});