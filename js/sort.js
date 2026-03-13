import { tableHead, tableBody } from "./dom.js";
import { state } from "./state.js";
import { savetoLocal } from "./storage.js";
import { showTable } from "./table.js";

// click the table header sorting apply
tableHead.addEventListener("click", function (e) {
  const header = e.target.textContent;

  const currentSort = state.sortPos[header] === "asc" ? "desc" : "asc";
  state.sortPos = {};
  state.sortPos[header] = currentSort;
  state.filterData.sort((a, b) => {
    if (!isNaN(a[header]) && !isNaN(b[header])) {
      return currentSort === "asc"
        ? a[header] - b[header]
        : b[header] - a[header];
    } else {
        return currentSort === "asc"
        ? a[header].localeCompare(b[header])
        : b[header].localeCompare(a[header]);
    }
  });

  tableBody.innerHTML = "";
  state.minPage = 1;
  savetoLocal();
  showTable();
});
