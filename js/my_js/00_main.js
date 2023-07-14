$(document).ready(function () {
    setMainMenu();
    $("#mainpage").hide();
    showLoginPage();
});


function ck_open() {
    if (openMenu) { //=== Close Menu      
        document.getElementById("menuContent1").style.maxHeight = null;
        $('.bar1').css({
            'transform': 'translate(0, 0) rotate(0deg)'
        });
        $('.bar2').css({
            'opacity': '1'
        });
        $('.bar3').css({
            'transform': 'translate(0, 0px) rotate(0deg)'
        });
        setTimeout(function () { $(".overlay-content").hide(); }, 20);
        document.getElementById("myNav").style.height = h_menu + "px";
        document.getElementById("myNav").style.width = "0%";
        openMenu = false;
    } else {  //=== Open Menu
        document.getElementById("avatar").src = user.pic;
        $('.bar1').css({
            'transform': 'translate(0, 11px) rotate(-45deg)'
        });
        $('.bar2').css({
            'opacity': '0'
        });
        $('.bar3').css({
            'transform': 'translate(0, -11px) rotate(45deg)'
        });
        document.getElementById("myNav").style.width = "250px";
        setTimeout(function () { $(".overlay-content").show(); }, 250);

        openMenu = true;
    }
}

$(document).on("click", ".my_menu", function () {  //เลือกเมนูแล้วให้ปิด Nav
    ck_open();
});

function myAlert(icon, title) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'center',
        width: '330px',
        showConfirmButton: false,
        timer: 2300,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    Toast.fire({
        icon: icon, //'success'
        title: title  //'Signed in successfully'
    })

}

function sw_Alert(icon, title, desc) {
    Swal.fire({
        customClass: {
            confirmButton: 'mybtn btnOk'
            //confirmButton: 'btn btn-primary'
        },

        buttonsStyling: false,
        icon: icon,
        title: title,
        text: desc,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    })
}

function dateNow(st) { //======= วันที่ปัจจุบันสตริง
    var m = new Date();
    var dateString = "";
    if (st === "dmy") { //==== 14/06/2023 22:24:49
        dateString =
            ("0" + m.getDate()).slice(-2) + "/" +
            ("0" + (m.getMonth() + 1)).slice(-2) + "/" +
            m.getFullYear() + " " +
            ("0" + m.getHours()).slice(-2) + ":" +
            ("0" + m.getMinutes()).slice(-2) + ":" +
            ("0" + m.getSeconds()).slice(-2);
    } else if (st === "mdy") {  //==== 06/14/2023 22:24:49
        dateString =
            ("0" + (m.getMonth() + 1)).slice(-2) + "/" +
            ("0" + m.getDate()).slice(-2) + "/" +
            m.getFullYear() + " " +
            ("0" + m.getHours()).slice(-2) + ":" +
            ("0" + m.getMinutes()).slice(-2) + ":" +
            ("0" + m.getSeconds()).slice(-2);
    } else if (st === "ymd") {  //==== 2023/06/14 22:24:49
        dateString =
            m.getFullYear() + "/" +
            ("0" + (m.getMonth() + 1)).slice(-2) + "/" +
            ("0" + m.getDate()).slice(-2) + " " +
            ("0" + m.getHours()).slice(-2) + ":" +
            ("0" + m.getMinutes()).slice(-2) + ":" +
            ("0" + m.getSeconds()).slice(-2);

    } else {
        dateString = m.getTime(); //Time Stamp
    }
    return dateString;
}

function tsToDate(ts, fn = "dmy") { //======= Timestamp to Date
    var m = new Date(ts);
    var dateString = "";
    if (fn === "dmy") { //==== 14/06/2023 22:24:49
        dateString =
            ("0" + m.getDate()).slice(-2) + "/" +
            ("0" + (m.getMonth() + 1)).slice(-2) + "/" +
            m.getFullYear() + " " +
            ("0" + m.getHours()).slice(-2) + ":" +
            ("0" + m.getMinutes()).slice(-2) + ":" +
            ("0" + m.getSeconds()).slice(-2);
    } else if (fn === "mdy") {  //==== 06/14/2023 22:24:49
        dateString =
            ("0" + (m.getMonth() + 1)).slice(-2) + "/" +
            ("0" + m.getDate()).slice(-2) + "/" +
            m.getFullYear() + " " +
            ("0" + m.getHours()).slice(-2) + ":" +
            ("0" + m.getMinutes()).slice(-2) + ":" +
            ("0" + m.getSeconds()).slice(-2);
    } else if (fn === "ymd") {  //==== 2023/06/14 22:24:49
        dateString =
            m.getFullYear() + "/" +
            ("0" + (m.getMonth() + 1)).slice(-2) + "/" +
            ("0" + m.getDate()).slice(-2) + " " +
            ("0" + m.getHours()).slice(-2) + ":" +
            ("0" + m.getMinutes()).slice(-2) + ":" +
            ("0" + m.getSeconds()).slice(-2);
    } else {
        dateString = ts; //Time Stamp
    }
    return dateString;
}

