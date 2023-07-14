/*===============================  การจัดการผู้ใช้งาน =================================*/
$(document).on("click", "#user_mng", function () {
    page_selected = 1;
    show_manageuser_tb();
});


function show_manageuser_tb() { //========================== แสดงค้นหา และปุ่มเพิ่ม หมวดรายการ
    $("#main_content").show();
    var html = `
    <div class="container-fluid">
      <div class="row">                
          <div class="col-lg-9 mx-auto mt-2">
              <label id="fn_name" ><i class="fa-solid fa-user fa-lg"></i> &nbsp; พนักงาน</label>
              <form id="fmsearch_user" >
                  <div class="input-group mb-2">
                      <input type="text" id="search_user" onkeypress="handle_search(event)" class="form-control" placeholder="คำค้นหา.." aria-label="Search" aria-describedby="button-search">
                      <button class="b-success" type="button" id="bt_search_user" title="ค้นหา"><i class="fas fa-search"></i></button>
                      <button class="b-add ms-2" id="bt_add_user" type="button" title="เพิ่มข้อมูล"><i class="fa-solid fa-user-plus fa-lg"></i></button>
                      <button class="b-back ms-2" id="bt_back" name="bt_back" type="button" title="กลับ"><i class="fa-solid fa-xmark fa-lg"></i></button>
                  </div>
              </form>
          </div>
      </div>   
      <div class="row">  
          <div class="col-lg-8 mx-auto" id="add_user"></div>
      </div>   
      <div class="row">  
          <div class="col-lg-8 mx-auto" id="edit_user"></div>
      </div>   
      <div class="row">  
          <div class="col-lg-9 mx-auto" id="table_user"></div>
      </div>
    </div>
      `;
    $("#main_content").html(html);
    showusertable(rowperpage, 1); //<<<<<< แสดงตาราง rowperpage,page_sel
}


$(document).on('click', "#bt_search_user", function () {  //ค้นหารายการ
    showusertable(rowperpage, 1);
});

function handle_search(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        showusertable(rowperpage, 1);
    }
}



function showusertable(per, p) { //======================== แสดงตาราง
    waiting();
    var strSearch = document.getElementById('search_user').value;
    var n = ((p - 1) * per);
  $.ajax({
    url: 'https://script.google.com/macros/s/AKfycbxT9hbNsM2mBd3ycq1IKlrJW18_KN7fntrKxiPPU6mVLdSzKVa9RFm7gmG93sSgXUOk/exec',
    type: 'GET',
    crossDomain: true,
    data: { opt_k: 'read', opt_sh: strSearch, opt_pe: per, opt_p: p },
    success: function (result) {
      const myArr = JSON.parse(JSON.stringify(result));
      let page_all = myArr[myArr.length - 1].page;
      let rec_all = myArr[myArr.length - 1].rec;
      page_selected = (p >= page_all) ? page_all : p;
      var tt = `
        <table class="list-table table animate__animated animate__fadeIn" id="usertable" >
          <thead>
            <tr>
              <th class="text-center" style="width:5%">ลำดับ</th> 
              <th class="text-left">ชื่อ</th>
              <th class="text-left">ตำแหน่ง</th>
              <th class="text-left">สาขา</th>
              <th class="text-left">อีเมล์</th>
              <th class="text-left">โทร</th>
              <th >วันเข้าระบบ</th>
              <th class="text-center">แก้ไข&nbsp;&nbsp;&nbsp;ลบ</th>                
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
          <div class="row animate__animated animate__fadeIn">
            <div class="col-sm-3 mb-2" style="font-size: 0.8rem;">
              <label  for="rowShow_user">แถวแสดง:</label>
              <input type="number" id="rowShow_user" name="rowShow_user" min="1" max="99" step="1" value="" style="text-align:center;">
            </div>
            <div class="col-sm-6 mb-2">
              <div id="pagination"></div>
            </div>
            <div class="col-sm-3 mb-2" style="font-size: 0.8rem; text-align:right;">
              <label id="record"></label>
            </div>
          </div>                     
        `;
      $("#table_user").html(tt);
      document.getElementById("rowShow_user").value = rowperpage.toString();
      document.getElementById("record").innerHTML = "ทั้งหมด : " + rec_all + " ข้อมูล";
      for (let i = 0; i < myArr.length - 1; i++) {
        n++;
        listuserTable(myArr[i], n);
      }
      pagination_show(p, page_all, rowperpage, 'showusertable'); //<<<<<<<< แสดงตัวจัดการหน้าข้อมูล Pagination
      waiting(false);
    },
    error: function (err) {
      console.log("The server  ERROR says: " + err);
    }
  });
}

