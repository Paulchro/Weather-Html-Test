function clearList() {
  var select = document.getElementById("selectLocation");
  var length = select.options.length;
  for (i = length - 1; i > 0; i--) {
    select.options[i] = null;
  }
}

function select(a) {
  var x = a.value || a.options[a.selectedIndex].value;
  var selectedLoc = a.options[a.selectedIndex].text;
  document.getElementById("selectedLoc").innerHTML = selectedLoc;

  getWeather(x);
}

// Function to define innerHTML for HTML table
function show(data) {
  let tab = `<tr>
          <th>Date</th>
          <th>Conditions</th>
          <th>Min Temp</th>
          <th>Max Temp</th>
         </tr>`;

  // Loop to access all rows
  for (let r of data.consolidated_weather) {
    tab += `<tr> 
    <td>${r.applicable_date}</td>
    <td>${r.weather_state_name}</td>
    <td>${r.min_temp.toFixed(1)}</td> 
    <td>${r.max_temp.toFixed(1)}</td>          
</tr>`;
  }
  // Setting innerHTML as tab variable
  document.getElementById("weather").innerHTML = tab;
}

async function populateLocationArray(x) {
  var url = "https://www.metaweather.com/api/location/search/?query=" + x;
  const response = await fetch(url);
  var data = await response.json();
  const locations = new Array();
  for (let i = 0; i < data.length; i++) {
    locations.push({
      key: data[i].woeid,
      value: data[i].title,
    });
  }
  console.log(locations);
  if(data.length === 1)
  {
    getWeather(data[0].woeid);
    document.getElementById("selectedLoc").innerHTML = data[0].title;
    document.getElementById("selectLocation").disabled = true;
   return;
  }
  alert("Found " + locations.length + " locations, please select yours!");
  document.getElementById("selectLocation").disabled = false;
  populateDropdown(locations);
}

function getData() {
  clearList();
  var x;
  if (document.getElementById("location").value.length == 0) {
    alert("Please type a location!");
    return;
  } 
  else {
    x = document.getElementById("location").value;
  }
  populateLocationArray(x);
}

function populateDropdown(location) {
  var select = document.getElementById("selectLocation");
  for (var i = 0; i < location.length; i++) {
    var val = location[i].key;
    var opt = location[i].value;
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = val;
    select.appendChild(el);
  }
}

async function getWeather(e) {
  var url = "https://www.metaweather.com/api/location/" + e;
  const response = await fetch(url);
  var data = await response.json();
  show(data);
}
