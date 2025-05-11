import {
  setDetails,
  clearDetails,
  formatSingleStatePill,
  highlightStates,
  showKeyValueIfDefined
} from "./util.js";
import { states } from "./states.js";

let programs;

class Program {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.approvingStates = [];
    this.company = null;
    this.aligned = null;
    this.feasible = null;
  }
}

export const processProgramData = (raw) => {
  programs = {};
  const programBlocks = raw.split("\n\n");
  for (let block of programBlocks) {
    const keyValues = block.split("\n");
    const program = new Program("noid", "Unknown Program");
    let id = null;
    for (let keyValue of keyValues) {
      let [key, value] = keyValue.split("|").map((a) => a.trim());
      if (key === "id") {
        program.id = id;
      } else if (key === "name") {
        program.name = value;
      } else if (key === "company") {
        program.company = value;
      } else if (key === 'content focus') {
        program.contentFocusLowHigh = parseContentFocus(value);
      } else if (key === 'time required 1st grade') {
        program.timeRequiredFirstGradeMinutes = parseInt(value);
      } else if (key === 'year of last update') {
        program.yearOfLastUpdate = value;
      } else if (key === "aligned") {
        program.aligned = value;
      } else if (key === "feasible") {
        program.feasible = value;
      } else if (key === "states") {
        const approvingStates = value.trim().split(",");
        for (let stateCode of approvingStates) {
          stateCode = stateCode.trim();
          if (!stateCode) {
            continue;
          }
          if (!states[stateCode]) {
            alert('Sorry I do not know about state "' + stateCode + '"');
            continue;
          }
          states[stateCode].approvedPrograms.push(program.id);
        }
        program.approvingStates = approvingStates;
      }
    }
    programs[program.id] = program;
  }
};

const getValueForFeasible = (id) => {
  switch (id) {
    case "me":
      return "Meets EdReports expectations";
    default:
      return "";
  }
};

const getValueForAligned = (id) => {
  switch (id) {
    case "me":
    case "meets":
      return "Meets EdReports expectations";
    case "pa":
    case "partially":
      return "Partially Meets EdReports expectations";
    default:
      return "";
  }
};

const parseContentFocus = (s) => {
  if (s.includes('not rated')) {
    return '';
  }
  return s.split('-').map(a => a.trim());
};

const formatContentFocus = (p) => {
  if (!p.contentFocusLowHigh) {
    return '';
  }
  return p.contentFocusLowHigh[0] + ' — ' + p.contentFocusLowHigh[1] + '%';
};

const formatTimeRequiredFirstGrade = (program) => {
  if (!program.timeRequiredFirstGradeMinutes) {
    return '';
  }
  return program.timeRequiredFirstGradeMinutes + ' minutes';
};

const formatProgramDetails = (id) => {
  const program = programs[id];
  const aligned = getValueForAligned(program.aligned);
  const feasible = getValueForFeasible(program.feasible);
  const contentFocus = formatContentFocus(program);
  const timeRequiredFirstGrade = formatTimeRequiredFirstGrade(program);

  return `
      <h1 class="program">${program.name}</h1>
      <p><b>Approved in ${program.approvingStates.length} states: </b>
      ${program.approvingStates.map(formatSingleStatePill).join(" ")}
      </p>
      ${showKeyValueIfDefined('Company', program.company)}
      ${showKeyValueIfDefined('Aligned', aligned)}
      ${showKeyValueIfDefined('Feasible', feasible)}
      ${showKeyValueIfDefined('Content Focus', contentFocus)}
      ${showKeyValueIfDefined('Time Required 1<sup>st</sup> grade', timeRequiredFirstGrade)}
      ${showKeyValueIfDefined('Years of last update', program.yearOfLastUpdate)}
    `;
};

export const formatSingleProgramPill = (id) => {
  return `
      <div class="pill program-pill" onclick="showProgram('${id}')">${id}</div>
    `;
};

const showProgram = (id) => {
  clearDetails();
  const program = programs[id];
  highlightStates(program.approvingStates, states);

  setDetails(formatProgramDetails(id));
};

window.showProgram = showProgram;
