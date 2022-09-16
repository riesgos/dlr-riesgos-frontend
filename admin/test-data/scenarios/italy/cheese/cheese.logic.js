

async function func() {
    return [{
        id: 'cheese',
        value: 'some good cheese'
    }]
}



export const step = {
    step: 0,
    title: 'Cheese',
    description: '',
    inputs: [],
    outputs: [{
        id: 'cheese'
    }],
    function: func
};