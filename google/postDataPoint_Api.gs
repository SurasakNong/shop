//======================== ประกาศตัวแปล Gobal ================================
const spreadSheetId = "1YmX0-Ndjw87X0VArhcxnFprw727Yg4tLsiljYi1Ht4c"; //== SheedId ไฟล์ข้อมูล database
var ss = SpreadsheetApp.openById(spreadSheetId);

//===============================   START  =================================
const doGet = (event = {}) => {
    //use BetterLog Code: 1DSyxam1ceq72bMHsE6aOVeOl94X78WCwiYPytKi7chlg4x5GqiNXSw0l
    //Logger = BetterLog.useSpreadsheet(spreadSheetId);
    //Logger.log("Hello from BetterLog :)");
// ?opt_k=add&opt_dt=12/07/2023 14:24:00&opt_nm=surasak&opt_tl=0810521771&opt_cm=hello babe
    const { parameter } = event;
    const { opt_k = 'Unknow',
            opt_sh = '', opt_pe = 12, opt_p = 1,
            opt_np = '', opt_dp = '', opt_br = '',
            opt_id = ''
          } = parameter;

    const  d_k = `${opt_k}`;    
    //===============================  Access Get Data ===================================================
    if(d_k == "read"){ //===========================================================================
      const data_in = [`${opt_sh}`,`${opt_pe}`,`${opt_p}`];
      const values = my_get_val("point!A2:D"); 
      sortByCol(values,1); //==== เรียงข้อมูล values คอลัม 1 จากน้อยไปมากก่อนนำไปใช้งาน 
      const search_str = data_in[0].split(" "); 
      let array_Arg = new Array();
      for(let i = 0; i < values.length; i++){
        const condition = search_str.some(el => values[i][1].includes(el));  //กรองชื่อ
        const condition2 = search_str.some(el => values[i][2].includes(el)); //กรองรายละเอียด
        const condition3 = search_str.some(el => values[i][3].includes(el)); //กรองชื่อสาขา
        if(condition || condition2 || condition3){
          let jsonArg = new Object();
          jsonArg.id = values[i][0];
          jsonArg.name = values[i][1];
          jsonArg.desc = values[i][2];
          jsonArg.branch = values[i][3];
          array_Arg.push(jsonArg);
        }
      }
      const nAllData = array_Arg.length;         //==จำนวนข้อมูลทั้งหมด
      const nAllPage = Math.ceil(nAllData / data_in[1]); //=== จำนวนหน้าทั้งหมด
      const rowStart = ((data_in[2]-1)*data_in[1]); //=== แถวเริ่มต้น ((page-1)*perpage)+1
      const rowEnd = rowStart + +data_in[1]-1;         //=== แถวสุดท้าย rowStart + perpage - 1      
      let array_Data = new Array();
      for(let i = rowStart; i <= rowEnd; i++){  
        if(array_Arg[i] != null){      
          array_Data.push(array_Arg[i]);
        }
      }
      let pageAll = new Object();
      pageAll.page = nAllPage;
      pageAll.rec = nAllData;
      array_Data.push(pageAll);
      return ContentService.createTextOutput(JSON.stringify(array_Data)).setMimeType(ContentService.MimeType.JSON); 

    }else if(d_k == "add"){ //===========================================================================
      const data_in = [`${opt_np}`,`${opt_dp}`,`${opt_br}`]; 
      var res = '';
      var values_all = ss.getSheetByName('point');
      var values = my_get_val("point!B2:B"); 
      var val_n = values_all.getLastRow() + 1;
      var found = values.find(el => el == data_in[0]); //=== ชื่อซ้ำหรือไม่
      found = (typeof found !== 'undefined')?true:false;
      if(found){
        res = "exits";
      }else{
        var data_id = (max_val("point!A2:A")*1)+1;
        //data_in[name_p, desc_p, sel_branch]
        var data_set = [[data_id,data_in[0],data_in[1],data_in[2]]];
        values_all.insertRowsAfter(val_n,1);
        values_all.getRange(values_all.getLastRow() + 1, 1, 1, 4).setValues(data_set); //=== (startRow,startCol,numRow,numCol)
        res = "success";
      }
      return ContentService.createTextOutput(res).setMimeType(ContentService.MimeType.TEXT);      

    }else if (d_k == "del") { //=========================================================================
      const data_in = `${opt_id}`; 
      var values_all = ss.getSheetByName('point');
      var values = my_get_val("point!A2:A");
      var result = 'error';
      for (var i = 0; i < values.length; i++) {
        var row = values[i]
        if (row[0] == data_in) { //=== เปรียบเทียบ
          values_all.deleteRow(i+2);
          i = values.length;
          result = 'success';
        }
      }
      return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.TEXT);  

    }else if(d_k == "edit"){ //===========================================================================
      const data_in = [`${opt_id}`,`${opt_np}`,`${opt_dp}`,`${opt_br}`]; 
      var values_all = ss.getSheetByName('point');
      var values = my_get_val("point!A2:A");
      var result = "error";  
      if(data_id_exits(data_in[0],0,data_in[1],1,'point!A2:B') > 0){
          result = "exits";
      }else{
        for(var i=0;i<values.length;i++){ 
          var row = values[i];
          if(row[0] == data_in[0]){ //data_in[id_p, name_p, desc_p, sel_branch]
            var data_set = [[data_in[1],data_in[2],data_in[3]]];
            values_all.getRange(i+2, 2, 1, 3).setValues(data_set); //=== (startRow,startCol,numRow,numCol)
            result = "success";
          }
        }
      }
      return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.TEXT);          
    }
};

