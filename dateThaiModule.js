dateToThai = function(dt) {
    //const date = new Date(2020, 7, 1)
    const date = dt
    let dayNames = [
        "อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"
    ];

    let monthNames = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
        "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม.",
        "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    let year = date.getFullYear() + 543;
    let month = monthNames[date.getMonth()];
    let numOfDay = date.getDate();
    let day = dayNames[date.getDay()];

    let hour = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let second = date.getSeconds().toString().padStart(2, "0");

    result = `วัน ${day} ที่ ${numOfDay} ${month} ${year} ` +
        `${hour}:${minutes}:${second} น.`;

    return result
}

module.exports.dateToThai = dateToThai;

//dateToThai(new Date());