$(document).on("change", "#rowShow_user", function () { //========== เปลี่ยนค่าจำนวนแถวที่แสดงในตาราง
    rowperpage = $("#rowShow_user").val() * 1;
    showusertable(rowperpage, 1);
});


function listuserTable(ob, i_no) {  //========== ฟังก์ชั่นเพิ่ม Row ตารางประเเภท
    let tableName = document.getElementById('usertable');
    let prev = tableName.rows.length;
    let row = tableName.insertRow(prev);
    row.id = "row" + ob.id_prod;
    row.style.verticalAlign = "top";
    //row.style.height = "50px";
    /*let txtDel = `<i class="fas fa-trash-alt" style="cursor:not-allowed; color:#939393;"></i>`;
    if(u_level == "0"){*/
    txtDel = `<i class="fas fa-trash-alt" onclick="delete_user_Row(` + ob.id + `)" style="cursor:pointer; color:#d9534f;"></i>`;
    //}
    let n_col = 8;
    let col = [];
    for (let ii = 0; ii < n_col; ii++) {
        col[ii] = row.insertCell(ii);
    }
    col[0].innerHTML = `<div id="no" class="text-center">` + i_no + `</div>`;
    col[1].innerHTML = `<div id="name` + ob.id + `" class="text-left">` + ob.name + `</div>`;
    col[2].innerHTML = `<div id="job` + ob.id + `" class="text-left">` + ob.job + `</div>`;
    col[3].innerHTML = `<div id="branch` + ob.id + `" class="text-left">` + ob.branch + `</div>`;
    col[4].innerHTML = `<div id="email` + ob.id + `" class="text-left">` + ob.email + `</div>`;
    col[5].innerHTML = `<div id="tel` + ob.id + `" class="text-left">` + ob.tel + `</div>`;
    col[6].innerHTML = `<div id="dtlog` + ob.id + `" class="text-left">` + ob.dtlog + `</div>`;
    col[n_col - 1].innerHTML = `
      <input type="hidden" id="id_user` + ob.id + `" value="` + ob.id + `" />
      <input type="hidden" id="u_name` + ob.id + `" value="` + ob.uname + `" />
      <input type="hidden" id="u_level` + ob.id + `" value="` + ob.level + `" />
      <input type="hidden" id="u_urlpic` + ob.id + `" value="` + ob.urlpic + `" />
      
      <i class="fas fa-edit me-3" onclick="edit_user_Row(` + ob.id + `)" style="cursor:pointer; color:#5cb85c;"></i>
      `+ txtDel;
    col[n_col - 1].style = "text-align: center;";
}

function showUserAdd() {  //========================= แสดงหน้าเพิ่มผู้ใช้งาน
    var html = `     
    <div id="user_add">    
      <form class="animate__animated animate__fadeIn" id="add_user_form" style="padding:20px;">
        <div class="row mb-3 justify-content-md-center">
          <div style="font-size:1.5rem; text-align: center;">
            เพิ่มพนักงาน
          </div>     
        </div> 
        <div class="row">
          <div class="col-md">
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa fa-user"></i></span>
              <input type="text" id="name_user" class="form-control" placeholder="ชื่อ-นามสกุล" aria-label="Fullname" required>
            </div>
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa-regular fa-envelope"></i></span>
              <input type="email" id="email_user" class="form-control" placeholder="อีเมล" aria-label="Email">
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text" ><i class="fa-solid fa-phone"></i></span>
              <input type="text" id="tel_user" class="form-control" onkeypress='validate(event)' placeholder="เบอร์โทรศัพท์" aria-label="Phone number">
            </div>
            <div class="row justify-content-md-center" style="text-align: center;">
                <button type="button" class="mybtn btnLine" id="qrcode">Add Line</button>
            </div>
          </div>
  
          <div class="col-md">
            <div class="input-group mb-2">
              <label class="input-group-text" for="selBranch"><i class="fa-solid fa-house"></i></label>
              <select class="form-select" id="selBranch">
                <option selected value="0">-- สาขา --</option>
              </select>
            </div>
  
            <div class="input-group mb-2">
              <label class="input-group-text" for="selPos"><i class="fa-solid fa-briefcase"></i></label>
              <select class="form-select" id="selPos">
                <option selected value="0">-- ตำแหน่ง --</option>
              </select>
            </div>
  
            <div class="input-group mb-3">
              <span class="input-group-text" ><i class="fa-regular fa-user"></i></span>
              <input type="text" id="userName" class="form-control" placeholder="User Name" aria-label="User Name" required>
            </div>
            <div class="row justify-content-center" style="text-align: center;">
                <button type="submit" class="mybtn btnOk">บันทึก</button>
                <button type="button" class="mybtn btnCan" id="cancel_add_user">ยกเลิก</button>
            </div>
          </div>
        </div>                
        
      </form>
    </div>  
    `;
    $("#add_user").html(html);
    initDropdownList('selBranch', 'branch!A2:B');
    initDropdownList('selPos', 'dataset!A2:B');

}

