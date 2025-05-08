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
  }
}

export const processProgramData = (raw) => {
  programs = {};
  const programBlocks = raw.split("\n\n\n");
  for (let block of programBlocks) {
    const keyValues = block.split("\n");
    const program = new Program('noid', 'Unknown Program');
    let id = null;
    for (let keyValue of keyValues) {
      let [key, value] = keyValue.split("|").map(a => a.trim());
      if (key === "id") {
        id = value;
        program.id = id;
      } else if (key === "name") {
        program.name = value;
      } else if (key === 'company') {
        program.company = value;
      } else if (key === "states") {
        const approvingStates = value.trim().split(",");
        for (let stateCode of approvingStates) {
          if (!stateCode) {
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

const formatProgramDetails = (id) => {
  const program = programs[id];
  return `
      <h1 class="program">${program.name}</h1>
      <p><b>Approved in ${program.approvingStates.length} states: </b>
      ${program.approvingStates.map(formatSingleStatePill).join(" ")}
      </p>
      ${program.company ? "<p><b>Company</b>: " + program.company + "</p>" : ''}
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
