//======================== ประกาศตัวแปล Gobal ================================
const spreadSheetId = "1YmX0-Ndjw87X0VArhcxnFprw727Yg4tLsiljYi1Ht4c"; //== SheedId ไฟล์ข้อมูล database
var ss = SpreadsheetApp.openById(spreadSheetId);
const idFolderPicUser = '1ZyJPkhCislHyyihDjLCJoFojREdz8CFJ'; //Folder 01-UserPic
const idFolderPicBranch = '1Ks-wgG5TBaut46CYursvMjTSa1vz0ZJG'; //Folder 02-BranchPic

//===============================   START  =================================
const doGet = (event = {}) => {
  //use BetterLog Code: 1DSyxam1ceq72bMHsE6aOVeOl94X78WCwiYPytKi7chlg4x5GqiNXSw0l
  //Logger = BetterLog.useSpreadsheet(spreadSheetId);
  //Logger.log("Hello from BetterLog :)");
  // ?opt_k=add&opt_dt=12/07/2023 14:24:00&opt_nm=surasak&opt_tl=0810521771&opt_cm=hello babe
  const { parameter } = event;
  const { opt_k = 'Unknow', opt_dataSel = '', opt_selId = 0, opt_selNm = 1,
    opt_un = '', opt_pw = '123456', opt_dt = '',
    opt_sh = '', opt_pe = 12, opt_p = 1,
    opt_nm = '', opt_em = '', opt_tl = '', opt_br = '', opt_po = '', opt_lv = '111111111',
    opt_id = 0, opt_pw2 = '', opt_urlPic = ''
  } = parameter;

  const d_k = `${opt_k}`;
  //===============================  Access Get Data ===================================================
  if (d_k == "login") { //================================================================================
    const d_un = `${opt_un}`, d_pw = `${opt_pw}`, d_dt = `${opt_dt}`;
    const data = login(d_un, d_pw, d_dt);
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);

  } else if (d_k == "read") { //===========================================================================
    const d_sh = `${opt_sh}`, d_pe = `${opt_pe}`, d_p = `${opt_p}`;
    const data = rd_data([d_sh, d_pe, d_p]);
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);

  } else if (d_k == "add") { //===========================================================================
    const dataIn = [`${opt_nm}`, `${opt_em}`, `${opt_tl}`, `${opt_un}`, `${opt_pw}`, `${opt_br}`, `${opt_po}`, `${opt_lv}`, `${opt_dt}`];
    const res = add_data(dataIn);
    return ContentService.createTextOutput(res).setMimeType(ContentService.MimeType.TEXT);

  } else if (d_k == "readDataSel") { //===================================================================
    const d_dataSel = `${opt_dataSel}`, d_selId = `${opt_selId}`, d_selNm = `${opt_selNm}`;
    const values = my_get_val([d_dataSel]);
    sortByCol(values, 1); //==== เรียงข้อมูล values คอลัม 1 จากน้อยไปมากก่อนนำไปใช้งาน 
    let array_Arg = new Array();
    for (let i = 0; i < values.length; i++) {
      let jsonArg = new Object();
      jsonArg.id = values[i][d_selId];
      jsonArg.name = values[i][d_selNm];
      array_Arg.push(jsonArg);
    }
    return ContentService.createTextOutput(JSON.stringify(array_Arg)).setMimeType(ContentService.MimeType.JSON);

  } else if (d_k == "del") { //=========================================================================
    const dataIn = `${opt_id}`;
    var values_all = ss.getSheetByName('user');
    var values = my_get_val("user!A2:D");
    var result = "error";
    for (var i = 0; i < values.length; i++) {
      var row = values[i]
      if (row[0] == dataIn) { //=== เปรียบเทียบ
        if (!(row[3] == undefined || row[3] == null || row[3] == '')) {
          var id_pic = row[3].split('id=')[1];
          trashIt(id_pic);
        }
        values_all.deleteRow(i + 2);
        i = values.length;
        result = "success";
      }
    }
    return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.TEXT);

  } else if (d_k == "edit") { //===========================================================================
    const data_in = [`${opt_id}`, `${opt_nm}`, `${opt_em}`, `${opt_tl}`, `${opt_un}`, `${opt_br}`, `${opt_po}`, `${opt_urlPic}`, `${opt_dt}`];
    var values_all = ss.getSheetByName('user');
    var values = my_get_val("user!A2:A");
    var result = "error";
    if (data_id_exits(data_in[0], 0, data_in[4], 5, 'user!A2:F') > 0) {
      result = "exits";
    } else {
      for (var i = 0; i < values.length; i++) {
        var row = values[i];
        if (row[0] == data_in[0]) { //data_in[ id_user_sel,name_user,email_user,tel_user,uName,sel_branch,sel_pos,userPic,dt_modi]
          values_all.getRange(i + 2, 2, 1, 1).setValues([[data_in[2]]]); //=== (startRow,startCol,numRow,numCol)
          values_all.getRange(i + 2, 4, 1, 3).setValues([[data_in[7], data_in[1], data_in[4]]]);
          values_all.getRange(i + 2, 9, 1, 3).setValues([[data_in[6], data_in[5], data_in[3]]]);
          values_all.getRange(i + 2, 13, 1, 1).setValues([[data_in[8]]]);
          result = "success";
        }
      }
    }
    return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.TEXT);

  } else if (d_k == "resetpass") { //=====================================================================
    const dataIn = `${opt_id}`;
    var values_all = ss.getSheetByName('user');
    var values = my_get_val("user!A2:A");
    var pass = MD5('123456');
    var result = "error";
    for (var i = 0; i < values.length; i++) {
      var row = values[i];
      if (row[0] == dataIn) {
        values_all.getRange(i + 2, 7, 1, 1).setValues([[pass]]);
        result = "success";
      }
    }
    return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.TEXT);

  } else if (d_k == "changepass") { //====================================================================
    const data_in = [`${opt_id}`, `${opt_pw}`, `${opt_pw2}`, `${opt_dt}`];
    var values_all = ss.getSheetByName('user');
    var values = my_get_val("user!A2:G");
    var result = 'idwrong';
    var pass_old = MD5(data_in[1]);
    var pass = MD5(data_in[2]);
    for (var i = 0; i < values.length; i++) {
      var row = values[i];
      if (row[0] == data_in[0]) { //=== เปรียบเทียบ id
        if (row[6] == pass_old) {
          var data_set = [[pass]];
          var data_set2 = [[data_in[3]]];
          values_all.getRange(i + 2, 7, 1, 1).setValues(data_set); //=== (startRow,startCol,numRow,numCol)
          values_all.getRange(i + 2, 13, 1, 1).setValues(data_set2); //=== (startRow,startCol,numRow,numCol)
          i = values.length;
          result = 'success';
        } else {
          result = 'passwrong'
        }
      }
    }
    return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.TEXT);
  }
};

