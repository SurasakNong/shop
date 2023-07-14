/*===============================  การจัดการสาขา =================================*/
$(document).on("click", "#branch_mng", function () {
    page_selected = 1;
    show_mg_branch_tb();
});

function show_mg_branch_tb() { //========================== แสดงค้นหา และปุ่มเพิ่ม หมวดรายการ
    $("#main_content").show();
    var html = `
    <div class="container-fluid">
      <div class="row">                
          <div class="col-lg-9 mx-auto mt-2">
              <label id="fn_name" ><i class="fa-solid fa-house fa-lg"></i> &nbsp; สาขา</label>
              <form id="fmsearch_branch" >
                  <div class="input-group mb-2">
                      <input type="text" id="search_branch" onkeypress="handle_branch_search(event)" class="form-control" placeholder="คำค้นหา.." aria-label="Search" aria-describedby="button-search">
                      <button class="b-success" type="button" id="bt_search_branch" title="ค้นหา"><i class="fas fa-search"></i></button>
                      <button class="b-add ms-2" id="bt_add_branch" type="button" title="เพิ่มข้อมูล"><i class="fa-solid fa-plus fa-lg"></i></button>
                      <button class="b-back ms-2" id="bt_back" name="bt_back" type="button" title="กลับ"><i class="fa-solid fa-xmark fa-lg"></i></button>
                  </div>
              </form>
          </div>
      </div>   
      <div class="row">  
          <div class="col-lg-8 mx-auto" id="add_branch"></div>
      </div>   
      <div class="row">  
          <div class="col-lg-8 mx-auto" id="edit_branch"></div>
      </div>   
      <div class="row">  
          <div class="col-lg-9 mx-auto" id="table_branch"></div>
      </div>
    </div>
      `;
    $("#main_content").html(html);
    show_branch_table(rowperpage, 1); //<<<<<< แสดงตาราง rowperpage,page_sel

}


$(document).on('click', "#bt_search_branch", function () {  //ค้นหารายการ
    show_branch_table(rowperpage, 1);
});

function handle_branch_search(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        show_branch_table(rowperpage, 1);
    }
}

function show_branch_table(per, p) { //======================== แสดงตาราง
    waiting();
    var strSearch = document.getElementById('search_branch').value;
    var n = ((p - 1) * per);
    let my_val = [strSearch, per, p];
    google.script.run.withSuccessHandler(fn_show_branch).rd_branch(my_val);
    function fn_show_branch(result) {
        const myArr = JSON.parse(result);
        let page_all = myArr[myArr.length - 1].page;
        let rec_all = myArr[myArr.length - 1].rec;
        page_selected = (p >= page_all) ? page_all : p;
        var tt = `
        <table class="list-table table animate__animated animate__fadeIn" id="branchtable" >
          <thead>
            <tr>
              <th class="text-center" style="width:5%">ลำดับ</th> 
              <th class="text-left">ชื่อสาขา</th>
              <th class="text-left">ชื่อธุรกิจ</th>
              <th class="text-left">ที่อยู่</th>
              <th class="text-left">โทรศัพท์</th>
              <th class="text-left">อีเมล</th>
              <th class="text-left">เลขผู้เสียภาษี</th>
              <th class="text-center">แก้ไข&nbsp;&nbsp;&nbsp;ลบ</th>                
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
        <div class="row animate__animated animate__fadeIn">
          <div class="col-sm-3 mb-2"  style="font-size: 0.8rem;">
            <label style="font-size: 0.8rem;" for="rowShow_branch">แถวแสดง:</label>
            <input type="number" id="rowShow_branch" name="rowShow_branch" min="1" max="99" step="1" value="" style="text-align:center;">
          </div>
          <div class="col-sm-6 mb-2">
            <div id="pagination"></div>
          </div>
          <div class="col-sm-3 mb-2" style="font-size: 0.8rem; text-align:right;">
            <label id="record"></label>
          </div>
        </div> 
        
        `;
        $("#table_branch").html(tt);
        document.getElementById("rowShow_branch").value = rowperpage.toString();
        document.getElementById("record").innerHTML = "ทั้งหมด : " + rec_all + " ข้อมูล";
        for (let i = 0; i < myArr.length - 1; i++) {
            n++;
            lst_branch_tb(myArr[i], n);
        }
        pagination_show(p, page_all, rowperpage, 'show_branch_table'); //<<<<<<<< แสดงตัวจัดการหน้าข้อมูล Pagination    
        waiting(false);

    }
}

