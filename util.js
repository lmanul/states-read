const HIGHLIGHT_CLASS = "highlight";

export const setDetails = (markup) => {
  document.getElementById("details").innerHTML = markup;
};

export const clearDetails = () => {
  setDetails("");
};

export const clearStateHighlights = () => {
  let currentlyHighlighted = document.getElementsByClassName(HIGHLIGHT_CLASS);
  while (currentlyHighlighted.length > 0) {
    for (let i = 0; i < currentlyHighlighted.length; i++) {
      currentlyHighlighted[i].classList.remove(HIGHLIGHT_CLASS);
    }
    currentlyHighlighted = document.getElementsByClassName(HIGHLIGHT_CLASS);
  }
};

export const highlightStates = (stateCodes, states) => {
  clearStateHighlights();
  for (let stateCode of stateCodes) {
    states[stateCode].element.classList.add(HIGHLIGHT_CLASS);
  }
};

export const formatSingleStatePill = (id) => {
  return `
      <div class="pill state-pill" onclick="">${id}</div>
    `;
};

window.clearStateHighlights = clearStateHighlights;