function doPost(e) { //========================== POST =============================================
  try {
    let obj = JSON.parse(e.postData.contents);
    const myFile = Utilities.newBlob(Utilities.base64Decode(obj.fdata), obj.mimeType, obj.fName);
    const folder = DriveApp.getFolderById(idFolderPicUser);
    const fileAdded = folder.createFile(myFile);
    const urlPic = fileAdded.getUrl();
    const idPic = fileAdded.getId();
    const rep = {
      'result': "success",
      'url': urlPic,
      'id': idPic,
      'name': obj.fileName
    };
    if (obj.fileId != '') {
      trashIt(obj.fileId);
    }
    const fullIdPic = 'https://drive.google.com/uc?export=view&id=' + idPic;
    var values_all = ss.getSheetByName('user');
    var values = my_get_val("user!A2:A");
    for (var i = 0; i < values.length; i++) {
      var row = values[i];
      if (row[0] == obj.idUser) {
        values_all.getRange(i + 2, 4, 1, 1).setValues([[fullIdPic]]);
      }
    }
    return ContentService.createTextOutput(JSON.stringify(rep)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    const rep = {
      'result': err
    };
    return ContentService.createTextOutput(JSON.stringify(rep)).setMimeType(ContentService.MimeType.JSON);
  }
}

//======================= ฟังก์ชั่นหลัก ========================================
function my_get_val(txt) { //=================== ดึงข้อมูลจากแทปชีท
  var range = Sheets.Spreadsheets.Values.get(spreadSheetId, txt);
  var my_val = range.values;
  return my_val;
}

function max_val(txt) { //==== หาค่าที่มากที่สุด
  var val_data = my_get_val(txt);
  var max_v = val_data.sort(function (a, b) { return b - a })[0][0];
  return max_v;
}

function data_id_exits(id, id_col, data, data_col, range) { //ค้นหาคำที่อยู่ในช่วงข้อมูล
  var values = my_get_val(range);
  var result = 0;
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    if (row[id_col] != id) {
      if (row[data_col] == data) {
        result++;
      }
    }
  }
  return result;
}

