// installs missing dependencies from the library repo into the node_modules folder of the project 

try {
    const exec = require('child_process').exec;
    const package = require('../package.json');
    const packageLibs = require('../../frontend-libraries/package.json');

    ['dependencies', 'devDependencies']
        .forEach(deps => Object.keys(packageLibs[deps]).filter(pkg => !package[deps][pkg])
            .forEach(pkg => {
                let cmd = `npm i --no-save ${pkg}@${packageLibs[deps][pkg]}`;
                console.info(cmd);
                let cp = exec(cmd, error => error && console.error(`exec error: ${error}`));
                cp.stdout.on('data', console.log);
                cp.stderr.on('data', console.error);
            }))
} catch (e) {
    console.log(e);
}