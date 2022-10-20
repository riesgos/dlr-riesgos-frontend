

async function func() {
    return [{
        id: 'cheese',
        value: 'some good cheese'
    }]
}



module.exports.step = {
    id: 'cheeseStep',
    title: 'Cheese',
    description: '',
    inputs: [],
    outputs: [{
        id: 'cheese'
    }],
    function: func
};