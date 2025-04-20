const STATES = {
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'District of Columbia': 'DC',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY',
};
const stateCodes = Object.values(STATES);

let stateEls = [];

const HIGHLIGHT_CLASS = 'highlight';
const POPUP_ANCHOR_OFFSET = 40;
const POPUP_WIDTH = 300;
const POPUP_HEIGHT = 170;
const POPUP_WINDOW_SAFETY_PADDING = 20;

const isStateElement = (el) => {
  const id = el.getAttribute('id');
  return id !== '' && stateCodes.includes(id.toUpperCase());
};

const onMapHover = (e) => {
  if (!stateEls.length) {
    // No data yet.
    return;
  }
  if (!isStateElement(e.target)) {
    showPopup(false);
    return;
  }
  let id = e.target.getAttribute('id');
  const state = e.target;
  let currentlyHighlighted =
      document.getElementsByClassName(HIGHLIGHT_CLASS);
  if (currentlyHighlighted.length > 0) {
    for (let i = 0; i < currentlyHighlighted.length; i++) {
      currentlyHighlighted[i].classList.remove(HIGHLIGHT_CLASS);
    }
  }
  showPopup(true, e.clientX, e.clientY, id);
  state.classList.add(HIGHLIGHT_CLASS);
};

const showPopup = (show, clientX, clientY, id) => {
  const el = document.getElementById('popup');
  el.style.display = show ? 'block' : 'none';
  if (show) {
    let x, y;
    let overflowX = (clientX + POPUP_WIDTH >= window.innerWidth -
                     POPUP_WINDOW_SAFETY_PADDING);
    let overflowY = (clientY + POPUP_HEIGHT >= window.innerHeight -
                     POPUP_WINDOW_SAFETY_PADDING);

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

    el.style.top = '' + y + 'px';
    el.style.left = '' + x + 'px';
    el.style.width = POPUP_WIDTH + 'px';
    el.style.height = POPUP_HEIGHT + 'px';

    el.innerHTML = 'test';
    // const prices =
    //       getPricesForIdAndSelectedIndexRange(id, getSelectedIndexRange());

    // el.innerHTML = getPopupTitle(id) + '<br/><br/>' + displayPricesRangeForPopup(prices);
  }
}


const processMap = (mapEl) => {
  const allPaths = [
    ...mapEl.querySelectorAll('path')
  ];
  stateEls = allPaths.filter(p => isStateElement(p));
};

const onMapLoad = async () => {
  const mapEl = document.getElementById('map');
  const response = await fetch('/states.svg');
  const svgData = await response.text();
  mapEl.innerHTML = svgData;
  processMap(mapEl);
  mapEl.addEventListener('mouseover', onMapHover);
};
