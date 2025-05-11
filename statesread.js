import { stateNames, stateCodes } from "./states.js";
import {
  formatSingleAssessmentPill,
  processAssessmentData,
} from "./assessments.js";
import { formatSingleProgramPill, processProgramData } from "./programs.js";
import { init as statesInit, states } from "./states.js";
import { clearStateHover, clearStateSelected, HOVER_CLASS, SELECTED_CLASS } from "./util.js";

const init = () => {
  statesInit();
  document.body.onload = onMapLoad;
};

const isStateElement = (el) => {
  const id = el.getAttribute("id");
  return id !== "" && stateCodes.includes(id.toUpperCase());
};

const onMapClick = (e) => {
  if (!states["CA"].element) {
    // No data yet.
    return;
  }
  if (!isStateElement(e.target)) {
    showPopup(false);
    clearStateHover();
    return;
  }
  let id = e.target.getAttribute("id");
  const state = e.target;
  clearStateHover();
  clearStateSelected();
  showPopup(true, e.clientX, e.clientY, id);
  state.classList.add(SELECTED_CLASS);
};

const getPopupTitle = (stateCode) => {
  return "<h1>" + states[stateCode].name + "</h1>";
};

const formatPopupContent = (stateCode) => {
  const approvedAssessments = states[stateCode].approvedAssessments;
  const approvedPrograms = states[stateCode].approvedPrograms;

  const formattedApprovedAssessments = approvedAssessments.length > 0 ?
      approvedAssessments.map(formatSingleAssessmentPill).join("") : '∅';
  const formattedApprovedPrograms = approvedPrograms.length > 0 ?
      approvedPrograms.map(formatSingleProgramPill).join("") : '∅';

  return `
   ${getPopupTitle(stateCode)}
   <h2 class="assessment">Approved assessments</h2>
   ${formattedApprovedAssessments}
   <h2 class="program">Approved programs</h2>
   ${formattedApprovedPrograms}`;
};

const showPopup = (show, clientX, clientY, id) => {
  const el = document.getElementById("popup");
  el.style.display = show ? "block" : "none";
  if (show) {
    const stateCode = id.toUpperCase();
    el.innerHTML = formatPopupContent(stateCode);
  }
};

const processMap = (mapEl) => {
  const allPaths = [...mapEl.querySelectorAll("path")];
  const stateEls = allPaths.filter((p) => isStateElement(p));
  const svgEl = document.querySelector("svg");
  for (let stateEl of stateEls) {
    const stateCode = stateEl.getAttribute("id");
    const stateCodeUpper = stateCode.toUpperCase();
    states[stateCodeUpper].element = stateEl;

    const assessmentCount = states[stateCodeUpper].approvedAssessments.length;
    const programCount = states[stateCodeUpper].approvedPrograms.length;

    if (assessmentCount > 0) {
      svgEl.querySelector("#" + stateCode + "-assessment-text").textContent =
        assessmentCount;
    } else {
      svgEl.querySelector(
        "#" + stateCode + "-assessment-circle"
      ).style.display = "none";
      svgEl.querySelector("#" + stateCode + "-assessment-text").textContent =
        "";
    }
    svgEl.querySelector(
      "#" + stateCode + "-assessment-circle"
    ).style.pointerEvents = "none";
    svgEl.querySelector(
      "#" + stateCode + "-assessment-text"
    ).style.pointerEvents = "none";
    if (programCount > 0) {
      svgEl.querySelector("#" + stateCode + "-program-text").textContent =
        programCount;
    } else {
      svgEl.querySelector("#" + stateCode + "-program-circle").style.display =
        "none";
      svgEl.querySelector("#" + stateCode + "-program-text").textContent = "";
    }
    svgEl.querySelector(
      "#" + stateCode + "-program-circle"
    ).style.pointerEvents = "none";
    svgEl.querySelector("#" + stateCode + "-program-text").style.pointerEvents =
      "none";
  }

  const assessmentText = svgEl.querySelector("#wa-assessment-text");
  assessmentText.textContent = "12";
  const programText = svgEl.querySelector("#wa-program-text");
  programText.textContent = "34";
};

const elementIsInMap = (el) => {
  while (el !== document.body) {
    if (el.getAttribute("id") === "map-container") {
      return true;
    }
    el = el.parentElement;
  }
  return false;
};

const onMapLoad = async () => {
  const mapEl = document.getElementById("map");
  const response = await fetch("states.svg");
  const svgData = await response.text();

  const assessmentResponse = await fetch("data/assessments.txt", {
    cache: "no-store",
  });
  const assessmentData = await assessmentResponse.text();
  const programResponse = await fetch("data/programs.txt", {
    cache: "no-store",
  });
  const programData = await programResponse.text();

  processAssessmentData(assessmentData);
  processProgramData(programData);

  mapEl.innerHTML = svgData;
  processMap(mapEl);
  mapEl.addEventListener("click", onMapClick);
  mapEl.addEventListener("mouseover", (e) => {
    clearStateHover();
    e.target.classList.add(HOVER_CLASS);
  });
  document.body.addEventListener("click", (e) => {
    if (!elementIsInMap(e.target)) {
      clearStateHover();
      showPopup(false);
    }
  });
};

init();