//======================= ฟังก์ชั่นหลัก ========================================
function my_get_val(txt) { //=================== ดึงข้อมูลจากแทปชีท
    var range = Sheets.Spreadsheets.Values.get(spreadSheetId, txt);  
    var my_val = range.values;
    return my_val;
}

function max_val(txt){ //==== หาค่าที่มากที่สุด
  var val_data = my_get_val(txt);
  var max_v = val_data.sort(function(a,b){return b-a})[0][0];
  return max_v;
}

function data_id_exits(id,id_col,data,data_col,range){ //ค้นหาคำที่อยู่ในช่วงข้อมูล
  var values = my_get_val(range);
  var result = 0;
  for(var i=0;i<values.length;i++){
    var row = values[i];
    if(row[id_col] != id){
      if(row[data_col] == data){
        result++;
      }      
    }
  }
  return result;  
}

/*==============================================================================================*/
function sortByCol(arr, colIndex, sortFn = 0){ //===== เรียงข้อมูล Array เลือก colum ได้
    if(sortFn === 0){
        arr.sort(sortLessToMore);
    }else{
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

function MD5( input, isShortMode ){ //=MD5("YourStringToHash")  or =MD5("YourStringToHash", true) for short Hash
    var isShortMode = !!isShortMode; // Ensure to be bool for undefined type
    var txtHash = '';
    var rawHash = Utilities.computeDigest(
                      Utilities.DigestAlgorithm.MD5,
                      input,
                      Utilities.Charset.UTF_8 // Multibyte encoding env compatibility
                  ); 
    if ( ! isShortMode ) {
        for ( i = 0; i < rawHash.length; i++ ) {
            var hashVal = rawHash[i];
            if ( hashVal < 0 ) {
                hashVal += 256;
            };
            if ( hashVal.toString( 16 ).length == 1 ) {
                txtHash += '0';
            };
            txtHash += hashVal.toString( 16 );
        };
    } else {
        for ( j = 0; j < 16; j += 8 ) {
            hashVal = ( rawHash[j]   + rawHash[j+1] + rawHash[j+2] + rawHash[j+3] )
                    ^ ( rawHash[j+4] + rawHash[j+5] + rawHash[j+6] + rawHash[j+7] );
            if ( hashVal < 0 ) {
                hashVal += 1024;
            };
            if ( hashVal.toString( 36 ).length == 1 ) {
                txtHash += "0";
            };
            txtHash += hashVal.toString( 36 );
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