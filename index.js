const fileInput = document.getElementById("csvFile");
const tableBody = document.getElementById("table-body");
const tableHead = document.getElementById("table-head");
const rowsSelect = document.getElementById("rows");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const pageNum = document.getElementById("page-num");
const search = document.getElementById("search");
const loader = document.getElementById("loader");
const reset = document.getElementById("reset");

let fullData = [];
let filterData = [];
let tempData;
let minPage = 1;
let selectsRow = parseInt(rowsSelect.value);

rowsSelect.addEventListener("change", function () {
  tableBody.innerHTML = "";
  const oldRows = selectsRow;
  const curFirstRow = (minPage - 1) * oldRows + 1;
  selectsRow = parseInt(this.value);
  minPage = Math.ceil(curFirstRow / selectsRow);

  if (filterData.length > 0) {
    showTable();
  }
});

fileInput.addEventListener("change", changeData);

function changeData(event) {
  const reader = new FileReader();
  const file = event.target.files[0];

  reader.onloadstart = function () {
    loader.style.display = "block";
    console.log("loading start");
  };
  reader.onload = function (e) {
    fullData = parseAllCsv(e.target.result);
    tempData=[...fullData];
    filterData=fullData;
    showTable();
  };

  reader.onloadend = function (e) {
    loader.style.display = "none";
    console.log("loading end");
  };
  reader.readAsText(file);
}

// function csvToJSON(csvTextCache, selectsRow) {
//   const data =[];
//   const rows=csvTextCache.split("\n");
//   const headers=rows[0].split(",");

//   for (let i = start; i < Math.min(start+selectsRow,csvTextCache.split("\n").length); i++) {
//     const values=rows[i].split(",");
//     let obj = {};
//     for (let j = 0; j < values.length; j++) {
//       obj[headers[j]] = values[j];
//     }
//     data.push(obj);
//   }
//   start=start+selectsRow;
//   return data;
// }

function parseAllCsv(csvText) {
  const rows = csvText.split("\n");
  const headers = rows[0].split(",");
  const data = [];
  for (let i = 1; i < rows.length; i++) {
    const values = rows[i].split(",");
    let obj = {};
    for (let j = 0; j < values.length; j++) {
      obj[headers[j]] = values[j];
    }
    data.push(obj);
  }
  return data;
}

function getData() {
  const stIndex = (minPage - 1) * selectsRow;
  return filterData.slice(stIndex, stIndex+selectsRow);
}

function showTable() {
  const data = getData();
  if (tableHead.innerHTML === "") {
    const headerRow = document.createElement("tr");
    Object.keys(data[0]).forEach((k) => {
      const th = document.createElement("th");
      th.textContent = k;
      headerRow.appendChild(th);
    });
    tableHead.append(headerRow);
  }

  tableBody.innerHTML = "";
  data.forEach((e) => {
    const row = document.createElement("tr");
    Object.values(e).forEach((val) => {
      const cell = document.createElement("td");
      cell.textContent = val;
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });
  const maxPage = filterData.length / selectsRow;
  pageNum.value = minPage;
  prev.disabled = minPage <= 1;
  next.disabled = minPage >= maxPage;
}

next.addEventListener("click", function () {
  minPage++;
  showTable();
});

prev.addEventListener("click", function () {
  minPage--;
  showTable();
});

pageNum.addEventListener("change", function () {
  const enterVal = parseInt(this.value);
  const maxVal = Math.ceil(filterData.length / selectsRow);
  if (enterVal < 1) {
    minPage = 1;
  } else if (enterVal >= maxVal) {
    minPage = maxVal;
  } else {
    minPage = enterVal;
  }
  tableBody.innerHTML = "";
  showTable();
});

let sortPos = {};
tableHead.addEventListener("click", function (e) {
  const header = e.target.textContent;
  if (sortPos[header] === "asc") {
    sortPos[header] = "desc";
  } else {
    sortPos[header] = "asc";
  }
  // console.log(sortPos);
  filterData.sort((a, b) => {
    if (!isNaN(a[header]) && !isNaN(b[header])) {
      if (sortPos[header] == "asc") {
        return a[header] - b[header];
      } else {
        return b[header] - a[header];
      }
    } else {
      if (sortPos[header] == "asc") {
        return a[header].localeCompare(b[header]);
      } else {
        return b[header].localeCompare(a[header]);
      }
    }
  });
  tableBody.innerHTML = "";
  minPage = 1;
  showTable();
});

search.addEventListener("change", function () {
  const searchText = this.value;
  filterData = fullData.filter((item) => {
    return Object.values(item).some((val) => {
      return String(val).toLowerCase().includes(searchText);
    });
  });
  tableBody.innerHTML = "";
  minPage = 1;
  showTable();
});

reset.addEventListener('click',function(){
  search.value="";
  sortPos={};
  filterData=tempData;
  tableBody.innerHTML = "";
  minPage = 1;
  showTable();
})  

tableBody.addEventListener('click',function(e){
  const clickData=e.target.closest("tr");
  console.log(clickData);
  const objData={};
})