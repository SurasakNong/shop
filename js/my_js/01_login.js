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
              <label for="username" class="sr-only">User Name</label>
              <input type="text" id="inputUsername" class="form-control user_input_signin" name="username" placeholder="User Name" required> 
              <label for="password" class="sr-only">Password</label>
              <input type="password" id="inputPassword" class="form-control" name="password" placeholder="Password" required>
              
              <button class="btn-lg btn-block my-4" type="submit" name="submit" >Login</button>  <br> 
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
    //const d_now = new Date();
    //let ts_now = d_now.getTime(); //Time Stamp
    let ts_now = dateNow("dmy");
    
    google.script.run
        .withSuccessHandler(login_result)
        .login(username, pass, ts_now);
    function login_result(data) {
        waiting(false);
        if (data[0] == true) {
            //[0result, 1id, 2displayname, 3level, 4picUrl, 5job, 6branch, 7email, 8tel, 9uname]
            Object.assign(user, {
                uname: data[9],
                name: data[2] == "" || data[2] == "undefined" ? "Unknow" : data[2],
                job: data[5],
                branch: data[6],
                email: data[7],
                tel: data[8],
                pic: data[4] == "" || data[4] == "undefined" ? pic_noAvatar : data[4],
                lv: data[3],
            });
            //[10id, 11name 12bname 13add 14tel 15email 16tax 17logo 18qr 19line]
            Object.assign(branch, {
                id: data[10] * 1,
                name: data[11],
                bname: data[12],
                add: data[13],
                tel: data[14],
                email: data[15],
                tax: data[16],
                logo: data[17] == "" || data[17] == "undefined" ? pic_noLogo : data[17],
                qr: data[18] == "" || data[18] == "undefined" ? pic_noQrcode : data[18],
                line: data[19],
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
    }
    return false;
});
