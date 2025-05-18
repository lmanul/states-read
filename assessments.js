import {
  setDetails,
  clearDetails,
  enterTableMode,
  enterMapMode,
  formatSingleStatePill,
  highlightStates,
  showKeyValueIfDefined
} from "./util.js";
import { getNumberOfStatesWithAnyAssessmentApprovals, states } from "./states.js";

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
      if (value === 'n/a') {
        continue;
      }
      if (key === "id") {
        assessment.id = value;
      } else if (key === "name") {
        assessment.name = value;
      } else if (key === "parent company") {
        assessment.parentCompany = value;
      } else if (key === "owners") {
        assessment.owners = value;
      } else if (key === "publisher") {
        assessment.publisher = value;
      } else if (key.toLowerCase() === "word-level skills") {
        assessment.wordLevelSkills = value;
      } else if (key.toLowerCase() === "fluency and comprehension") {
        assessment.fluencyAndComprehension = value;
      } else if (key.toLowerCase() === "national center for intensive intervention rating for fall of 1st grade") {
        assessment.ncfiirfffg = value;
      } else if (key === "available grade levels") {
        assessment.availableGradeLevels = value;
      } else if (key === "time required") {
        if (value.includes('-')) {
          assessment.timeRequired = value.split('-').map(v => parseInt(v.trim()));
        } else {
          assessment.timeRequired = parseInt(value);
        }
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
  let timeRequired = '';
  if (assessment.timeRequired) {
    timeRequired = (!!assessment.timeRequired.length ?
        assessment.timeRequired[0] + ' — ' + assessment.timeRequired[1] :
        assessment.timeRequired) + ' minutes';
  }
  const percentOfStateApprovals = Math.round(
    100 * assessment.approvingStates.length / getNumberOfStatesWithAnyAssessmentApprovals());
  const percentOfStateApprovalsCalculation = '' + assessment.approvingStates.length + '/' + getNumberOfStatesWithAnyAssessmentApprovals();
  return `
      <h1 class="assessment">${assessment.name}</h1>
      <h2>Approval</h2>
      <p><b>Approved in ${assessment.approvingStates.length} states: </b>
      ${assessment.approvingStates.map(formatSingleStatePill).join(" ")}
      <p><b>Percent of state approvals</b>: ${percentOfStateApprovals}% (${percentOfStateApprovalsCalculation})</p>
      <h2>Publishing</h2>
      ${showKeyValueIfDefined('Publisher', assessment.publisher)}
      ${showKeyValueIfDefined('Parent Company', assessment.parentCompany)}
      ${showKeyValueIfDefined('Owners', assessment.owners)}
      <h2>Technical information</h2>
      ${showKeyValueIfDefined('Time Required', timeRequired)}
      ${showKeyValueIfDefined('Available grade levels', assessment.availableGradeLevels)}
      <h2>Subtests offered</h2>
      ${showKeyValueIfDefined('Word-level skills', assessment.wordLevelSkills)}
      ${showKeyValueIfDefined('National Center for Intensive Intervention Rating for Fall of 1st grade', assessment.ncfiirfffg)}
      ${showKeyValueIfDefined('Fluency and Comprehension', assessment.fluencyAndComprehension)}
      <p style="margin-top: 50px"></p>
      <p style="text-align: center">
        <big><a href="#" onclick="compareAssessments()" style="text-decoration: none">Compare Assessments</a></big>
      </p>
    `;
};

const formatAssessmentRowInTable = (assessment) => {
  let timeRequired = '';
  if (assessment.timeRequired) {
    timeRequired = (!!assessment.timeRequired.length ?
        assessment.timeRequired[0] + ' — ' + assessment.timeRequired[1] :
        assessment.timeRequired);
  }
  return `
    <tr>
      <td class="odd">${assessment.name || ''}</td>
      <td class="even">${assessment.publisher || ''}</td>
      <td class="odd">${assessment.parentCompany || ''}</td>
      <td class="even">${assessment.owners || ''}</td>
      <td class="odd">${timeRequired}</td>
      <td class="even">${assessment.availableGradeLevels || ''}</td>
      <td class="odd">${assessment.wordLevelSkills || ''}</td>
    </tr>
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
  if (!assessment) {
    alert("I don't know about assessment " + id)
  }
  highlightStates(assessment.approvingStates, states);

  setDetails(formatAssessmentDetails(id));
};

export const compareAssessments = () => {
  enterTableMode();

  document.getElementById('table-container').innerHTML = `
    <div onclick="enterMapMode()" style="cursor: pointer">⬅️ Back to Map</div>
    <h1>Assessments</h1>
    <table>
      <tr class="header">
        <th>Name</th>
        <th>Publisher</th>
        <th>Parent company</th>
        <th>Owners</th>
        <th>Time<br/>required<br/>(minutes)</th>
        <th>Available<br/>grade<br/>levels</th>
        <th>Word-level skills</th>
      </tr>
    ${Object.values(assessments).map(formatAssessmentRowInTable).join('\n')}
    </table>
  `;
};

window.showAssessment = showAssessment;
window.compareAssessments = compareAssessments;