function mdyToTimestamp(strDate) { //mdyToTimestamp('02/13/2009 23:31:30') ==> Timestamp
    var datum = Date.parse(strDate);
    return datum;
}

function dmyToTimestamp(strDate) { //dmyToTimestamp('13/02/2009 23:31:30') ==> Timestamp
    let mdy_data = strDate.split("/");
    const dmy_data = mdy_data[1] + "/" + mdy_data[0] + "/" + mdy_data[2];
    var datum = Date.parse(dmy_data);
    return datum;
}

function diffTimestamp(stT, enT, fn = "m") { //ผลต่างของเวลา Timestamp
    var dif_ts = enT - stT;
    var res = 0;
    if (fn === "s") { //แสดงเป็น วินาที
        res = dif_ts / (1000);
    } else if (fn === "m") { //แสดงเป็น นาที
        res = dif_ts / (1000 * 60);
    } else if (fn === "h") { //แสดงเป็น ชั่วโมง
        res = dif_ts / (1000 * 60 * 60);
    } else if (fn === "D") { //แสดงเป็น วัน
        res = dif_ts / (1000 * 60 * 60 * 24);
    } else {
        res = 0;
    }
    return res.toFixed() * 1;

}


function pagination_show(page, pageall, per, fn) { //============== แสดงตัวจัดการหน้าข้อมูล Pagination      
    let max_p = parseInt(pageall);
    let p = parseInt(page);
    let p_prev = (p > 1) ? p - 1 : 1;
    let p_next = (p < max_p) ? p + 1 : max_p;
    let pag_h = `<div class="pagination justify-content-center">`;
    let pag_prev = `<a href="#" id="pag_prev" title="Previous" onclick=` + fn + `(` + per + `,` + p_prev + `)>&#11164;</a>`; //&laquo;
    let pag_next = `<a href="#" id="pag_next" title="Next" onclick=` + fn + `(` + per + `,` + p_next + `)>&#11166;</a></div>`;           //&raquo;  
    let pag_in = "";
    let h2 = 0;
    let h1 = 0;
    page_sel = page;
    if (max_p <= 7) {
        let act = "";
        for (var j = 1; j <= max_p; j++) {
            if (p == 1) { pag_prev = ''; }
            if (p == max_p) { pag_next = `</div>`; }
            if (p == j) {
                pag_in += `<a href="#" class="active" onclick=` + fn + `(` + per + `,` + j + `)></a> `;
            } else {
                pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + j + `)>` + j + `</a> `;
            }
        }
    } else {
        if (p < 5) {  //เลือกหน้าที่น้อยกว่าหน้าที่ 5
            for (var k = 1; k <= p + 2; k++) {
                if (p == 1) { pag_prev = ''; }
                if (p == k) {
                    pag_in += `<a href="#" class="active" onclick=` + fn + `(` + per + `,` + k + `)></a> `;
                } else {
                    pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + k + `)>` + k + `</a> `;
                }
            }
            h2 = Math.ceil((4 + max_p - 1) / 2);
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + h2 + `)>...</a> `;
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + (max_p - 1) + `)>` + (max_p - 1) + `</a> `;
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + (max_p) + `)>` + (max_p) + `</a> `;

        } else if (p > (max_p - 4)) { //เลือกหน้าที่ก่อนถึงหน้าสุดท้าย อยู่ 4 หน้า
            h1 = Math.ceil((2 + max_p - 3) / 2);
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,'1')>1</a> `;
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,'2')>2</a> `;
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + h1 + `)>...</a> `;
            for (var m = (p - 2); m <= max_p; m++) {
                if (p == max_p) { pag_next = `</div>`; }
                if (p == m) {
                    pag_in += `<a href="#" class="active" onclick=` + fn + `(` + per + `,` + m + `)></a> `;
                } else {
                    pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + m + `)>` + m + `</a> `;
                }
            }

        } else { //เลือกหน้าที่อยู่ระหว่างหน้าที่ 5 และก่อนถึงหน้าสุดท้ายอยู่ 4 หน้า
            h1 = Math.ceil((p - 2) / 2);
            h2 = Math.ceil((p + 2 + max_p) / 2);
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,'1')>1</a> `;
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + h1 + `)>...</a> `;

            for (var k = (p - 2); k <= p + 2; k++) {
                if (p == k) {
                    pag_in += `<a href="#" class="active" onclick=` + fn + `(` + per + `,` + k + `)></a> `;
                } else {
                    pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + k + `)>` + k + `</a> `;
                }

            }
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + h2 + `)>...</a> `;
            pag_in += `<a href="#" onclick=` + fn + `(` + per + `,` + (max_p) + `)>` + (max_p) + `</a> `;
        }
    }

    $("#pagination").html(pag_h + pag_prev + pag_in + pag_next);
}

$(document).on("click", "#bt_back", function () {
    showHome();
});



function encode_ts() { //เข้ารหัสรหัส
    // encode time
    const d_now = new Date();
    let a_now = d_now.getTime().toString();
    let arr_now = a_now.split("");
    let arr_sum = arr_now[0] * arr_now[1] * arr_now[2];
    for (let i = 3; i < arr_now.length; i++) {
        arr_sum = arr_sum + (+arr_now[i]);
    }
    arr_sum = ("000" + (arr_sum * 3)).slice(-3);
    let a_ran = Math.floor(Math.random() * 10);
    arr_now.push(a_ran);
    arr_now.push(arr_sum);
    let a_code = arr_now.join("");
    return a_code;
}

function decode_ts(ts_code) { // ถอดรหัส
    //let datain = "16756746025315243"; 
    //((1*6*7)+5+6+7+4+6+0+2+5+3+1)*3, 1675674602531 5 243 , 5 is random, 243 is code check
    let a_data = ts_code.split("");
    let a_sum = a_data[0] * a_data[1] * a_data[2]; //(1*6*7)
    //let ok_code = 0;
    for (let i = 3; i < a_data.length - 4; i++) { //(1*6*7)+5+6+7+4+6+0+2+5+3+1
        a_sum = a_sum + (+a_data[i]);
    }
    let val_ts = (ts_code.substr(ts_code.length - 3)) * 1;
    a_sum = a_sum * 3; //((1*6*7)+5+6+7+4+6+0+2+5+3+1)*3
    let a_time = [];
    for (let j = 0; j < a_data.length - 4; j++) { //1675674602531
        a_time.push(a_data[j]);
    }
    let ok_code = (a_sum == val_ts) ? 1 : 0; // 243
    let result = [];
    result.push(a_time.join(""));
    result.push(a_sum);
    result.push(ok_code);
    return result;
}

function haveTime(tt) {
    const t_now = new Date();
    const t_taget = 10 * 60; // second
    time_now = Math.floor(t_now.getTime() / 1000);
    let tt2 = Math.floor(tt / 1000);
    let diff_sec_all = time_now - tt2;

    let diff_min = Math.floor(diff_sec_all / 60)
    let diff_sec = diff_sec_all - (diff_min * 60);
    let res = (diff_sec_all > t_taget) ? false : true;
    let result = [((t_taget / 60) - (diff_min + 1)), (60 - (diff_sec + 1)), res];
    return result
}

function waiting(order = true) {
    if (order) {
        $(".myWaiting").show();
    } else {
        $(".myWaiting").hide();
    }
}

function validate(evt) { //กด Input text ได้เฉพาะตัวเลข
    var theEvent = evt || window.event;

    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

function initDropdownList(id, data) { // (idSelect , lenghtData) initDropdownList('selPos','dataset!A2:B');
    google.script.run.withSuccessHandler(fn_manage_user).rd_dataToSel(data);
    function fn_manage_user(result) {
        const myArr = JSON.parse(result);
        //console.log(myArr);
        var option;
        select = document.getElementById(id);
        /*while (select.options.length > 0) {
            select.remove(0);
        }*/
        for (let i = 0; i <= myArr.length - 1; i++) {
            option = document.createElement('option');
            option.value = myArr[i].id;
            option.text = myArr[i].name;
            select.add(option);
        }
    }
}

function setDropdownList(id, data, txt) { //setDropdownList('selBranch','branch!A2:B',document.getElementById('branch'+id).innerHTML);
    google.script.run.withSuccessHandler(fn_manage_user).rd_dataToSel(data);
    function fn_manage_user(result) {
        const myArr = JSON.parse(result);
        var option;
        select = document.getElementById(id);
        while (select.options.length > 0) {
            select.remove(0);
        }
        for (let i = 0; i <= myArr.length - 1; i++) {
            option = document.createElement('option');
            option.value = myArr[i].id;
            option.text = myArr[i].name;
            select.add(option);
        }
        $('#' + id + ' option').each(function () {
            if ($(this).text() == txt) {
                $(this).prop("selected", true);
            }
        });
    }
}

function dataGetbyId_val(id) {
    return (document.getElementById(id).value == 'undefined') ? '' : document.getElementById(id).value;
}

function dynamicSort(property) { //เรียงข้อมูล myArr = JSON.parse(result); สามารถเลือกชื่อobjได้เช่น myArr.sort(dynamicSort("desc"));
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}