import { rowsSelect,tableBody } from "./dom.js";
import { state } from "./state.js";
import { showTable } from "./table.js";

// change the row selections
rowsSelect.addEventListener("change", function () {
  tableBody.innerHTML = "";
  const oldRows = state.selectsRow;
  const curFirstRow = (state.minPage - 1) * oldRows + 1;
  state.selectsRow = parseInt(this.value);
  state.minPage = Math.ceil(curFirstRow / state.selectsRow);

  if (state.filterData.length > 0) {
    showTable();
  }
});