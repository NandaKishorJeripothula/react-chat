export default () => {
    var dateObj = new Date(),
        day = dateObj.getUTCDate(),
        month = dateObj.getUTCMonth() + 1, //months from 1-12
        year = dateObj.getUTCFullYear(),
        hours = dateObj.getHours(),
        minutes = dateObj.getMinutes();
    minutes = (minutes < 10) ? "0" + minutes : minutes; //minutes padding
    if (hours < 12) {
        hours = (hours < 10) ? '0' + hours : hours; //hours padding
        minutes = minutes + "AM";
    } else if (hours === 12) {
        minutes = minutes + "PM"
    }
    else {
        hours = hours - 12;
        minutes = minutes + "PM";
    }
    //appending accrng to our needs
    var d = hours + ":" + minutes + " " + day + "/" + month + "/" + year;
    return d;
}