$(document).on("click", "#qrcode", function () { //========== เปิดเพิ่มผู้ใช้งาน
    document.getElementById("line_qrcode").style.display = "block";
    const tt = `
        <img src="`+ branch.qr + `" alt="QRcode" style="width:200px; height:200px;" class="card-img-top mt-3">
      <div class="card-body">
        <h5 class="card-title">ID Line Official Account</h5>
        <p class="card-text">`+ branch.line + `</p>
        <button type="button" class="mybtn btnOk" onclick="document.getElementById('line_qrcode').style.display = 'none';">OK</button>      
      </div>
        
        `;
    $("#line_qrcode").html(tt);
});

$(document).on("click", "#bt_add_user", function () { //========== เปิดเพิ่มผู้ใช้งาน
    $("#table_user").html("");
    showUserAdd();
});

$(document).on("click", "#cancel_add_user", function () { //========== ยกเลิกการเพิ่มผู้ใช้งาน
    $("#add_user").html("");
    //document.getElementById("table_user").style.display = "block";
    showusertable(rowperpage, page_selected);
});

$(document).on("submit", "#add_user_form", function () {  //===== ตกลงเพิ่มผู้ใช้งาน  
    let my_form = $(this);
    const name_user = my_form.find("#name_user").val();
    const email_user = my_form.find("#email_user").val();
    const tel_user = my_form.find("#tel_user").val();
    const uName = my_form.find("#userName").val();
    const sel_branch = document.getElementById("selBranch").options[document.getElementById("selBranch").selectedIndex].text;
    const sel_pos = document.getElementById("selPos").options[document.getElementById("selPos").selectedIndex].text;
    const dt_create = dateNow('dmy');
    let fm_val = [name_user, email_user, tel_user, uName, "123456", sel_branch, sel_pos, '1111', dt_create];
    waiting();
    google.script.run.withSuccessHandler(fn_add_user).add_user(fm_val);
    function fn_add_user(result) {
        waiting(false);
        if (result == 'success') {
            myAlert("success", "เพิ่มผู้ใช้งาน สำเร็จ");
            $("#add_user").html("");
            showusertable(rowperpage, page_selected);
        } else if (result == "exits") {
            sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', uName + ' ซ้ำ! มีการใช้ชื่อนี้แล้ว');
        } else {
            sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
        }
    }
    return false;
});

function delete_user_Row(id) { //================================ ลบข้อมูลผู้ใช้งาน
    var fm_val = [id];
    var user_name = document.getElementById('name' + id).innerHTML + ' (' + document.getElementById('u_name' + id).value + ')';

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'mybtn btnOk',
            cancelButton: 'mybtn btnCan'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'ลบ ' + user_name,
        text: "โปรดยืนยัน ตกลงหรือไม่ ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '&nbsp;&nbsp;ตกลง&nbsp;&nbsp;',
        cancelButtonText: '&nbsp;&nbsp;ไม่&nbsp;&nbsp;',
        reverseButtons: false
    }).then((result) => {
        if (result.isConfirmed) {
            waiting();
            google.script.run.withSuccessHandler(fn_del_user).del_user(fm_val);
            function fn_del_user(result) {
                if (result == true) {
                    myAlert("success", "ข้อมูลถูกลบแล้ว !");
                    showusertable(rowperpage, page_selected);
                } else {
                    sw_Alert('error', 'ลบข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
                }
            }

        } else if (result.dismiss === Swal.DismissReason.cancel) {
            /*swalWithBootstrapButtons.fire(
                'ยกเลิก',
                'ข้อมูลของคุณยังไม่ถูกลบ :)',
                'error'
            )*/
        }
    })
}

