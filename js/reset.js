import { reset, search,tableBody } from "./dom.js";
import { state } from "./state.js";
import { showTable } from "./table.js";
import { savetoLocal } from "./storage.js";

// reset the sorting and searching functionality.
reset.addEventListener("click", function () {
  search.value = "";
  state.sortPos = {};
  state.filterData = [...state.fullData];
  state.tempData=[...state.fullData];
  state.activeCheckBox = null;
  tableBody.innerHTML = "";
  state.minPage = 1;
  savetoLocal();
  showTable();
});
