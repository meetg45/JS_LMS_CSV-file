import { next, prev, pageNum, tableBody } from "./dom.js";
import { state } from "./state.js";
import { savetoLocal } from "./storage.js";
import { showTable } from "./table.js";

// next btn click show to next page.
next.addEventListener("click", function () {
  const maxPage = Math.ceil(state.filterData.length / state.selectsRow);
  if (state.minPage < maxPage) {
    state.minPage++;
    savetoLocal();
    showTable();
  }
});

// previous btn click show the previous page
prev.addEventListener("click", function () {
  if (state.minPage > 1) {
    state.minPage--;
    savetoLocal();
    showTable();
  }
});

// according to page no. enter show the data
pageNum.addEventListener("change", function () {
  const enterVal = parseInt(this.value);
  const maxVal = Math.ceil(state.filterData.length / state.selectsRow);
  if (enterVal < 1) {
    state.minPage = 1;
  } else if (enterVal >= maxVal) {
    state.minPage = maxVal;
  } else {
    state.minPage = enterVal;
  }
  tableBody.innerHTML = "";
  savetoLocal();
  showTable();
});
