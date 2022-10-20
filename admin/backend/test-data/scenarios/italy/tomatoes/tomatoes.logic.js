const helpers = require('./helper');


async function func(inputs) {
    
    const cheese = inputs.find(i => i.id == 'cheese');
    await helpers.sleep(100);

    return [{
        id: 'tomatoes',
        value: cheese.value + ' with tomatoes'
    }];
}



module.exports.step = {
    id: 'tomatoesStep',
    title: 'Tomatoes',
    description: '',
    inputs: [{ id: 'cheese' }],
    outputs: [{
        id: 'tomatoes'
    }],
    function: func
};