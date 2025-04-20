const onMapLoad = async () => {
  const mapEl = document.getElementById('map');
  const response = await fetch('/states.svg');
  const svgData = await response.text();
  mapEl.innerHTML = svgData;
};

async function loadMap() {
  const mapEl = document.getElementById('map');
  fetch('/images/map_quartiers.svg').
    then(response => response.text()).
    then(data => {
      mapEl.innerHTML = data;
    });

    mapEl.addEventListener('mouseover', onMapHover);

  const response = await fetch("/prices.txt");
  const rawData = await response.text();
  onDataLoaded(rawData);
}
