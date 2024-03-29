function showHome() {    
    waiting(false);
    $("#loginpage").hide();    
    $("#mainpage").show();
    showMainMenu();
    document.getElementById('titleName').innerHTML = branch.bname;
    document.getElementById('titleName').setAttribute('title', branch.name);
    $("#main_content").hide();
    console.log('Hello Welcome Home');
    //console.log(user);
    //console.log(branch);
    $("#username").html(user.name);
    $("#user_job").html(user.job);
    document.getElementById("avatar").src = user.pic;

}

function showMainMenu(){
    let html = `
    <div class="overlay-content">
        <div class="u_name">
            <img id="avatar" src=""
                alt="Avatar"> &nbsp;
            <label id="username"></label>
            <label id="user_job"></label>
            <i id="ch_key" class="fa-solid fa-key fa-xs" title="เปลี่ยนรหัสผ่าน"></i>
        </div>
        <div style="border:1px solid #ffffff; width:85%; margin: 10px auto 10px auto;"></div>
        <button class="my_menu"><i class="fa-solid fa-users fa-lg"></i> &nbsp;ลูกค้า</button>
        <button class="my_menu"><i class="fa-regular fa-calendar-days fa-lg"></i> &nbsp;นัดหมาย</button>
        <button class="my_menu" id="user_mng"><i class="fa-solid fa-user fa-lg"></i> &nbsp;พนักงาน</button>
        <button class="my_menu"><i class="fa-solid fa-chart-pie fa-lg"></i> &nbsp;แดชบอร์ด</button>
        <button class="my_menu"><i class="fa-solid fa-paste fa-lg"></i> &nbsp;รายงาน</button>
        <button class="collapsible"><i class="fa-solid fa-gear fa-lg"></i> &nbsp;ตั้งค่าระบบ</button>
        <div class="content" id="menuContent1">
            <button class="my_menu" id="branch_mng">&nbsp;&nbsp;<i class="fa-solid fa-house fa-lg"></i>
                &nbsp;สาขา</button>
            <button class="my_menu" id="point_mng">&nbsp;&nbsp;<i class="fa-solid fa-location-dot fa-lg"></i>
                &nbsp;จุดบริการ</button>
            <button class="my_menu">&nbsp;&nbsp;<i class="fa-solid fa-tags fa-lg"></i> &nbsp;สินค้า</button>
            <button class="my_menu">&nbsp;&nbsp;<i class="fa-solid fa-hand-holding fa-lg"></i>
                &nbsp;บริการ</button>
            <button class="my_menu">&nbsp;&nbsp;<i class="fa-solid fa-list-check fa-lg"></i>
                &nbsp;คอร์ส</button>
        </div>

        <div style="border:1px solid #ffffff; width:85%; margin: 10px auto 10px auto;"></div>
        <button class="my_exit" onclick="closeWin();">EXIT&nbsp;<i
                class="fas fa-sign-out-alt fa-1x"></i></button>

    </div>
    ` ;
    $("#myNav").html(html);
    setMainMenu();
}

$(document).on("click", ".loader", function () {
    ck_open();
});

function setMainMenu() {
    var coll = document.getElementsByClassName("collapsible"); // Nav Menu
    var i;
    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                document.getElementById("myNav").style.transition = "0.6s";
                document.getElementById("myNav").style.height = h_menu + "px";
            } else {
                document.getElementById("myNav").style.height = (content.scrollHeight + h_menu) + "px";
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }
}


$(document).on("click", "#ch_key", function () {   //เปิดหน้าเปลี่ยนรหัสผ่าน
    ck_open();
    document.getElementById("main_changepass").style.display = "block";
    let html = `      
      <form class="animate__animated animate__fadeIn" id="change_pass_mainform" style="padding:20px;">
        <div class="mb-3" style="font-size:1.5rem; text-align: center;">
          เปลี่ยนรหัสผ่าน
        </div>
        <div class="input-group mb-3">
          <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
          <input type="password" class="form-control" id="old_pass" placeholder="รหัสผ่านเดิม" aria-label="Password" required>
        </div>
        <div class="input-group mb-2">
          <span class="input-group-text" ><i class="fa-solid fa-key"></i></span>
          <input type="password" class="form-control" id="new_pass1" placeholder="รหัสผ่านใหม่" aria-label="Password" required>
        </div>
        <div class="input-group mb-3">
          <span class="input-group-text" ><i class="fa-solid fa-key"></i></span>
          <input type="password" class="form-control" id="new_pass2" placeholder="อีกครั้ง" aria-label="Repeat Password" required>
        </div>
        <div style="text-align:center;">
          <button type="submit" class="mybtn btnOk">บันทึก</button>
          <button type="button" class="mybtn btnCan" onclick="document.getElementById('main_changepass').style.display = 'none';">ยกเลิก</button>
        </div>
      </form>
    `;
    $("#main_changepass").html(html);
});

$(document).on("submit", "#change_pass_mainform", function () {  //===== ตกลงเปลี่ยนรหัสผ่าน
    let my_form = $(this);
    const pass_old = my_form.find("#old_pass").val();
    const pass_new1 = my_form.find("#new_pass1").val();
    const pass_new2 = my_form.find("#new_pass2").val();
    if (pass_new1 === pass_new2) {
        const dt_modi = dateNow('dmy');
        waiting();
        $.ajax({
            url: urlUser,
            type: 'GET',
            crossDomain: true,
            data: { opt_k: 'changepass', opt_id: user.id, opt_pw: pass_old, opt_pw2: pass_new1, opt_dt: dt_modi },
            success: function (result) {
                waiting(false);
                console.log(result);
                if (result == "success") {
                    myAlert("success", "เปลี่ยนรหัสผ่าน สำเร็จ");
                    document.getElementById('main_changepass').style.display = 'none';
                } else if (result == "passwrong") {
                    sw_Alert('error', 'เปลี่ยนรหัสผ่านไม่สำเร็จ', 'รหัสผ่านเดิมไม่ถูกต้อง');
                } else {                    
                    sw_Alert('error', 'เปลี่ยนรหัสผ่านไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
                }
            },
            error: function (err) {
                console.log("Reset password ERROR : " + err);
            }
        });

    } else {
        sw_Alert('warning', 'รหัสผ่านไม่ตรงกัน', 'กรุณาระบุรหัสผ่านใหม่ให้ตรงกันทั้งสองครั้ง');
    }

    return false;
});

function closeWin() {
    Swal.fire({
        title: 'ต้องการออกจากโปรแกรม ใช่หรือไม่?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        customClass: {
            confirmButton: 'mybtn btnOk',
            cancelButton: 'mybtn btnCan'
        },
        buttonsStyling: false,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            console.log("Good By..");
            ck_open();
            $("#mainpage").hide();
            showLoginPage();
            //window.top.close();
        } else if (result.isDenied) {
            console.log("OK Denied..");
        }
    })

}