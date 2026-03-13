import { state } from "./state.js";

// save to LocalStorage
export function savetoLocal() {
  localStorage.setItem("csvState", JSON.stringify(state));
}

export function loadFromLocal() {

  const saved = localStorage.getItem("csvState");

  if (!saved) return null;

  return JSON.parse(saved);

}