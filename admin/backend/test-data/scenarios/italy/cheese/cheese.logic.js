

async function func() {
    return [{
        id: 'cheese',
        value: 'some good cheese'
    }]
}



module.exports.step = {
    step: 0,
    title: 'Cheese',
    description: '',
    inputs: [],
    outputs: [{
        id: 'cheese'
    }],
    function: func
};