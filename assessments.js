import {
  setDetails,
  clearDetails,
  formatSingleStatePill,
  highlightStates,
  showKeyValueIfDefined
} from "./util.js";
import { states } from "./states.js";

let assessments;

class Assessment {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.approvingStates = [];
  }
}

export const processAssessmentData = (raw) => {
  assessments = {};
  const assessmentBlocks = raw.split("\n\n");
  for (let block of assessmentBlocks) {
    const keyValues = block.split("\n");
    const assessment = new Assessment('noid', 'Unknown Assessment');
    let approvingStates = [];
    for (let keyValue of keyValues) {
      const [key, value] = keyValue.split("|").map((a) => a.trim());
      if (key === "id") {
        assessment.id = value;
      } else if (key === "name") {
        assessment.name = value;
      } else if (key === "time required") {
        assessment.timeRequired = parseInt(value);
      } else if (key === "states") {
        approvingStates = value.trim().split(",");
        for (let stateCode of approvingStates) {
          states[stateCode].approvedAssessments.push(assessment.id);
        }
        assessment.approvingStates = approvingStates;
      }
    }
    assessments[assessment.id] = assessment;
  }
};

const formatAssessmentDetails = (id) => {
  const assessment = assessments[id];
  return `
      <h1 class="assessment">${assessment.name}</h1>
      <p><b>Approved in ${assessment.approvingStates.length} states: </b>
      ${assessment.approvingStates.map(formatSingleStatePill).join(" ")}
    `;
};

export const formatSingleAssessmentPill = (id) => {
  return `
      <div class="pill assessment-pill" onclick="showAssessment('${id}')">${id}</div>
    `;
};

export const showAssessment = (id) => {
  clearDetails();
  const assessment = assessments[id];
  highlightStates(assessment.approvingStates, states);

  setDetails(formatAssessmentDetails(id));
};

window.showAssessment = showAssessment;
