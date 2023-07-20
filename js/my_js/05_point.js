/*===============================  การจัดการจุดบริการ =================================*/
$(document).on("click", "#point_mng", function () {
    page_selected = 1;
    show_mg_point_tb();
});

function show_mg_point_tb() { //========================== แสดงค้นหา และปุ่มเพิ่ม หมวดรายการ
    $("#main_content").show();
    var html = `
    <div class="container-fluid">
      <div class="row">                
          <div class="col-lg-9 mx-auto mt-2">
              <label id="fn_name" ><i class="fa-solid fa-location-dot fa-lg"></i> &nbsp; จุดบริการ</label>
              <form id="fmsearch_point" >
                  <div class="input-group mb-2">
                      <input type="text" id="search_point" onkeypress="handle_point_search(event)" class="form-control" placeholder="คำค้นหา.." aria-label="Search" aria-describedby="button-search">
                      <button class="b-success" type="button" id="bt_search_point" title="ค้นหา"><i class="fas fa-search"></i></button>
                      <button class="b-add ms-2" id="bt_add_point" type="button" title="เพิ่มข้อมูล" onclick="showPointAdd();"><i class="fa-solid fa-plus fa-lg"></i></button>
                      <button class="b-back ms-2" id="bt_back" name="bt_back" type="button" title="กลับ"><i class="fa-solid fa-xmark fa-lg"></i></button>
                  </div>
              </form>
          </div>
      </div>   
      <div class="row">  
          <div class="col-lg-8 mx-auto" id="add_point"></div>
      </div>   
      <div class="row">  
          <div class="col-lg-8 mx-auto" id="edit_point"></div>
      </div>   
      <div class="row">  
          <div class="col-lg-9 mx-auto" id="table_point"></div>
      </div>
    </div>
      `;
    $("#main_content").html(html);
    show_point_table(rowperpage, 1); //<<<<<< แสดงตาราง rowperpage,page_sel    
}

$(document).on('click', "#bt_search_point", function () {  //ค้นหารายการ
    show_point_table(rowperpage, 1);
});

function handle_point_search(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        show_point_table(rowperpage, 1);
    }
}

function show_point_table(per, p) { //======================== แสดงตาราง
    waiting();
    var strSearch = document.getElementById('search_point').value;
    var n = ((p - 1) * per);
    $.ajax({
      url: urlPoint,
      type: 'GET',
      crossDomain: true,
      data: { opt_k: 'read', opt_sh: strSearch, opt_pe: per, opt_p: p },
      success: function (result) {
        const myArr = JSON.parse(JSON.stringify(result));
        let page_all = myArr[myArr.length - 1].page;
        let rec_all = myArr[myArr.length - 1].rec;
        page_selected = (p >= page_all) ? page_all : p;
        var tt = `
        <table class="list-table table animate__animated animate__fadeIn" id="pointtable" >
          <thead>
            <tr>
              <th class="text-center" style="width:5%">ลำดับ</th> 
              <th class="text-left">จุดบริการ</th>
              <th class="text-left">รายละเอียด</th>
              <th class="text-left">สาขา</th>
              <th class="text-center">แก้ไข&nbsp;&nbsp;&nbsp;ลบ</th>                
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
        <div class="row animate__animated animate__fadeIn">
          <div class="col-sm-3 mb-2" style="font-size: 0.8rem;">
            <label for="rowShow_point">แถวแสดง:</label>
            <input type="number" id="rowShow_point" name="rowShow_point" min="1" max="99" step="1" value="" style="text-align:center;">
          </div>
          <div class="col-sm-6 mb-2">
            <div id="pagination"></div>
          </div>
          <div class="col-sm-3 mb-2" style="font-size: 0.8rem; text-align:right;">
            <label id="record"></label>
          </div>
        </div>   
        `;
        $("#table_point").html(tt);
        document.getElementById("rowShow_point").value = rowperpage.toString();
        document.getElementById("record").innerHTML = "ทั้งหมด : " + rec_all + " ข้อมูล";
        for (let i = 0; i < myArr.length - 1; i++) {
            n++;
            lst_point_tb(myArr[i], n);
        }
        pagination_show(p, page_all, rowperpage, 'show_point_table'); //<<<<<<<< แสดงตัวจัดการหน้าข้อมูล Pagination    
        waiting(false);
      },
      error: function (err) {
        console.log("The server  ERROR says: " + err);
      }
    });
}

$(document).on("change", "#rowShow_point", function () { //========== เปลี่ยนค่าจำนวนแถวที่แสดงในตาราง
    rowperpage = $("#rowShow_point").val() * 1;
    show_point_table(rowperpage, 1);
});


