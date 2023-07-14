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