function showLoginPage() {
    //==================== show login page
    waiting(false);
    $("#loginpage").show();
    let html = `          
          <div class="container"> 
          <div class="logoname mt-3 mb-4 animate__animated animate__bounce noselect">Welcome Login</div>
            <form class="form-signin animate__animated animate__fadeIn" id='login_form'>          
              <!-- <img class="mb-3" src="https://drive.google.com/uc?id=12dc3IbYT8YEKyu8UecAd6vmjTJC1VVAr" alt="Logo" width="120" height="70"> 
              <p class="glow mb-3">Welcome</p> -->
              <input type="text" id="inputUsername" class="form-control user_input_signin" name="username" placeholder="User Name" required> 
              <input type="password" id="inputPassword" class="form-control mb-4" name="password" placeholder="Password" required>
              
              <button class="btn-lg btn-block my-3" type="submit" name="submit" >Login</button>  <br> 
            </form>
          </div>  
              `;
    $("#loginpage").html(html);
    //console.log(encode_ts());
}

$(document).on("submit", "#login_form", function () {
    //======= ทำการเข้าสู่ระบบ
    waiting();
    var my_form = $(this);
    var username = document.getElementById("inputUsername").value;
    var pass = document.getElementById("inputPassword").value;
    //let ts_now = d_now.getTime(); //Time Stamp
    let ts_now = dateNow("dmy");

    $.ajax({
        url: 'https://script.google.com/macros/s/AKfycbxT9hbNsM2mBd3ycq1IKlrJW18_KN7fntrKxiPPU6mVLdSzKVa9RFm7gmG93sSgXUOk/exec',
        type: 'GET',
        crossDomain: true,
        data: { opt_k: 'login', opt_un: username, opt_pw: pass, opt_dt: ts_now },
        success: function (result) {
            const obj = JSON.parse(JSON.stringify(result))[0];
            waiting(false);
            //console.log("The server says: " + obj.brName);
            if (obj.result == true) {
                //[0result, 1id, 2displayname, 3level, 4picUrl, 5job, 6branch, 7email, 8tel, 9uname]
                Object.assign(user, {
                    uname: obj.uname,
                    name: obj.disName == "" || obj.disName == "undefined" ? "Unknow" : obj.disName,
                    job: obj.job,
                    branch: obj.brName,
                    email: obj.email,
                    tel: obj.tel,
                    pic: obj.picUrl == "" || obj.picUrl == "undefined" ? pic_noAvatar : obj.picUrl,
                    lv: obj.lv
                });
                //[10id, 11name 12bname 13add 14tel 15email 16tax 17logo 18qr 19line]
                Object.assign(branch, {
                    id: obj.brId * 1,
                    bname: obj.brName2,
                    add: obj.brAdd,
                    tel: obj.brTel,
                    email: obj.brEmail,
                    tax: obj.brTax,
                    logo: obj.brLogo == "" || obj.brLogo == "undefined" ? pic_noLogo : obj.brLogo,
                    qr: obj.brQr == "" || obj.brQr == "undefined" ? pic_noQrcode : obj.brQr,
                    line: obj.brLine
                });

                $("#loginpage").hide();
                showHome();
            } else {
                sw_Alert(
                    "warning",
                    "เข้าสู่ระบบไม่สำเร็จ",
                    "ชื่อ หรือ รหัสผ่านไม่ถูกต้อง"
                );
                my_form.find("input[type=password]").val("");
            }
        },
        error: function (err) {
            console.log("The server  ERROR says: " + err);
        }
    });
    return false;
});
