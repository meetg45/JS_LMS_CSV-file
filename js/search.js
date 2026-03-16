import { search, tableBody } from "./dom.js";
import { state } from "./state.js";
import { savetoLocal } from "./storage.js";
import { showTable } from "./table.js";

function debounce(func,delay){
  let timer;
  return function(...args){
    clearTimeout(timer);
    timer=setTimeout(()=>{
      func.apply(this,args);
    },delay);
  }
}

// searching apply
function handleSearch() {
  const searchText = this.value.toLowerCase();
  state.searchText = searchText;

  state.filterData = state.tempData.filter((item) => {
    return state.activeCheckBox.some((col) => {
      const value = item[col];
      return value && value.toLowerCase().includes(searchText);
    });
  });
  const column = Object.keys(state.sortPos)[0];

  if (column) {
    const order = state.sortPos[column];

    state.filterData.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];

      if (!isNaN(parseFloat(valA)) && !isNaN(parseFloat(valB))) {
        return order === "asc" ? valA - valB : valB - valA;
      }

      return order === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  }

  state.minPage = 1;
  tableBody.innerHTML = "";
  state.minPage = 1;
  savetoLocal();
  showTable();
};

search.addEventListener("input",debounce(handleSearch,500));
