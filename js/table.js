import { state } from "./state.js";
import { tableBody, tableHead, totalPages, pageNum, prev, next } from "./dom.js";

export function getData() {
  const stIndex = (state.minPage - 1) * state.selectsRow;
  return state.filterData.slice(stIndex, stIndex + state.selectsRow);
}

// show table on frontend..
export function showTable() {
  const data = getData();
  totalPages.textContent = `/ ${Math.ceil(state.filterData.length / state.selectsRow)}`; //total page avilable

  const checkBox = document.querySelectorAll(".hideCol:checked");
  state.activeCheckBox =
    checkBox.length > 0
      ? Array.from(checkBox).map((val) => val.value)
      : Object.keys(data[0]);

  tableHead.innerHTML = "";
  const headerRow = document.createElement("tr");

  // header print and show on table.
  state.activeCheckBox.forEach((k) => {
    const th = document.createElement("th");
    th.textContent = k;
    headerRow.appendChild(th);
  });
  tableHead.append(headerRow);

  // data print and show on table.
  tableBody.innerHTML = "";
  data.forEach((e) => {
    const row = document.createElement("tr");
    state.activeCheckBox.forEach((val) => {
      const cell = document.createElement("td");
      cell.textContent = e[val];
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });
  const maxPage = Math.ceil(state.filterData.length / state.selectsRow);
  pageNum.value = state.minPage;
  prev.disabled = state.minPage <= 1;
  next.disabled = state.minPage >= maxPage;
}
