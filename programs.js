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
  }
}

export const processProgramData = (raw) => {
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
          if (!stateCode) {
            continue;
          }
          states[stateCode].approvedPrograms.push(id);
        }
      }
    }
    const newProgram = new Program(id, name);
    newProgram.approvingStates = approvingStates;
    programs[id] = newProgram;
  }
};

const formatProgramDetails = (id) => {
  const program = programs[id];
  return `
      <h1 class="program">${program.name}</h1>
      <p><b>Approved in ${program.approvingStates.length} states: </b>
      ${program.approvingStates.map(formatSingleStatePill).join(" ")}
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
