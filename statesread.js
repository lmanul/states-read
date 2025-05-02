const STATES = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DC: "District of Columbia",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};
const stateCodes = Object.keys(STATES);

class Assessment {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.approvingStates = [];
  }
}

class Program {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.approvingStates = [];
  }
}

class State {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.approvedAssessments = [];
    this.approvedPrograms = [];
    this.element = null;
  }
}

let assessments;
let programs;
let states;

const init = () => {
  states = {};
  for (let stateCode in STATES) {
    states[stateCode] = new State(stateCode, STATES[stateCode]);
  }
};

const processAssessmentData = (raw) => {
  assessments = {};
  const assessmentBlocks = raw.split("\n\n\n");
  for (let block of assessmentBlocks) {
    const keyValues = block.split("\n");
    let id = null;
    let name = null;
    let approvingStates = [];
    for (let keyValue of keyValues) {
      const [key, value] = keyValue.split("|");
      if (key === "id") {
        id = value.trim();
      } else if (key === "name") {
        name = value.trim();
      } else if (key === "states") {
        approvingStates = value.trim().split(",");
        for (let stateCode of approvingStates) {
          states[stateCode].approvedAssessments.push(id);
        }
      }
    }
    const newAssessment = new Assessment(id, name);
    newAssessment.approvingStates = approvingStates;
    assessments[id] = newAssessment;
  }
};

const processProgramData = (raw) => {
  programs = {};
  const programBlocks = raw.split("\n\n\n");
  for (let block of programBlocks) {
    const keyValues = block.split("\n");
    let id = null;
    let name = null;
    let approvingStates = [];
    for (let keyValue of keyValues) {
      const [key, value] = keyValue.split("|");
      if (key === "id") {
        id = value.trim();
      } else if (key === "name") {
        name = value.trim();
      } else if (key === "states") {
        approvingStates = value.trim().split(",");
        for (let stateCode of approvingStates) {
          states[stateCode].approvedPrograms.push(id);
        }
      }
    }
    const newProgram = new Program(id, name);
    newProgram.approvingStates = approvingStates;
    programs[id] = newProgram;
  }
};

const HOVER_CLASS = "hover";
const HIGHLIGHT_CLASS = "highlight";
const POPUP_ANCHOR_OFFSET = 1;
const POPUP_WIDTH = 400;
const POPUP_HEIGHT = 400;
const POPUP_WINDOW_SAFETY_PADDING = 20;

const isStateElement = (el) => {
  const id = el.getAttribute("id");
  return id !== "" && stateCodes.includes(id.toUpperCase());
};

const clearStateHighlights = () => {
  let currentlyHighlighted = document.getElementsByClassName(HIGHLIGHT_CLASS);
  while (currentlyHighlighted.length > 0) {
    for (let i = 0; i < currentlyHighlighted.length; i++) {
      currentlyHighlighted[i].classList.remove(HIGHLIGHT_CLASS);
    }
    currentlyHighlighted = document.getElementsByClassName(HIGHLIGHT_CLASS);
  }
};

const clearStateHover = () => {
  let currentlyHovered = document.getElementsByClassName(HOVER_CLASS);
  if (currentlyHovered.length > 0) {
    for (let i = 0; i < currentlyHovered.length; i++) {
      currentlyHovered[i].classList.remove(HOVER_CLASS);
    }
  }
};

const highlightStates = (stateCodes) => {
  clearStateHighlights();
  for (let stateCode of stateCodes) {
    states[stateCode].element.classList.add(HIGHLIGHT_CLASS);
  }
};

const onMapHover = (e) => {
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
  showPopup(true, e.clientX, e.clientY, id);
  state.classList.add(HOVER_CLASS);
};

const getPopupTitle = (stateCode) => {
  return "<h1>" + states[stateCode].name + "</h1>";
};

const formatSingleAssessmentPill = (id) => {
  return `
    <div class="pill assessment-pill" onclick="showAssessment('${id}')">${id}</div>
  `;
};

const formatSingleProgramPill = (id) => {
  return `
    <div class="pill program-pill" onclick="showProgram('${id}')">${id}</div>
  `;
};

const formatSingleStatePill = (id) => {
  return `
    <div class="pill state-pill" onclick="">${id}</div>
  `;
};

const setDetails = (markup) => {
  document.getElementById("details").innerHTML = markup;
};

const clearDetails = () => {
  setDetails("");
};

const formatAssessmentDetails = (id) => {
  const assessment = assessments[id];
  return `
    <h1 class="assessment">${assessment.name}</h1>
    <p><b>Approved in ${assessment.approvingStates.length} states: </b>
    ${assessment.approvingStates.map(formatSingleStatePill).join(" ")}
  `;
};