$(document).on("change", "#rowShow_branch", function () { //========== เปลี่ยนค่าจำนวนแถวที่แสดงในตาราง
    rowperpage = $("#rowShow_branch").val() * 1;
    show_branch_table(rowperpage, 1);
});


function lst_branch_tb(ob, i_no) {  //========== ฟังก์ชั่นเพิ่ม Row ตาราง
    let tableName = document.getElementById('branchtable');
    let prev = tableName.rows.length;
    let row = tableName.insertRow(prev);
    row.id = "row" + ob.id_prod;
    row.style.verticalAlign = "top";
    //row.style.height = "50px";
    /*let txtDel = `<i class="fas fa-trash-alt" style="cursor:not-allowed; color:#939393;"></i>`;
    if(u_level == "0"){*/
    txtDel = `<i class="fas fa-trash-alt" onclick="delete_branch_Row(` + ob.id + `)" style="cursor:pointer; color:#d9534f;"></i>`;
    //}
    let n_col = 8;
    let col = [];
    for (let ii = 0; ii < n_col; ii++) {
        col[ii] = row.insertCell(ii);
    }
    col[0].innerHTML = `<div id="no" class="text-center">` + i_no + `</div>`;
    col[1].innerHTML = `<div id="name_b` + ob.id + `" class="text-left">` + ob.name + `</div>`;
    col[2].innerHTML = `<div id="name2_b` + ob.id + `" class="text-left">` + ob.name2 + `</div>`;
    col[3].innerHTML = `<div id="add_b` + ob.id + `" class="text-left">` + ob.address + `</div>`;
    col[4].innerHTML = `<div id="tel_b` + ob.id + `" class="text-left">` + ob.tel + `</div>`;
    col[5].innerHTML = `<div id="email_b` + ob.id + `" class="text-left">` + ob.email + `</div>`;
    col[6].innerHTML = `<div id="tax_b` + ob.id + `" class="text-left">` + ob.tax + `</div>`;
    col[n_col - 1].innerHTML = `
      <input type="hidden" id="id_branch` + ob.id + `" value="` + ob.id + `" />
      <input type="hidden" id="logo_urlpic` + ob.id + `" value="` + ob.urlLogo + `" />
      <input type="hidden" id="qrcode_urlpic` + ob.id + `" value="` + ob.urlQrcode + `" />
      <input type="hidden" id="qrcode_code` + ob.id + `" value="` + ob.codeQrcode + `" />
      
      <i class="fas fa-edit me-3" onclick="edit_branch_Row(` + ob.id + `)" style="cursor:pointer; color:#5cb85c;"></i>
      `+ txtDel;
    col[n_col - 1].style = "text-align: center;";
}