function showUserEdit() {  //========================= แสดงหน้าแก้ไขข้อมูลผู้ใช้งาน
    var html = `     
    <div id="user_edit">    
      <form class="animate__animated animate__fadeIn" id="edit_user_form" style="padding:20px;">
        <div class="row mb-3 justify-content-md-center">
          <div style="font-size:1.5rem; text-align: center;">
            แก้ไขข้อมูลพนักงาน
          </div>     
        </div> 
        <div class="row mb-3 justify-content-center" style="position: relative;">
          <img id="picuser" src="" alt="Avatar" style="width:150px; border-radius:50%;">  
          <label class="camera" for="upload_picUser" title="อัพโหลดรูปใหม่">
            <i class="fa-solid fa-camera"></i>  
            <input type="file" id="upload_picUser" style="display:none" accept="image/*">
          </label>
        </div> 
        <div class="row">
          <div class="col-md">
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa fa-user"></i></span>
              <input type="text" id="name_user" class="form-control" placeholder="ชื่อ-นามสกุล" aria-label="Fullname" required>
            </div>
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa-regular fa-envelope"></i></span>
              <input type="email" id="email_user" class="form-control" placeholder="อีเมล" aria-label="Email">
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text" ><i class="fa-solid fa-phone"></i></span>
              <input type="text" id="tel_user" class="form-control" onkeypress='validate(event)' placeholder="เบอร์โทรศัพท์" aria-label="Phone number">
            </div>
            <div class="row mb-3 justify-content-center" style="text-align: center;">
                <button type="button" class="mybtn btnLine" id="qrcode"><i class="fa-brands fa-line fa-lg"></i> Add</button>
                <button type="button" class="mybtn btnLine" id="resetpass" title="รีเซ็ทรหัสผ่าน"><i class="fa-solid fa-arrows-rotate fa-sm"></i> รหัสผ่าน</button>
            </div>
          </div>
  
          <div class="col-md">
            <div class="input-group mb-2">
              <label class="input-group-text" for="selBranch"><i class="fa-solid fa-house"></i></label>
              <select class="form-select" id="selBranch">
                <option selected value="0">-- สาขา --</option>
              </select>
            </div>
  
            <div class="input-group mb-2">
              <label class="input-group-text" for="selPos"><i class="fa-solid fa-briefcase"></i></label>
              <select class="form-select" id="selPos">
                <option selected value="0">-- ตำแหน่ง --</option>
              </select>
            </div>
  
            <div class="input-group mb-3">
              <span class="input-group-text" ><i class="fa-regular fa-user"></i></span>
              <input type="text" id="userName" class="form-control" placeholder="User Name" aria-label="User Name" required>
            </div>
            <div class="row justify-content-center" style="text-align: center;">
                <button type="submit" class="mybtn btnOk">บันทึก</button>
                <button type="button" class="mybtn btnCan" id="cancel_edit_user">ยกเลิก</button>
                <input id="id_user" type="hidden">
                <input id="url_PicUser" type="hidden">
            </div>
          </div>
        </div>       
      </form>
    </div>  
    `;
    $("#edit_user").html(html);
}

$(document).on("click", "#cancel_edit_user", function () { //========== ยกเลิกการแก้ไขผู้ใช้งาน
    $("#edit_user").html("");
    showusertable(rowperpage, page_selected);
});

function edit_user_Row(id) { //================================ เปิดหน้าแก้ไขข้อมูลผู้ใช้งาน    
    showUserEdit();
    $("#id_user").val(id);
    setDropdownList('selBranch', 'branch!A2:B', document.getElementById('branch' + id).innerHTML);
    setDropdownList('selPos', 'dataset!A2:B', document.getElementById('job' + id).innerHTML);
    var picUser = (document.getElementById('u_urlpic' + id).value !== '') ? document.getElementById('u_urlpic' + id).value : pic_noAvatar;
    document.getElementById("picuser").src = picUser;
    $("#url_PicUser").val(picUser);
    $("#name_user").val(document.getElementById('name' + id).innerHTML);
    $("#email_user").val(document.getElementById('email' + id).innerHTML);
    $("#tel_user").val(document.getElementById('tel' + id).innerHTML);
    $("#userName").val(dataGetbyId_val('u_name' + id));
    $("#table_user").html("");
}


