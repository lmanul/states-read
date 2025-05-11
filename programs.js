import {
  setDetails,
  clearDetails,
  formatSingleStatePill,
  highlightStates,
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
  const programBlocks = raw.split("\n\n\n");
  for (let block of programBlocks) {
    const keyValues = block.split("\n");
    const program = new Program("noid", "Unknown Program");
    let id = null;
    for (let keyValue of keyValues) {
      let [key, value] = keyValue.split("|").map((a) => a.trim());
      if (key === "id") {
        id = value;
        program.id = id;
      } else if (key === "name") {
        program.name = value;
      } else if (key === "company") {
        program.company = value;
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
          states[stateCode].approvedPrograms.push(id);
        }
        program.approvingStates = approvingStates;
      }
    }
    programs[id] = program;
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
      return "Meets EdReports expectations";
    case "pa":
      return "Partially Meets EdReports expectations";
    default:
      return "";
  }
};

const formatProgramDetails = (id) => {
  const program = programs[id];
  const aligned = getValueForAligned(program.aligned);
  const feasible = getValueForFeasible(program.feasible);
  return `
      <h1 class="program">${program.name}</h1>
      <p><b>Approved in ${program.approvingStates.length} states: </b>
      ${program.approvingStates.map(formatSingleStatePill).join(" ")}
      </p>
      ${program.company ? "<p><b>Company</b>: " + program.company + "</p>" : ""}
      ${aligned ? "<p><b>Aligned</b>: " + aligned + "</p>" : ""}
      ${feasible ? "<p><b>Feasible</b>: " + feasible + "</p>" : ""}
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
