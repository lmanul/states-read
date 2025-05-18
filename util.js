export const HIGHLIGHT_CLASS = "highlight";
export const HOVER_CLASS = "hover";
export const SELECTED_CLASS = "selected";

export const enterTableMode = () => {
  document.getElementById('map-container').style.display = 'none';
  document.getElementById('legend').style.display = 'none';
  document.getElementById('details').style.display = 'none';
  document.getElementById('popup').style.display = 'none';

  document.getElementById('table-container').style.display = 'block';
};

export const enterMapMode = () => {
  document.getElementById('map-container').style.display = 'flex';
  document.getElementById('details').style.display = 'block';
  document.getElementById('legend').style.display = 'block';

  document.getElementById('table-container').style.display = 'none';
};

export const setDetails = (markup) => {
  document.getElementById("details").innerHTML = markup;
};

export const clearDetails = () => {
  setDetails("");
};

const clearMapState = () => {
  clearStateHighlights();
  clearStateHover();
  clearStateSelected();
  // Hide popup
  const el = document.getElementById("popup");
  el.style.display = "none";
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

export const clearStateHover = () => {
  let currentlyHovered = document.getElementsByClassName(HOVER_CLASS);
  if (currentlyHovered.length > 0) {
    for (let i = 0; i < currentlyHovered.length; i++) {
      currentlyHovered[i].classList.remove(HOVER_CLASS);
    }
  }
};

export const clearStateSelected = () => {
  let currentlySelected = document.getElementsByClassName(SELECTED_CLASS);
  if (currentlySelected.length > 0) {
    for (let i = 0; i < currentlySelected.length; i++) {
      currentlySelected[i].classList.remove(SELECTED_CLASS);
    }
  }
};

export const highlightStates = (stateCodes, states) => {
  clearStateHighlights();
  for (let stateCode of stateCodes) {
    if (!states[stateCode]) {
      // Be a little defensive.
      continue;
    }
    states[stateCode].element.classList.add(HIGHLIGHT_CLASS);
  }
};

export const formatSingleStatePill = (id) => {
  return `
      <div class="pill state-pill" onclick="">${id}</div>
    `;
};

export const showKeyValueIfDefined = (keyDisplayName, value) => {
  if (!value) {
    return '';
  }
  return "<p><b>" + keyDisplayName + "</b>: " + value + "</p>";
};

window.clearMapState = clearMapState;
window.enterMapMode = enterMapMode;