$(document).on("change", "#upload_picUser", function (e) {
    if (e.target.files) {
        var n_file = document.getElementById('id_user').value + '-' + document.getElementById('userName').value;
        var idUser = document.getElementById('id_user').value;
        let imageFile = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = document.createElement("img");

            img.onload = function (event) {
                waiting();
                var canvas = document.createElement('canvas'),
                    ctx = canvas.getContext("2d"),
                    oc = document.createElement('canvas'),
                    octx = oc.getContext('2d');
                var width = 250; //====== destination canvas size
                canvas.width = width;
                canvas.height = canvas.width * img.height / img.width;
                var cur = {
                    width: Math.floor(img.width * 0.5),
                    height: Math.floor(img.height * 0.5)
                }
                oc.width = cur.width;
                oc.height = cur.height;
                octx.drawImage(img, 0, 0, cur.width, cur.height);
                while (cur.width * 0.5 > width) {
                    cur = {
                        width: Math.floor(cur.width * 0.5),
                        height: Math.floor(cur.height * 0.5)
                    };
                    octx.drawImage(oc, 0, 0, cur.width * 2, cur.height * 2, 0, 0, cur.width, cur.height);
                }
                ctx.drawImage(oc, 0, 0, cur.width, cur.height, 0, 0, canvas.width, canvas.height);

                var dataurl = canvas.toDataURL(imageFile.type);
                //document.getElementById("preview").src = dataurl;
                const vals = dataurl.split(',');
                const obj = {
                    idUser: idUser,
                    fName: n_file,
                    fileName: imageFile.name,
                    mineType: imageFile.type,
                    data: vals[1]
                }
                google.script.run.withSuccessHandler(upUserResult).uploadPicUser(obj);
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(imageFile);
    }
});

function upUserResult(val) {
    var id_pic = val.url.split('/d/')[1].split('/view')[0];
    var fullIdPic = 'https://drive.google.com/uc?id=' + id_pic;
    var urlPicUser = document.getElementById('url_PicUser').value;
    if (urlPicUser !== pic_noAvatar) {
        var id_pic_del = urlPicUser.split('id=')[1];
        google.script.run.withSuccessHandler(del_result).trashIt(id_pic_del);
    }
    document.getElementById("picuser").src = fullIdPic;
    $("#url_PicUser").val(fullIdPic);
    waiting(false);
}

function del_result(val) {
    if (val) {
        console.log("Delete user picture success.");
    } else {
        console.log("Delete user picture not success!");
    }
}

$(document).on("submit", "#edit_user_form", function () {  //===== ตกลงเปลี่ยนข้อมูลผู้ใช้งาน  
    let my_form = $(this);
    const id_user_sel = my_form.find("#id_user").val();
    const name_user = my_form.find("#name_user").val();
    const email_user = my_form.find("#email_user").val();
    const tel_user = my_form.find("#tel_user").val();
    const uName = my_form.find("#userName").val();
    const sel_branch = document.getElementById("selBranch").options[document.getElementById("selBranch").selectedIndex].text;
    const sel_pos = document.getElementById("selPos").options[document.getElementById("selPos").selectedIndex].text;
    const userPic = my_form.find("#url_PicUser").val();
    const dt_modi = dateNow('dmy');
    let fm_val = [id_user_sel, name_user, email_user, tel_user, uName, sel_branch, sel_pos, userPic, dt_modi];
    waiting();
    google.script.run.withSuccessHandler(fn_edit_user).edit_user(fm_val);
    function fn_edit_user(result) {
        waiting(false);
        if (result == "success") {
            myAlert("success", "แก้ไขข้อมูล สำเร็จ");
            $("#edit_user").html("");
            showusertable(rowperpage, page_selected);
        } else if (result == "exits") {
            sw_Alert('warning', 'แก้ไขข้อมูล ไม่สำเร็จ', 'User Name ซ้ำกับผู้อื่น กรุณาเปลี่ยนใหม่');
        } else {
            sw_Alert('error', 'แก้ไขข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
        }
    }
    return false;
});

$(document).on("click", "#resetpass", function () { //========== รีเซ็ทรหัสผ่านใหม่
    const id_user_sel = document.getElementById("id_user").value;
    const user_name = document.getElementById('name_user').value;
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'mybtn btnOk',
            cancelButton: 'mybtn btnCan'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'รีเซ็ทรหัสผ่าน ' + user_name,
        text: "โปรดยืนยัน ตกลงหรือไม่ ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '&nbsp;&nbsp;ตกลง&nbsp;&nbsp;',
        cancelButtonText: '&nbsp;&nbsp;ไม่&nbsp;&nbsp;',
        reverseButtons: false
    }).then((result) => {
        if (result.isConfirmed) {
            waiting();
            google.script.run.withSuccessHandler(fn_resetpass).reset_pass_user(id_user_sel);
            function fn_resetpass(result) {
                if (result == 'success') {
                    waiting(false);
                    myAlert("success", "รหัสผ่านได้ถถูกรีเซ็ทแล้ว !");
                } else {
                    sw_Alert('error', 'รีเซ็ทรหัสผ่าน ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
                }
            }

        } else if (result.dismiss === Swal.DismissReason.cancel) {
            /*swalWithBootstrapButtons.fire(
                'ยกเลิก',
                'ข้อมูลของคุณยังไม่ถูกลบ :)',
                'error'
            )*/
        }
    })
});  