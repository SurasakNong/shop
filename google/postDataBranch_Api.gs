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
  const { opt_k = 'Unknow', opt_sh = '', opt_pe = 12, opt_p = 1,
    opt_nmbr = 'Unknow', opt_nmbbr = 'Unknow', opt_addbr = '', opt_embr = '', opt_tlbr = '', opt_tx = '', opt_urlbr = '', opt_qrbr = '', opt_ln = '',
    opt_id = 0
  } = parameter;

  const d_k = `${opt_k}`;
  //===============================  Access Get Data ===================================================
  if (d_k == "read") { //===========================================================================
    const data_in = [`${opt_sh}`, `${opt_pe}`, `${opt_p}`];
    const values = my_get_val("branch!A2:J");
    sortByCol(values, 1); //==== เรียงข้อมูล values คอลัม 1 จากน้อยไปมากก่อนนำไปใช้งาน 
    const search_str = data_in[0].split(" ");
    let array_Arg = new Array();
    for (let i = 0; i < values.length; i++) {
      const condition = search_str.some(el => values[i][1].includes(el));  //กรองชื่อสาขา
      const condition2 = search_str.some(el => values[i][2].includes(el)); //กรองชื่อธุรกิจ
      if (condition || condition2) {
        let jsonArg = new Object();
        jsonArg.id = values[i][0];
        jsonArg.name = values[i][1];
        jsonArg.name2 = values[i][2];
        jsonArg.address = values[i][3];
        jsonArg.tel = values[i][4];
        jsonArg.email = values[i][5];
        jsonArg.tax = values[i][6];
        jsonArg.urlLogo = values[i][7];
        jsonArg.urlQrcode = values[i][8];
        jsonArg.codeQrcode = values[i][9];
        array_Arg.push(jsonArg);
      }
    }
    let nAllData = array_Arg.length;         //==จำนวนข้อมูลทั้งหมด
    let nAllPage = Math.ceil(nAllData / data_in[1]); //=== จำนวนหน้าทั้งหมด
    let rowStart = ((data_in[2] - 1) * data_in[1]); //=== แถวเริ่มต้น ((page-1)*perpage)+1
    let rowEnd = rowStart + +data_in[1] - 1;         //=== แถวสุดท้าย rowStart + perpage - 1

    let array_Data = new Array();
    for (let i = rowStart; i <= rowEnd; i++) {
      if (array_Arg[i] != null) {
        array_Data.push(array_Arg[i]);
      }
    }
    let pageAll = new Object();
    pageAll.page = nAllPage;
    pageAll.rec = nAllData;
    array_Data.push(pageAll);
    return ContentService.createTextOutput(JSON.stringify(array_Data)).setMimeType(ContentService.MimeType.JSON);

  } else if (d_k == "add") { //===========================================================================
    const data_in = [`${opt_nmbr}`, `${opt_nmbbr}`, `${opt_addbr}`, `${opt_tlbr}`, `${opt_embr}`, `${opt_tx}`, `${opt_urlbr}`, `${opt_qrbr}`, `${opt_ln}`];
    var res = '';
    var values_all = ss.getSheetByName('branch');
    var values = my_get_val("branch!B2:B");
    var val_n = values_all.getLastRow() + 1;
    var found = values.find(el => el == data_in[0]); //=== ชื่อซ้ำหรือไม่
    found = (typeof found !== 'undefined') ? true : false;
    if (found) {
      res = "exits";
    } else {
      var data_id = (max_val("branch!A2:A") * 1) + 1;
      var data_set = [[data_id, data_in[0], data_in[1], data_in[2], data_in[3], data_in[4], data_in[5], data_in[6], data_in[7], data_in[8]]];
      values_all.insertRowsAfter(val_n, 1);
      values_all.getRange(values_all.getLastRow() + 1, 1, 1, 10).setValues(data_set); //=== (startRow,startCol,numRow,numCol)
      res = "success";
    }
    return ContentService.createTextOutput(res).setMimeType(ContentService.MimeType.TEXT);

  } else if (d_k == "del") { //=========================================================================
    const data_in = `${opt_id}`;
    var values_all = ss.getSheetByName('branch');
    var values = my_get_val("branch!A2:J");
    var result = "error";
    var id_pic_logo = "";
    var id_pic_qr = "";
    for (var i = 0; i < values.length; i++) {
      var row = values[i]
      if (row[0] == data_in) { //=== เปรียบเทียบ
        if (row[7].includes("id=")) {
          id_pic_logo = row[7].split('id=')[1];
          if (!(id_pic_logo == '' || id_pic_logo == undefined)) { trashIt(id_pic_logo); }
        }
        if (row[8].includes("id=")) {
          id_pic_qr = row[8].split('id=')[1];
          if (!(id_pic_qr == '' || id_pic_qr == undefined)) { trashIt(id_pic_qr); }
        }
        values_all.deleteRow(i + 2);
        i = values.length;
        result = "success";
      }
    }
    return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.TEXT);

  } else if (d_k == "edit") { //===========================================================================
    const data_in = [`${opt_id}`, `${opt_nmbr}`, `${opt_nmbbr}`, `${opt_addbr}`, `${opt_tlbr}`, `${opt_embr}`, `${opt_tx}`,
    `${opt_urlbr}`, `${opt_qrbr}`, `${opt_ln}`];
    var values_all = ss.getSheetByName('branch');
    var values = my_get_val("branch!A2:A");
    var result = "error";
    if (data_id_exits(data_in[0], 0, data_in[1], 1, 'branch!A2:B') > 0) {
      result = "exits";
    } else {
      for (var i = 0; i < values.length; i++) {
        var row = values[i];
        if (row[0] == data_in[0]) {
          var data_set = [[data_in[1], data_in[2], data_in[3], data_in[4], data_in[5], data_in[6], data_in[7], data_in[8], data_in[9]]];
          values_all.getRange(i + 2, 2, 1, 9).setValues(data_set); //=== (startRow,startCol,numRow,numCol)
          result = "success";
        }
      }
    }
    return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.TEXT);

  }
};

