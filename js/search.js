import { search, tableBody } from "./dom.js";
import { state } from "./state.js";
import { savetoLocal } from "./storage.js";
import { showTable } from "./table.js";

// searching apply 
search.addEventListener("input", function () {
  const searchText = this.value.toLowerCase();
  state.searchText = searchText;
  const baseData = Object.keys(state.sortPos).length > 0 ? state.filterData : state.tempData;

  state.filterData = baseData.filter((item) => {
    return state.activeCheckBox.some((col) => {
      const value = item[col];
      return value.toLowerCase().includes(searchText);
    });
  });

  tableBody.innerHTML = "";
  state.minPage = 1;
  savetoLocal();
  showTable();
});
