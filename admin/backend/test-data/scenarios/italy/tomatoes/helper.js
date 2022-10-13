
module.exports.sleep = async function(sleepTime) {
    return new Promise((resolve) => setTimeout(resolve, sleepTime));
}