function doPost(e) { //========================== POST =============================================
  let obj = JSON.parse(e.postData.contents);
  if (obj.opt_k == "upBranchLogo") {
    try {
      const myFile = Utilities.newBlob(Utilities.base64Decode(obj.fdata), obj.mimeType, obj.fName);
      const folder = DriveApp.getFolderById(idFolderPicBranch);
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
      var fullIdPic = 'https://drive.google.com/uc?id=' + idPic;
      var values_all = ss.getSheetByName('branch');
      var values = my_get_val("branch!A2:A");
      for (var i = 0; i < values.length; i++) {
        var row = values[i];
        if (row[0] == obj.idBranch) {
          values_all.getRange(i + 2, 8, 1, 1).setValues([[fullIdPic]]);
        }
      }
      return ContentService.createTextOutput(JSON.stringify(rep)).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      const rep = {
        'result': err
      };
      return ContentService.createTextOutput(JSON.stringify(rep)).setMimeType(ContentService.MimeType.JSON);
    }
  } else if (obj.opt_k == "upBranchQr") {
    try {
      const myFile = Utilities.newBlob(Utilities.base64Decode(obj.fdata), obj.mimeType, obj.fName);
      const folder = DriveApp.getFolderById(idFolderPicBranch);
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
      var fullIdPic = 'https://drive.google.com/uc?id=' + idPic;
      var values_all = ss.getSheetByName('branch');
      var values = my_get_val("branch!A2:A");
      for (var i = 0; i < values.length; i++) {
        var row = values[i];
        if (row[0] == obj.idBranch) {
          values_all.getRange(i + 2, 9, 1, 1).setValues([[fullIdPic]]);
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

function data_id_exits(id, id_col, data, data_col, range) { //ค้นหาคำที่อยู่ในช่วงข้อมูลซ้ำหรือไม่
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

function MD5(input, isShortMode) { // =MD5("YourStringToHash") or =MD5("YourStringToHash", true) for short Hash
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

function trashIt(fileId) { //ลบไฟล์รูปภาพใน Google Drive
  var file;
  var rep = false;
  try {
    file = DriveApp.getFileById(fileId);
    rep = true;
  }
  catch (fileE) {
    try {
      file = DriveApp.getFolderById(fileId);
    }
    catch (folderE) {
      throw folderE;
    }
  }
  file.setTrashed(true);
  return rep;
}