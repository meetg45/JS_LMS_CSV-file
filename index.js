const fileInput = document.getElementById("csvFile");
const tableBody = document.getElementById("table-body");
const tableHead = document.getElementById("table-head");
const rowsSelect=document.getElementById("rows");
const prev=document.getElementById("prev");
const next=document.getElementById("next"); 
const pageNum=document.getElementById("page-num");

let start=1;
let flag=true;
let csvTextCache="";
let fullData=[];
let minPage=1;
let selectsRow=parseInt(rowsSelect.value);
let maxPage=(csvTextCache.split("\n").length-1)/selectsRow;

rowsSelect.addEventListener("change",function(){
  start=minPage*selectsRow-selectsRow+1;
  
  tableBody.innerHTML=""; 
  selectsRow=parseInt(this.value);
  
  console.log(start);
  if(((start-1)%selectsRow) ==0){
    minPage=Math.ceil(start/selectsRow);
  }else{
    minPage=Math.ceil(start/selectsRow)+1;
  }
  if(csvTextCache){
    const data=csvToJSON(csvTextCache, selectsRow);
    showTable(data);
  }

})

fileInput.addEventListener('change',changeData);

function changeData(event) {
  const reader= new FileReader();
  const file=event.target.files[0];
  reader.onload=function(e){
    csvTextCache=e.target.result;
    if(fullData.length==0){
      fullData=parseAllCsv(csvTextCache);
    }
    const data=csvToJSON(csvTextCache, selectsRow);
    showTable(data);
  }
  reader.readAsText(file)
}

function csvToJSON(csvTextCache, selectsRow) {
  const data =[];
  const rows=csvTextCache.split("\n");
  const headers=rows[0].split(",");

  for (let i = start; i < Math.min(start+selectsRow,csvTextCache.split("\n").length); i++) {
    const values=rows[i].split(",");
    let obj = {};
    for (let j = 0; j < values.length; j++) {
      obj[headers[j]] = values[j];
    }
    data.push(obj);
  }
  start=start+selectsRow;
  // console.log(csvTextCache.split("\n").length-1);
  // console.log(data.sort((a,b)=>a[first_name].localCompare(b[first_name])));
  return data;
}
function parseAllCsv(){
  const rows=csvTextCache.split("\n");
  const headers=rows[0].split(",");
  // const data=[];
  for(let i=1;i<rows.length;i++){
    const values=rows[i].split(",");
    let obj={};
    for(let j=0;j<values.length;j++){
      obj[headers[j]]=values[j];
    }
    fullData.push(obj);
  }
}
console.log(fullData);

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
  pageNum.textContent=minPage;
}

next.addEventListener('click',function(){
  minPage++;
  // start=minPage*selectsRow-selectsRow+1;
  tableBody.innerHTML="";
  console.log(start);
  
  const data=csvToJSON(csvTextCache, selectsRow);
  showTable(data);
  if(minPage>1){
      prev.disabled=false;
    }
    if(minPage>=(csvTextCache.split("\n").length-1)/selectsRow){
      next.disabled=true;
    }
})

prev.addEventListener('click',function(){
  // console.log(start);
    tableBody.innerHTML="";
    minPage--;
    start=minPage*selectsRow-selectsRow+1;
    console.log(start);
    const data=csvToJSON(csvTextCache,selectsRow);
    showTable(data);
    if(minPage==1){ 
      prev.disabled=true;
    }
    if(minPage<(csvTextCache.split("\n").length-1)/selectsRow){
      next.disabled=false;
    }
})

