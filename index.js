const fileInput = document.getElementById("csvFile");
const tableBody = document.getElementById("table-body");
const tableHead = document.getElementById("table-head");


function changeData(event) {
  const reader= new FileReader();

  reader.onload=function(e){
    csvTextCache=e.target.result;
    const data=csvToJSON(csvTextCache, selectsRow);
    showTable(data);
  }
  reader.readAsText(file)
}

let start=1;
function csvToJSON(csvTextCache, selectsRow) {
  const data =[];
  const rows=csvTextCache.split("/n");
  const headers=rows[0].split(",");

  for (let i = start; i < start+selectsRow; i++) {
    const values=rows[i].split(",");
    let obj = {};
    for (let j = 0; j < values.length; j++) {
      obj[headers[j]] = values[j];
    }
    data.push(obj);
  }
  start=start+selectsRow;
  return data;
}

function showTable(data) {  
  if(flag){
    const headerRow=document.createElement("tr");
    Object.keys(data[0]).forEach((k)=>{
      const th=document.createElement("th");
      th.textContent=k;
      headerRow.appendChild(th);
    });
    tableHead.append(headerRow);
    flag=false;
  }

  data.forEach((e) => {
    const row=document.createElement("tr");
    Object.values(e).forEach((val) => {
      const cell=document.createElement("td");
      cell.textContent=val;
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });
}

