class State {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.approvedAssessments = [];
    this.approvedPrograms = [];
    this.element = null;
  }
}

let states;
let cachedNumberOfStatesWithAnyAssessmentApprovals;

const stateNames = {
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
const stateCodes = Object.keys(stateNames);

const init = () => {
  states = {};
  for (let stateCode in stateNames) {
    states[stateCode] = new State(stateCode, stateNames[stateCode]);
  }
};

const getNumberOfStatesWithAnyAssessmentApprovals = () => {
  if (!cachedNumberOfStatesWithAnyAssessmentApprovals) {
    cachedNumberOfStatesWithAnyAssessmentApprovals =
        Object.values(states).filter(s => s.approvedAssessments.length > 0).length;
  }
  return cachedNumberOfStatesWithAnyAssessmentApprovals;
};

export {
  init, getNumberOfStatesWithAnyAssessmentApprovals, states, stateNames, stateCodes
};