function lst_point_tb(ob, i_no) {  //========== ฟังก์ชั่นเพิ่ม Row ตาราง
    let tableName = document.getElementById('pointtable');
    let prev = tableName.rows.length;
    let row = tableName.insertRow(prev);
    row.id = "row" + ob.id_prod;
    row.style.verticalAlign = "top";
    //row.style.height = "50px";
    /*let txtDel = `<i class="fas fa-trash-alt" style="cursor:not-allowed; color:#939393;"></i>`;
    if(u_level == "0"){*/
    txtDel = `<i class="fas fa-trash-alt" onclick="delete_point_Row(` + ob.id + `)" style="cursor:pointer; color:#d9534f;"></i>`;
    //}
    let n_col = 5;
    let col = [];
    for (let ii = 0; ii < n_col; ii++) {
        col[ii] = row.insertCell(ii);
    }
    col[0].innerHTML = `<div id="no" class="text-center">` + i_no + `</div>`;
    col[1].innerHTML = `<div id="name_p` + ob.id + `" class="text-left">` + ob.name + `</div>`;
    col[2].innerHTML = `<div id="desc_p` + ob.id + `" class="text-left">` + ob.desc + `</div>`;
    col[3].innerHTML = `<div id="branch_p` + ob.id + `" class="text-left">` + ob.branch + `</div>`;
    col[n_col - 1].innerHTML = `
      <input type="hidden" id="id_point` + ob.id + `" value="` + ob.id + `" />
      
      <i class="fas fa-edit me-3" onclick="edit_point_Row(` + ob.id + `)" style="cursor:pointer; color:#5cb85c;"></i>
      `+ txtDel;
    col[n_col - 1].style = "text-align: center;";
}

function showPointAdd() {  //========================= แสดงหน้าเพิ่มจุดบริการ
    $("#table_point").html("");
    var html = `     
    <div id="point_add">    
      <form class="animate__animated animate__fadeIn" id="add_point_form" style="padding:20px;">
        <div class="row mb-3 justify-content-md-center">
          <div style="font-size:1.5rem; text-align: center;">
            เพิ่มจุดบริการ
          </div>     
        </div> 
        <div class="row">
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa-solid fa-location-dot"></i></span>
              <input type="text" id="name_point" class="form-control" placeholder="ชื่อจุดบริการ" aria-label="Point name" required>
            </div>
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa-solid fa-file-lines"></i></span>
              <textarea class="form-control" id="desc_point" placeholder="รายละเอียด" aria-label="Description"></textarea>
            </div>
            <div class="input-group mb-3">
              <label class="input-group-text" for="selBranch"><i class="fa-solid fa-house"></i></label>
              <select class="form-select" id="selBranch">
                <option selected value="0">-- สาขา --</option>
              </select>
            </div>
        </div>  
        <div class="row mb-3 justify-content-md-center">
          <div class="row justify-content-center" style="text-align: center;">
              <button type="submit" class="mybtn btnOk">บันทึก</button>
              <button type="button" class="mybtn btnCan" id="cancel_add_point">ยกเลิก</button>
          </div>   
        </div>               
        
      </form>
    </div>  
    `;
    $("#add_point").html(html);
    initDropdownList('selBranch', 'branch!A2:B',0,1);
}

$(document).on("click", "#cancel_add_point", function () { //========== ยกเลิกการเพิ่มจุดบริการ
    $("#add_point").html("");
    show_point_table(rowperpage, page_selected);
});

$(document).on("submit", "#add_point_form", function () {  //===== ตกลงเพิ่มสาขา 
    let my_form = $(this);
    const name_p = my_form.find("#name_point").val();
    const desc_p = my_form.find("#desc_point").val();
    const sel_branch = document.getElementById("selBranch").options[document.getElementById("selBranch").selectedIndex].text;
    waiting();
    $.ajax({
      url: urlPoint,
      type: 'GET',
      crossDomain: true,
      data: { opt_k: 'add', opt_np:name_p, opt_dp:desc_p, opt_br:sel_branch },
      success: function (result) {
        waiting(false);
        if(result == "success"){
          myAlert("success", "เพิ่มจุดบริการ สำเร็จ");
          $("#add_point").html("");
          show_point_table(rowperpage, page_selected);
        }else if(result == "exits"){
          sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', name_p + ' ซ้ำ! มีการใช้ชื่อนี้แล้ว');
        }else{
          sw_Alert('error', 'เพิ่มข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
        }          
      },
      error: function (err) {
          console.log("Add new Point ERROR : " + err);
      }
    });
    return false;
});


function delete_point_Row(id) { //================================ ลบข้อมูลจุดบริการ
    var fm_val = [id];
    var p_name = document.getElementById('name_p' + id).innerHTML;

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'mybtn btnOk',
            cancelButton: 'mybtn btnCan'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'ลบ ' + p_name,
        text: "โปรดยืนยัน ตกลงหรือไม่ ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '&nbsp;&nbsp;ตกลง&nbsp;&nbsp;',
        cancelButtonText: '&nbsp;&nbsp;ไม่&nbsp;&nbsp;',
        reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
          waiting();
          $.ajax({
            url: urlPoint,
            type: 'GET',
            crossDomain: true,
            data: { opt_k:'del', opt_id:id },
            success: function (result) {
              waiting(false);
              if(result == "success"){
                myAlert("success", "ข้อมูลถูกลบแล้ว !");
                show_point_table(rowperpage, page_selected);
              }else{
                sw_Alert('error', 'ลบข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
              }          
            },
            error: function (err) {
                console.log("Delete Point ERROR : " + err);
            }
          });   

      } else if (result.dismiss === Swal.DismissReason.cancel) {
          /*swalWithBootstrapButtons.fire(
              'ยกเลิก',
              'ข้อมูลของคุณยังไม่ถูกลบ :)',
              'error'
          )*/
      }
  })
}