const formatProgramDetails = (id) => {
  const program = programs[id];
  return `
    <h1 class="program">${program.name}</h1>
    <p><b>Approved in ${program.approvingStates.length} states: </b>
    ${program.approvingStates.map(formatSingleStatePill).join(" ")}
  `;
};

const formatPopupContent = (stateCode) => {
  const approvedAssessments = states[stateCode].approvedAssessments;
  const approvedPrograms = states[stateCode].approvedPrograms;

  return `
   ${getPopupTitle(stateCode)}
   <h2 class="assessment">Approved assessments</h2>
   ${approvedAssessments.map(formatSingleAssessmentPill).join("")}
   <h2 class="program">Approved programs</h2>
   ${approvedPrograms.map(formatSingleProgramPill).join(" ")}`;
};

const showAssessment = (id) => {
  clearDetails();
  const assessment = assessments[id];
  highlightStates(assessment.approvingStates);

  setDetails(formatAssessmentDetails(id));
};

const showProgram = (id) => {
  clearDetails();
  const program = programs[id];
  highlightStates(program.approvingStates);

  setDetails(formatProgramDetails(id));
};

const showPopup = (show, clientX, clientY, id) => {
  const el = document.getElementById("popup");
  el.style.display = show ? "block" : "none";
  if (show) {
    let x, y;
    let overflowX =
      clientX + POPUP_WIDTH >= window.innerWidth - POPUP_WINDOW_SAFETY_PADDING;
    let overflowY =
      clientY + POPUP_HEIGHT >=
      window.innerHeight - POPUP_WINDOW_SAFETY_PADDING;

    if (overflowX) {
      x = clientX - POPUP_WIDTH - POPUP_ANCHOR_OFFSET;
    } else {
      x = clientX + POPUP_ANCHOR_OFFSET;
    }
    if (overflowY) {
      y = clientY - POPUP_HEIGHT - POPUP_ANCHOR_OFFSET;
    } else {
      y = clientY + POPUP_ANCHOR_OFFSET;
    }

    el.style.top = "" + y + "px";
    el.style.left = "" + x + "px";
    el.style.width = POPUP_WIDTH + "px";
    el.style.height = POPUP_HEIGHT + "px";

    const stateCode = id.toUpperCase();
    el.innerHTML = formatPopupContent(stateCode);
  }
};

const processMap = (mapEl) => {
  const allPaths = [...mapEl.querySelectorAll("path")];
  const stateEls = allPaths.filter((p) => isStateElement(p));
  const svgEl = document.querySelector('svg');
  for (let stateEl of stateEls) {
    const stateCode = stateEl.getAttribute("id");
    const stateCodeUpper = stateCode.toUpperCase();
    states[stateCodeUpper].element = stateEl;

    const assessmentCount = states[stateCodeUpper].approvedAssessments.length;
    const programCount = states[stateCodeUpper].approvedPrograms.length;

    if (assessmentCount > 0) {
      svgEl.querySelector('#' + stateCode + '-assessment-text').textContent = assessmentCount;
    } else {
      svgEl.querySelector('#' + stateCode + '-assessment-circle').style.display = 'none';
      svgEl.querySelector('#' + stateCode + '-assessment-text').textContent = '';
    }
    svgEl.querySelector('#' + stateCode + '-assessment-circle').style.pointerEvents = 'none';
    svgEl.querySelector('#' + stateCode + '-assessment-text').style.pointerEvents = 'none';
    if (programCount > 0) {
      svgEl.querySelector('#' + stateCode + '-program-text').textContent = programCount;
    } else {
      svgEl.querySelector('#' + stateCode + '-program-circle').style.display = 'none';
      svgEl.querySelector('#' + stateCode + '-program-text').textContent = '';
    }
    svgEl.querySelector('#' + stateCode + '-program-circle').style.pointerEvents = 'none';
    svgEl.querySelector('#' + stateCode + '-program-text').style.pointerEvents = 'none';
  }

  const assessmentText = svgEl.querySelector('#wa-assessment-text');
  assessmentText.textContent = '12';
  const programText = svgEl.querySelector('#wa-program-text');
  programText.textContent = '34';

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

  const assessmentResponse = await fetch("data/assessments.txt");
  const assessmentData = await assessmentResponse.text();
  const programResponse = await fetch("data/programs.txt");
  const programData = await programResponse.text();

  processAssessmentData(assessmentData);
  processProgramData(programData);

  mapEl.innerHTML = svgData;
  processMap(mapEl);
  mapEl.addEventListener("mousemove", onMapHover);
  document.body.addEventListener("mousemove", (e) => {
    if (!elementIsInMap(e.target)) {
      clearStateHover();
      showPopup(false);
    }
  });
};

init();