//=================================== Login ==========================================
function login(uname, pw, ts) {
  var ss = SpreadsheetApp.openById(spreadSheetId);
  var values_all = ss.getSheetByName('user');
  var values = my_get_val("user!A2:N");
  let arrayData = new Array();
  let objData = new Object();
  objData.result = false;
  for (var i = 0; i < values.length; i++) {
    var row = values[i]
    if (row[5] == uname && row[6] == MD5(pw)) { //=== เปรียบเทียบ username and password
      objData.id = row[0];
      objData.name = row[4];
      objData.lv = row[7];
      objData.picUrl = row[3];
      objData.job = row[8];
      objData.brName = row[9];
      objData.email = row[1];
      objData.tel = row[10];
      objData.uname = row[5];
      objData.result = true;
      values_all.getRange(i + 2, 14, 1, 1).setValues([[ts]]); //=== (startRow,startCol,numRow,numCol)
      i = values.length;
    }
  }
  var values_br = my_get_val("branch!A2:J");
  for (var i = 0; i < values_br.length; i++) {
    var row_br = values_br[i];
    if (row_br[1] == objData.brName) { //ชื่อสาขา
      objData.brId = row_br[0];
      objData.brName = row_br[1];
      objData.brName2 = row_br[2];
      objData.brAdd = row_br[3];
      objData.brTel = row_br[4];
      objData.brEmail = row_br[5];
      objData.brTax = row_br[6];
      objData.brLogo = row_br[7];
      objData.brQr = row_br[8];
      objData.brLine = row_br[9];
    }
  }
  arrayData.push(objData);
  return arrayData;
}

//============================= Read Data =============================================
function rd_data(data_in) { //========== อ่านข้อมูลผู้ใช้งาน strSearch, perpage, page
  const values = my_get_val("user!A3:N");
  sortByCol(values, 4); //==== เรียงข้อมูล values คอลัม 0-n จากน้อยไปมากก่อนนำไปใช้งาน 
  const search_str = data_in[0].split(" ");
  let array_Arg = new Array();
  for (let i = 0; i < values.length; i++) {
    const condition = search_str.some(el => values[i][4].includes(el));  //กรองชื่อ
    const condition2 = search_str.some(el => values[i][8].includes(el)); //ตำแหน่ง
    const condition3 = search_str.some(el => values[i][9].includes(el)); //สาขา
    if (condition || condition2 || condition3) {
      let jsonArg = new Object();
      jsonArg.id = values[i][0];
      jsonArg.name = values[i][4];
      jsonArg.uname = values[i][5];
      jsonArg.job = values[i][8];
      jsonArg.branch = values[i][9];
      jsonArg.email = values[i][1];
      jsonArg.tel = values[i][10];
      jsonArg.lv = values[i][7];
      jsonArg.urlpic = values[i][3];
      jsonArg.dtlog = values[i][13];
      array_Arg.push(jsonArg);
    }
  }
  let nAllData = array_Arg.length;         //==จำนวนข้อมูลทั้งหมด
  let nAllPage = Math.ceil(nAllData / data_in[1]); //=== จำนวนหน้าทั้งหมด
  let rowStart = ((data_in[2] - 1) * data_in[1]); //=== แถวเริ่มต้น ((page-1)*perpage)+1
  let rowEnd = (rowStart + +data_in[1]) - 1;         //=== แถวสุดท้าย rowStart + perpage - 1

  let array_Data = new Array();
  for (let i = rowStart; i <= rowEnd; i++) {
    if (array_Arg[i] != null) {
      array_Data.push(array_Arg[i]);
    }
  }
  let pageAll = new Object();
  pageAll.page = nAllPage;
  pageAll.rec = nAllData;
  pageAll.st = rowStart;
  pageAll.en = rowEnd;
  array_Data.push(pageAll);
  return array_Data;
}

