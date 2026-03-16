import { fileInput, loader , shwoPagination } from "./js/dom.js";
import { parseAllCsv } from "./js/csvParser.js";
import { showTable } from "./js/table.js";
import { savetoLocal } from "./js/storage.js";
import { state } from "./js/state.js";

import "./js/rowsSelection.js";
import "./js/reset.js";
import "./js/pagination.js";
import "./js/search.js";
import "./js/sort.js";
import "./js/popup.js";
import "./js/columnSelection.js";

fileInput.addEventListener("change", changeData);

// file load..
function changeData(event) {
  const reader = new FileReader();
  const file = event.target.files[0];

  reader.onloadstart = function () {
    loader.style.display = "block";
  };
  reader.onload = function (e) {
    state.minPage = 1;
    state.sortPos = {};
    search.value = "";
    showHeaderPannel.innerHTML = "";
    state.firstTimeClick = true;
    state.activeCheckBox = "";

    const data = parseAllCsv(e.target.result);

    state.fullData = data;
    state.filterData = [...data];
    state.tempData = [...data];

    shwoPagination.style.display="block";
    savetoLocal();
    showTable();
  };

  reader.onloadend = function (e) {
    loader.style.display = "none";
  };
  reader.readAsText(file);
}
window.addEventListener("load", function () {

  const saved = localStorage.getItem("csvState");

  if (!saved) return;
  
  shwoPagination.style.display="block";
  const savedState = JSON.parse(saved);
  Object.assign(state, savedState);

  state.firstTimeClick=true;

  if (state.filterData.length > 0) {
    showTable();
  }

});