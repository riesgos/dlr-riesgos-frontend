const helpers = require('./helper');


async function func() {
    await helpers.sleep(1000);
    return [{
        id: 'cheese',
        value: 'some good cheese'
    }];
}



module.exports.step = {
    step: 1,
    title: 'Tomatoes',
    description: '',
    inputs: [{ id: 'cheese' }],
    outputs: [{
        id: 'tomatoes'
    }],
    function: func
};