function showPointEdit() {  //========================= แสดงหน้าแก้ไขข้อมูลสาขา
    var html = `     
    <div id="point_edit">    
      <form class="animate__animated animate__fadeIn" id="edit_point_form" style="padding:20px;">
        <div class="row mb-3 justify-content-md-center">
          <div style="font-size:1.5rem; text-align: center;">
            แก้ไขข้อมูลจุดบริการ
          </div>     
        </div>       
        <div class="row">
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa-solid fa-location-dot"></i></span>
              <input type="text" id="name_point" class="form-control" placeholder="ชื่อจุดบริการ" aria-label="Point name" required>
            </div>
            <div class="input-group mb-2">
              <span class="input-group-text" ><i class="fa-solid fa-file-lines"></i></span>
              <textarea class="form-control" id="desc_point" placeholder="รายละเอียด" aria-label="Description"></textarea>
            </div>
            <div class="input-group mb-3">
              <label class="input-group-text" for="selBranch"><i class="fa-solid fa-house"></i></label>
              <select class="form-select" id="selBranch">
                <option selected value="0">-- สาขา --</option>
              </select>
            </div>
        </div>  
        <div class="row mb-3 justify-content-md-center">
          <div class="row justify-content-center" style="text-align: center;">
              <button type="submit" class="mybtn btnOk">บันทึก</button>
              <button type="button" class="mybtn btnCan" id="cancel_edit_point">ยกเลิก</button>
              <input id="id_point" type="hidden">
          </div>   
        </div>      
      </form>
    </div>  
    `;
    $("#edit_point").html(html);
}

$(document).on("click", "#cancel_edit_point", function () { //========== ยกเลิกการแก้ไข จุดบริการ
    $("#edit_point").html("");
    show_point_table(rowperpage, page_selected);
});

function edit_point_Row(id) { //================================ เปิดหน้าแก้ไขข้อมูล จุดบริการ
    showPointEdit();
    $("#id_point").val(id);
    setDropdownList('selBranch', 'branch!A2:B', document.getElementById('branch_p' + id).innerHTML,0,1);
    $("#name_point").val(document.getElementById('name_p' + id).innerHTML);
    $("#desc_point").val(document.getElementById('desc_p' + id).innerHTML);
    $("#table_point").html("");
}

$(document).on("submit", "#edit_point_form", function () {  //===== ตกลงเปลี่ยนข้อมูล จุดบริการ
    let my_form = $(this);
    const id_p = my_form.find("#id_point").val();
    const name_p = my_form.find("#name_point").val();
    const desc_p = my_form.find("#desc_point").val();
    const sel_branch = document.getElementById("selBranch").options[document.getElementById("selBranch").selectedIndex].text;
    waiting();
    $.ajax({
      url: urlPoint,
      type: 'GET',
      crossDomain: true,
      data: { opt_k: 'edit', opt_id:id_p, opt_np:name_p, opt_dp:desc_p, opt_br:sel_branch },
      success: function (result) {
        waiting(false);
        if(result == "success"){
          waiting(false);
          myAlert("success", "แก้ไขข้อมูล สำเร็จ");
          $("#edit_point").html("");
          show_point_table(rowperpage, page_selected);
        }else if (result == "exits") {
            sw_Alert('warning', 'แก้ไขข้อมูล ไม่สำเร็จ', name_p + ' ซ้ำ! กรุณาเปลี่ยนใหม่');
        }else {
            sw_Alert('error', 'แก้ไขข้อมูล ไม่สำเร็จ', 'ระบบขัดข้อง โปรดลองใหม่ในภายหลัง');
        }          
      },
      error: function (err) {
          console.log("Edit Point ERROR : " + err);
      }
    });
    return false;
}); 