function showBranchAdd() {  //========================= แสดงหน้าเพิ่มสาขา
    var html = `     
    <div id="branch_add">    
      <form class="animate__animated animate__fadeIn" id="add_branch_form" style="padding:20px;">
        <div class="row mb-3 justify-content-md-center">
          <div style="font-size:1.5rem; text-align: center;">
            เพิ่มสาขา
          </div>     
        </div> 
        <div class="row">
          <div class="col-md">
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa-solid fa-house"></i></span>
              <input type="text" id="name_branch" class="form-control" placeholder="ชื่อสาขา" aria-label="Branch name" required>
            </div>
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa-solid fa-warehouse"></i></span>
              <input type="text" id="name2_branch" class="form-control" placeholder="ชื่อธุรกิจ" aria-label="Business name">
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text" ><i class="fa-solid fa-house-user"></i></span>
              <!--<input type="text" id="address_branch" class="form-control" placeholder="ที่อยู่" aria-label="Address"> -->
              <textarea class="form-control" id="address_branch" placeholder="ที่อยู่" aria-label="Address"></textarea>
            </div>
          </div>
  
          <div class="col-md">
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa-solid fa-phone"></i></span>
              <input type="text" id="tel_branch" class="form-control" onkeypress='validate(event)' placeholder="เบอร์โทรศัพท์" aria-label="Phone number">
            </div>
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa-regular fa-envelope"></i></span>
              <input type="email" id="email_branch" class="form-control" placeholder="อีเมล" aria-label="Email">
            </div>
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa-solid fa-money-check-dollar"></i></span>
              <input type="text" id="tax_branch" class="form-control" onkeypress='validate(event)' placeholder="เลขผู้เสียภาษี" aria-label="tax number">
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text" ><i class="fa-brands fa-line"></i></span>
              <input type="text" id="code_qr" class="form-control" placeholder="โค้ดเชื่อมต่อไลน์" aria-label="Line code">
            </div>          
          </div>
        </div>  
        <div class="row mb-3 justify-content-md-center">
          <div class="row justify-content-center" style="text-align: center;">
              <button type="submit" class="mybtn btnOk">บันทึก</button>
              <button type="button" class="mybtn btnCan" id="cancel_add_branch">ยกเลิก</button>
          </div>   
        </div>               
        
      </form>
    </div>  
    `;
    $("#add_branch").html(html);
}

$(document).on("click", "#bt_add_branch", function () { //========== เปิดเพิ่มสาขา
    $("#table_branch").html("");
    showBranchAdd();
});

$(document).on("click", "#cancel_add_branch", function () { //========== ยกเลิกการเพิ่มสาขา
    $("#add_branch").html("");
    show_branch_table(rowperpage, page_selected);
});

$(document).on("submit", "#add_branch_form", function () {  //===== ตกลงเพิ่มสาขา 
    let my_form = $(this);
    const name_br = my_form.find("#name_branch").val();
    const name_bu = my_form.find("#name2_branch").val();
    const add_br = my_form.find("#address_branch").val();
    const tel_br = my_form.find("#tel_branch").val();
    const tax_br = my_form.find("#tax_branch").val();
    const email_br = my_form.find("#email_branch").val();
    const code_qr = my_form.find("#code_qr").val();
    const urlLogo_br = '';
    const urlQrcode_br = '';
    let fm_val = [name_br, name_bu, add_br, tel_br, email_br, tax_br, urlLogo_br, urlQrcode_br, code_qr];
    waiting();
    google.script.run.withSuccessHandler(fn_add_branch).add_branch(fm_val);
    function fn_add_branch(result) {
        waiting(false);
        if (result == 'success') {
            myAlert("success", "เพิ่มสาขา สำเร็จ");
            $("#add_branch").html("");
            show_branch_table(rowperpage, page_selected);
        } else if (result == "exits") {
            sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', name_br + ' ซ้ำ! มีการใช้ชื่อนี้แล้ว');
        } else {
            sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
        }
    }
    return false;
});

