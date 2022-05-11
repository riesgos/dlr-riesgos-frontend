/**
 * This is a placeholder.
 * In the future, this is where things like cache-rebuild
 * are going to be listed.
 */
function dingDong() {
    console.log('Ding-dong!');
}


function executeTasks() {
    const currentTime = new Date();
    const h = currentTime.getHours();
    const m = currentTime.getMinutes();
    // if (m % 2 === 0) {
    //     dingDong();
    // }
}

export function runScheduler() {
    setInterval(executeTasks, 30 * 1000);
}
