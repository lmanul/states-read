const STATES = {
  'AL': 'Alabama',
  'AK': 'Alaska',
  'AZ': 'Arizona',
  'AR': 'Arkansas',
  'CA': 'California',
  'CO': 'Colorado',
  'CT': 'Connecticut',
  'DC': 'District of Columbia',
  'DE': 'Delaware',
  'FL': 'Florida',
  'GA': 'Georgia',
  'HI': 'Hawaii',
  'ID': 'Idaho',
  'IL': 'Illinois',
  'IN': 'Indiana',
  'IA': 'Iowa',
  'KS': 'Kansas',
  'KY': 'Kentucky',
  'LA': 'Louisiana',
  'ME': 'Maine',
  'MD': 'Maryland',
  'MA': 'Massachusetts',
  'MI': 'Michigan',
  'MN': 'Minnesota',
  'MS': 'Mississippi',
  'MO': 'Missouri',
  'MT': 'Montana',
  'NE': 'Nebraska',
  'NV': 'Nevada',
  'NH': 'New Hampshire',
  'NJ': 'New Jersey',
  'NM': 'New Mexico',
  'NY': 'New York',
  'NC': 'North Carolina',
  'ND': 'North Dakota',
  'OH': 'Ohio',
  'OK': 'Oklahoma',
  'OR': 'Oregon',
  'PA': 'Pennsylvania',
  'RI': 'Rhode Island',
  'SC': 'South Carolina',
  'SD': 'South Dakota',
  'TN': 'Tennessee',
  'TX': 'Texas',
  'UT': 'Utah',
  'VT': 'Vermont',
  'VA': 'Virginia',
  'WA': 'Washington',
  'WV': 'West Virginia',
  'WI': 'Wisconsin',
  'WY': 'Wyoming',
};
const stateCodes = Object.keys(STATES);

let stateEls = [];

const HIGHLIGHT_CLASS = 'highlight';
const POPUP_ANCHOR_OFFSET = 40;
const POPUP_WIDTH = 300;
const POPUP_HEIGHT = 300;
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

const getPopupTitle = (id) => {
  for (let stateId in STATES) {
    if (stateId.toLowerCase() === id) {
      return STATES[stateId];
    }
  }
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

    el.innerHTML = getPopupTitle(id) + '<br/><br/>';
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