function delete_branch_Row(id) { //================================ ลบข้อมูลสาขา
    var fm_val = [id];
    var br_name = document.getElementById('name_b' + id).innerHTML;

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'mybtn btnOk',
            cancelButton: 'mybtn btnCan'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'ลบ ' + br_name,
        text: "โปรดยืนยัน ตกลงหรือไม่ ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '&nbsp;&nbsp;ตกลง&nbsp;&nbsp;',
        cancelButtonText: '&nbsp;&nbsp;ไม่&nbsp;&nbsp;',
        reverseButtons: false
    }).then((result) => {
        if (result.isConfirmed) {
            waiting();
            google.script.run.withSuccessHandler(fn_delete_branch).del_branch(fm_val);
            function fn_delete_branch(result) {
                if (result == true) {
                    myAlert("success", "ข้อมูลถูกลบแล้ว !");
                    show_branch_table(rowperpage, page_selected);
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

function showBranchEdit() {  //========================= แสดงหน้าแก้ไขข้อมูลสาขา
    var html = `     
    <div id="branch_edit">    
      <form class="animate__animated animate__fadeIn" id="edit_branch_form" style="padding:20px;">
        <div class="row mb-3 justify-content-md-center">
          <div style="font-size:1.5rem; text-align: center;">
            แก้ไขข้อมูลสาขา
          </div>     
        </div> 
        
        <div class="row mb-3 justify-content-center">
          <div class="col-md" style="text-align: center; position:relative;">
            <img id="brLogo" src="" alt="Logo" style="width:120px;">   
            <label class="camera" for="upload_picLogo" title="อัพโหลดโลโก้">
              <i class="fa-solid fa-camera"></i>  
              <input type="file" id="upload_picLogo" name="upload_picLogo" style="display:none" accept="image/*"/>
            </label>
          </div>
          <div class="col-md" style="text-align: center; position:relative;">
            <img id="brqr" src="" alt="QRcode" style="width:120px;">           
            <label class="camera" for="upload_picQr" title="อัพโหลดคิวอาร์โค้ด">
              <i class="fa-solid fa-camera"></i>  
              <input type="file" id="upload_picQr" name="upload_picQr" style="display:none" accept="image/png, image/gif, image/jpeg"/>
            </label>
          </div>            
        </div> 
        
        <div class="row">
          <div class="col-md">
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa-solid fa-house"></i></span>
              <input type="text" id="name_branch" class="form-control" placeholder="ชื่อสาขา" aria-label="Branch name" required>
            </div>
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa-solid fa-warehouse"></i></span>
              <input type="text" id="name2_branch" class="form-control" placeholder="ชื่อธุรกิจ" aria-label="Business name">
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text" ><i class="fa-solid fa-house-user"></i></span>
              <!--<input type="text" id="address_branch" class="form-control" placeholder="ที่อยู่" aria-label="Address"> -->
              <textarea class="form-control" id="address_branch" placeholder="ที่อยู่" aria-label="Address"></textarea>
            </div>
          </div>
  
          <div class="col-md">
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa-solid fa-phone"></i></span>
              <input type="text" id="tel_branch" class="form-control" onkeypress='validate(event)' placeholder="เบอร์โทรศัพท์" aria-label="Phone number">
            </div>
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa-regular fa-envelope"></i></span>
              <input type="email" id="email_branch" class="form-control" placeholder="อีเมล" aria-label="Email">
            </div>
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa-solid fa-money-check-dollar"></i></span>
              <input type="text" id="tax_branch" class="form-control" onkeypress='validate(event)' placeholder="เลขผู้เสียภาษี" aria-label="tax number">
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text" ><i class="fa-brands fa-line"></i></span>
              <input type="text" id="code_qr" class="form-control" placeholder="โค้ดเชื่อมต่อไลน์" aria-label="Line code">
            </div>
            
          </div>
        </div>    
        <div class="row mb-3 justify-content-md-center">
          <div class="row justify-content-center" style="text-align: center;">
              <button type="submit" class="mybtn btnOk">บันทึก</button>
              <button type="button" class="mybtn btnCan" id="cancel_edit_branch">ยกเลิก</button>
              <input id="id_branch" type="hidden">
              <input id="br_logo" type="hidden">
              <input id="br_qrcode" type="hidden">
          </div>    
        </div> 
      </form>
    </div>  
    `;
    $("#edit_branch").html(html);
}

$(document).on("click", "#cancel_edit_branch", function () { //========== ยกเลิกการแก้ไขสาขา
    $("#edit_branch").html("");
    show_branch_table(rowperpage, page_selected);
});


$(document).on("change", "#upload_picLogo", function (e) {
    if (e.target.files) {
        var n_file = 'LG-' + document.getElementById('id_branch').value + '-' + document.getElementById('name_branch').value;
        var idBranch = document.getElementById('id_branch').value;
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
                const img_quality = 1; //(0.1-1.0) ระดับคุณภาพ
                canvas.width = width;
                canvas.height = canvas.width * img.height / img.width;
                var cur = {
                    width: Math.floor(img.width * img_quality),
                    height: Math.floor(img.height * img_quality)
                }
                oc.width = cur.width;
                oc.height = cur.height;
                octx.drawImage(img, 0, 0, cur.width, cur.height);
                while (cur.width * img_quality > width) {
                    cur = {
                        width: Math.floor(cur.width * img_quality),
                        height: Math.floor(cur.height * img_quality)
                    };
                    octx.drawImage(oc, 0, 0, cur.width * 2, cur.height * 2, 0, 0, cur.width, cur.height);
                }
                ctx.drawImage(oc, 0, 0, cur.width, cur.height, 0, 0, canvas.width, canvas.height);

                var dataurl = canvas.toDataURL(imageFile.type);
                const vals = dataurl.split(',');
                const obj = {
                    id: idBranch,
                    fName: n_file,
                    fileName: imageFile.name,
                    mineType: imageFile.type,
                    data: vals[1]
                }
                google.script.run.withSuccessHandler(upBranchResult).uploadPicBranch(obj);
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(imageFile);
    }
});

function upBranchResult(val) {
    var id_pic = val.url.split('/d/')[1].split('/view')[0];
    var fullIdPic = 'https://drive.google.com/uc?id=' + id_pic;
    var urlPicBranch = document.getElementById('br_logo').value;
    if (urlPicBranch !== pic_noLogo) {
        var id_pic_del = urlPicBranch.split('id=')[1];
        google.script.run.withSuccessHandler(del_br_result).trashIt(id_pic_del);
    }
    document.getElementById("brLogo").src = fullIdPic;
    $("#br_logo").val(fullIdPic);
    waiting(false);
}

function del_br_result(val) {
    if (val) {
        console.log("Delete Logo Branch picture success.");
    } else {
        console.log("Delete Logo Branch picture not success!");
    }
}

$(document).on("change", "#upload_picQr", function (e) {
    if (e.target.files) {
        var n_file = 'QR-' + document.getElementById('id_branch').value + '-' + document.getElementById('name_branch').value;
        var idBranch = document.getElementById('id_branch').value;
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
                const width = 250; //====== destination canvas size
                const img_quality = 1; //(0.1-1.0) ระดับคุณภาพ
                canvas.width = width;
                canvas.height = canvas.width * img.height / img.width;
                var cur = {
                    width: Math.floor(img.width * img_quality),
                    height: Math.floor(img.height * img_quality)
                }
                oc.width = cur.width;
                oc.height = cur.height;
                octx.drawImage(img, 0, 0, cur.width, cur.height);
                while (cur.width * img_quality > width) {
                    cur = {
                        width: Math.floor(cur.width * img_quality),
                        height: Math.floor(cur.height * img_quality)
                    };
                    octx.drawImage(oc, 0, 0, cur.width * 2, cur.height * 2, 0, 0, cur.width, cur.height);
                }
                ctx.drawImage(oc, 0, 0, cur.width, cur.height, 0, 0, canvas.width, canvas.height);

                var dataurl = canvas.toDataURL(imageFile.type);
                const vals = dataurl.split(',');
                const obj = {
                    id: idBranch,
                    fName: n_file,
                    fileName: imageFile.name,
                    mineType: imageFile.type,
                    data: vals[1]
                }
                google.script.run.withSuccessHandler(upQrResult).uploadPicQR(obj);
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(imageFile);
    }
});

function upQrResult(val) {
    var id_pic = val.url.split('/d/')[1].split('/view')[0];
    var fullIdPic = 'https://drive.google.com/uc?id=' + id_pic;
    var urlPicQr = document.getElementById('br_qrcode').value;
    if (urlPicQr !== pic_noQrcode) {
        var id_pic_del = urlPicQr.split('id=')[1];
        google.script.run.withSuccessHandler(del_qr_result).trashIt(id_pic_del);
    }
    document.getElementById("brqr").src = fullIdPic;
    $("#br_qrcode").val(fullIdPic);
    waiting(false);
}

function del_qr_result(val) {
    if (val) {
        console.log("Delete QRcode Branch picture success.");
    } else {
        console.log("Delete Qrcode Branch picture not success!");
    }
}


function edit_branch_Row(id) { //================================ เปิดหน้าแก้ไขข้อมูลสาขา
    showBranchEdit();
    $("#id_branch").val(id);
    var pic_logo = (document.getElementById('logo_urlpic' + id).value == 'undefined') ? pic_noLogo : document.getElementById('logo_urlpic' + id).value;
    var pic_qr = (document.getElementById('qrcode_urlpic' + id).value == 'undefined') ? pic_noQrcode : document.getElementById('qrcode_urlpic' + id).value;
    document.getElementById("brLogo").src = pic_logo;
    document.getElementById("brqr").src = pic_qr;
    $("#name_branch").val(document.getElementById('name_b' + id).innerHTML);
    $("#name2_branch").val(document.getElementById('name2_b' + id).innerHTML);
    $("#address_branch").val(document.getElementById('add_b' + id).innerHTML);
    $("#tel_branch").val(document.getElementById('tel_b' + id).innerHTML);
    $("#email_branch").val(document.getElementById('email_b' + id).innerHTML);
    $("#tax_branch").val(document.getElementById('tax_b' + id).innerHTML);
    $("#code_qr").val(dataGetbyId_val('qrcode_code' + id));
    $("#br_logo").val(pic_logo);
    $("#br_qrcode").val(pic_qr);

    $("#table_branch").html("");
}

$(document).on("submit", "#edit_branch_form", function () {  //===== ตกลงเปลี่ยนข้อมูลสาขา 
    let my_form = $(this);
    const id_br = my_form.find("#id_branch").val();
    const name_br = my_form.find("#name_branch").val();
    const name2_br = my_form.find("#name2_branch").val();
    const add_br = my_form.find("#address_branch").val();
    const tel_br = my_form.find("#tel_branch").val();
    const email_br = my_form.find("#email_branch").val();
    const tax_br = my_form.find("#tax_branch").val();
    const code_qr = my_form.find("#code_qr").val();
    const logo_br = my_form.find("#br_logo").val();
    const qr_br = my_form.find("#br_qrcode").val();
    let fm_val = [id_br, name_br, name2_br, add_br, tel_br, email_br, tax_br, logo_br, qr_br, code_qr];
    waiting();
    google.script.run.withSuccessHandler(fn_edit_branch).edit_branch(fm_val);
    function fn_edit_branch(result) {
        waiting(false);
        if (result == "success") {
            myAlert("success", "แก้ไขข้อมูล สำเร็จ");
            $("#edit_branch").html("");
            show_branch_table(rowperpage, page_selected);
        } else if (result == "exits") {
            sw_Alert('warning', 'แก้ไขข้อมูล ไม่สำเร็จ', name_br + ' ซ้ำ! กรุณาเปลี่ยนใหม่');
        } else {
            sw_Alert('error', 'แก้ไขข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
        }
    }
    return false;
}); 