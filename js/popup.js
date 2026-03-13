import { tableBody, formData, tableHead, popUpForm, closeBtn } from "./dom.js";

const main = document.getElementById("main");

// click any tableBody popup that data.
tableBody.addEventListener("click", function (e) {
  formData.innerHTML = "";
  const clickRow = e.target.closest("tr");
  const objData = {};
  clickRow.querySelectorAll("td").forEach((cell, index) => {
    const header = tableHead.querySelectorAll("th")[index].textContent;
    objData[header] = cell.textContent;
  });

  Object.entries(objData).forEach(([key, val]) => {
    const p = document.createElement("p");
    p.textContent = `${key} : ${val}`;
    formData.appendChild(p);
  });
  main.classList.add("blur");
  popUpForm.style.display = "flex";
});

closeBtn.addEventListener("click", function () {
  popUpForm.style.display = "none";
  main.classList.remove("blur");
});

window.addEventListener("click", function (e) {
  if (e.target.id === "popUpForm") {
    popUpForm.style.display = "none";
    main.classList.remove("blur");
  }
}); 