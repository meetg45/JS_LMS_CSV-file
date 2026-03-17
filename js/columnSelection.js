import { state } from "./state.js";
import { showHeaderPanel } from "./dom.js";
import { getData, showTable } from "./table.js";
import { search } from "./dom.js";

// if click columns btn show header and you select the header using checkbox
colSelection.addEventListener("click", function () {
  if (state.flagForClm) {
    showHeaderPanel.style.display = "block";
    state.flagForClm = false;
  } else {
    state.flagForClm = true;
    showHeaderPanel.style.display = "none";
  }

  if (state.firstTimeClick) {
    const data = getData();
    showHeaderPanel.innerHTML = "";
    Object.keys(data[0]).forEach((k) => {
      const label = document.createElement("label");
      label.innerHTML = `<input type="checkbox" value="${k}" class="hideCol" checked> ${k}`;

      label.querySelector("input").addEventListener("change", showTable);

      showHeaderPanel.appendChild(label);

      label.querySelector("input").addEventListener("change", () => {
        search.dispatchEvent(new Event("input"));
      });
    });
    state.firstTimeClick = false;
  }
});
