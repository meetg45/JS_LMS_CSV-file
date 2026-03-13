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
const popUpForm = document.getElementById("popUpForm");
const formData = document.getElementById("formData");
const closeBtn = document.getElementById("closeBtn");
const totalPages = document.getElementById("total-pages");
const colSeclection = document.getElementById("colSeclection");
const showHeaderPannel = document.getElementById("showHeaderPannel");

let fullData = [];
let filterData = [];
let tempData;
let minPage = 1;
let selectsRow = parseInt(rowsSelect.value);
let sortPos = {};
let activeCheckBox;
let flagForClm = true;
let firstTimeClick = true;

// save to LocalStorage
function savetoLocal() {
  const state={
    fullData,filterData,tempData,minPage,selectsRow,sortPos,searchText:search.value
  };
  localStorage.setItem("csvState",JSON.stringify(state));
}

// change the row selections  
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

// file load..
function changeData(event) {
  const reader = new FileReader();
  const file = event.target.files[0];

  reader.onloadstart = function () {
    loader.style.display = "block";
  };
  reader.onload = function (e) {
    minPage = 1;
    sortPos = {};
    showHeaderPannel.innerHTML = "";
    search.value = "";
    firstTimeClick = true;
    activeCheckBox = "";

    fullData = parseAllCsv(e.target.result);
    savetoLocal();
    tempData = [...fullData];
    filterData = fullData;
    showTable();
  };

  reader.onloadend = function (e) {
    loader.style.display = "none";
  };
  reader.readAsText(file);
}

// parse the csv file to json
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

// get data..
function getData() {
  const stIndex = (minPage - 1) * selectsRow;
  return filterData.slice(stIndex, stIndex + selectsRow);
}

// show table on frontend..
function showTable() {
  const data = getData();
  totalPages.textContent = `/ ${Math.ceil(filterData.length / selectsRow)}`;  //total page avilable

  const checkBox = document.querySelectorAll(".hideCol:checked");
  activeCheckBox =
    checkBox.length > 0
      ? Array.from(checkBox).map((val) => val.value)
      : Object.keys(data[0]);

  tableHead.innerHTML = "";
  const headerRow = document.createElement("tr");

  // header print and show on table.
  activeCheckBox.forEach((k) => {
    const th = document.createElement("th");
    th.textContent = k;
    headerRow.appendChild(th);
  });
  tableHead.append(headerRow);

  // data print and show on table.
  tableBody.innerHTML = "";
  data.forEach((e) => {
    const row = document.createElement("tr");
    activeCheckBox.forEach((val) => {
      const cell = document.createElement("td");
      cell.textContent = e[val];
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });
  const maxPage = filterData.length / selectsRow;
  pageNum.value = minPage;
  prev.disabled = minPage <= 1;
  next.disabled = minPage >= maxPage;
}

// next btn click show to next page.
next.addEventListener("click", function () {
  minPage++;
  savetoLocal();
  showTable();
});

// previous btn click show the previous page
prev.addEventListener("click", function () {
  minPage--;
  savetoLocal();
  showTable();
});

// accroding to page no. enter show the data 
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
  savetoLocal();
  showTable();
});

// click the table header sorting apply
tableHead.addEventListener("click", function (e) {
  const header = e.target.textContent;
  if (sortPos[header] === "asc") {
    sortPos[header] = "desc";
  } else {
    sortPos[header] = "asc";
  }
  filterData.sort((a, b) => {
    if (!isNaN(a[header]) && !isNaN(b[header])) {
      if (sortPos[header] == "asc") {
        return a[header] - b[header];
      }
      return b[header] - a[header];
    } else {
      if (sortPos[header] == "asc") {
        return a[header].localeCompare(b[header]);
      }
      return b[header].localeCompare(a[header]);
    }
  });

  tableBody.innerHTML = "";
  minPage = 1;
  savetoLocal();
  showTable();
});

// searching apply 
search.addEventListener("input", function () {
  const searchText = this.value.toLowerCase();

  filterData = tempData.filter((item) => {
    return JSON.stringify(item).toLowerCase().includes(searchText);
  });
  tableBody.innerHTML = "";
  minPage = 1;
  savetoLocal();
  showTable();
});

// reset the sorting and searching functionality.
reset.addEventListener("click", function () {
  search.value = "";
  sortPos = {};
  filterData = [...fullData];
  tempData=[...fullData];
  activeCheckBox = "";
  tableBody.innerHTML = "";
  minPage = 1;
  savetoLocal();
  showTable();
});

// click any tableBody data show that data.
tableBody.addEventListener("click", function (e) {
  formData.innerHTML = "";
  const clickRow = e.target.closest("tr");
  const objData = {};
  clickRow.querySelectorAll("td").forEach((cell, index) => {
    const header = tableHead.querySelectorAll("th")[index].textContent;
    objData[header] = cell.textContent;
  });

  Object.entries(objData).forEach(([key, val]) => {
    const p = document.createElement("p");

    p.textContent = `${key} : ${val}`;
    formData.appendChild(p);
  });
  document.getElementById("main").classList.add("blur");
  popUpForm.style.display = "block";
});

closeBtn.addEventListener("click", function () {
  popUpForm.style.display = "none";
  document.getElementById("main").classList.remove("blur");
});


window.addEventListener("load", function () {
  const saveData = localStorage.getItem("csvState");
  if (saveData) {
    const state=JSON.parse(saveData);
    fullData = state.fullData;
    filterData = state.filterData;
    tempData = state.tempData;
    minPage = state.minPage;
    selectsRow = state.selectsRow;
    sortPos=state.sortPos;
    search.value=state.searchText;
    showTable();
  }
});

// if click colums btn show header and you select the header using checkbox 
colSeclection.addEventListener("click", function () {
  if (flagForClm) {
    showHeaderPannel.style.display = "block";
    flagForClm = false;
  } else {
    flagForClm = true;
    showHeaderPannel.style.display = "none";
  }

  if (firstTimeClick) {
    const data = getData();
    showHeaderPannel.innerHTML = "";
    Object.keys(data[0]).forEach((k) => {
      const lable = document.createElement("label");
      lable.innerHTML = `<input type="checkbox" value="${k}" class="hideCol" checked> ${k}`;

      lable.querySelector("input").addEventListener("change", showTable);

      showHeaderPannel.appendChild(lable);
    });
    firstTimeClick = false;
  }
});