//============================= Add Data =============================================
function add_data(data_in) {
  //dataIn = [`${opt_nm}`,`${opt_em}`,`${opt_tl}`,`${opt_un}`,`${opt_pw}`,`${opt_br}`,`${opt_po}`,`${opt_lv}`,`${opt_dt}`]; 
  var values_all = ss.getSheetByName('user');
  var values = my_get_val("user!F2:F");
  var val_n = values_all.getLastRow() + 1;
  var pass = MD5(data_in[4]);
  var found = values.find(el => el == data_in[3]); //=== ชื่อซ้ำหรือไม่
  found = (typeof found !== 'undefined') ? true : false;
  if (found) {
    return "exits";
  } else {
    var data_id = (max_val("user!A2:A") * 1) + 1;
    var data_set = [[data_id, data_in[1], '', '', data_in[0], data_in[3], pass, data_in[7], data_in[6], data_in[5], data_in[2], data_in[8], data_in[8], data_in[8]]];
    values_all.insertRowsAfter(val_n, 1);
    values_all.getRange(values_all.getLastRow() + 1, 1, 1, 14).setValues(data_set); //=== (startRow,startCol,numRow,numCol)
    return "success";
  }
}

/*==============================================================================================*/
function sortByCol(arr, colIndex, sortFn = 0) { //===== เรียงข้อมูล Array เลือก colum ได้
  if (sortFn === 0) {
    arr.sort(sortLessToMore);
  } else {
    arr.sort(sortMoreToLess);
  }

  function sortLessToMore(a, b) {
    a = a[colIndex];
    b = b[colIndex];
    return (a === b) ? 0 : (a < b) ? -1 : 1;
  }
  function sortMoreToLess(a, b) {
    a = a[colIndex];
    b = b[colIndex];
    return (a === b) ? 0 : (a < b) ? 1 : -1;
  }
}

function MD5(input, isShortMode) { //=MD5("YourStringToHash")  or =MD5("YourStringToHash", true) for short Hash
  var isShortMode = !!isShortMode; // Ensure to be bool for undefined type
  var txtHash = '';
  var rawHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.MD5,
    input,
    Utilities.Charset.UTF_8 // Multibyte encoding env compatibility
  );
  if (!isShortMode) {
    for (i = 0; i < rawHash.length; i++) {
      var hashVal = rawHash[i];
      if (hashVal < 0) {
        hashVal += 256;
      };
      if (hashVal.toString(16).length == 1) {
        txtHash += '0';
      };
      txtHash += hashVal.toString(16);
    };
  } else {
    for (j = 0; j < 16; j += 8) {
      hashVal = (rawHash[j] + rawHash[j + 1] + rawHash[j + 2] + rawHash[j + 3])
        ^ (rawHash[j + 4] + rawHash[j + 5] + rawHash[j + 6] + rawHash[j + 7]);
      if (hashVal < 0) {
        hashVal += 1024;
      };
      if (hashVal.toString(36).length == 1) {
        txtHash += "0";
      };
      txtHash += hashVal.toString(36);
    };
  };
  // change below to "txtHash.toUpperCase()" if needed
  return txtHash;
}

function trashIt(id) {
  var files = DriveApp.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    if (file.getId() == id) {
      console.log(file.getName() + ' ' + file.getId());
      file.setTrashed(true);
      return true
    }
  }
  return false
}
