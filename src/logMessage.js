module.exports = function logMessage(msg, author, server) {
    const currentTime = new Date();
    let currentTimeArray = [currentTime.getFullYear(),
                            currentTime.getMonth() + 1,
                            currentTime.getDate(),
                            currentTime.getHours(),
                            currentTime.getMinutes(),
                            currentTime.getSeconds()];
    
    for (i = 0; i < currentTimeArray.length; i++) {
        currentTimeArray[i] = addZeroWhenTooSmall(currentTimeArray[i]);
    }

    const timeNow = currentTimeArray[0] + "/" + currentTimeArray[1] + "/" + currentTimeArray[2] + " : " + currentTimeArray[3] + ":" + currentTimeArray[4] + ":" + currentTimeArray[5];
    console.log("[" + timeNow + "] " + "[" + server + "] " + author + " " + msg);
}

function addZeroWhenTooSmall(t) {
    if (t < 10 && t > -10) {
        return "0" + t;
    } else {
        return t;
    }
}