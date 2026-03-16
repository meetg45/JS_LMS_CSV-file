import { fileInput, loader } from "./js/dom.js";
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

    // state.fullData = parseAllCsv(e.target.result);
    // state.tempData = [...(state.fullData)];
    // state.filterData = state.fullData;
    const data = parseAllCsv(e.target.result);

    state.fullData = data;
    state.filterData = [...data];
    state.tempData = [...data];

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

  const savedState = JSON.parse(saved);
  Object.assign(state, savedState);
  
  state.firstTimeClick=true;

  if (state.filterData.length > 0) {
    showTable();
  }

});