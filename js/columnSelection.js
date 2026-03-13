import { state } from "./state.js";
import { showHeaderPannel } from "./dom.js";
import { getData, showTable } from "./table.js";
import { search } from "./dom.js";

// if click colums btn show header and you select the header using checkbox
colSeclection.addEventListener("click", function () {
  if (state.flagForClm) {
    showHeaderPannel.style.display = "block";
    state.flagForClm = false;
  } else {
    state.flagForClm = true;
    showHeaderPannel.style.display = "none";
  }

  if (state.firstTimeClick) {
    const data = getData();
    showHeaderPannel.innerHTML = "";
    Object.keys(data[0]).forEach((k) => {
      const lable = document.createElement("label");
      lable.innerHTML = `<input type="checkbox" value="${k}" class="hideCol" checked> ${k}`;

      lable.querySelector("input").addEventListener("change", showTable);

      showHeaderPannel.appendChild(lable);

      lable.querySelector("input").addEventListener("change", () => {
        search.dispatchEvent(new Event("input"));
      });
    });
    state.firstTimeClick = false;
  }
});
