
window.onload = () => {
}

let map;
let markers = [];
let infoWindow;

function initMap() {
  var losAngeles = {
    lat: 34.063380,
    lng: -118.358080
  };
  map = new google.maps.Map(document.getElementById('map'), {
    center: losAngeles,
    zoom: 11,
    mapTypeId: 'roadmap',
  });
  infoWindow = new google.maps.InfoWindow();
  searchStores();
}

const searchStores = () => {
  let foundStores = [];
  let zipCode = document.getElementById('zip-code-input').value;
  if (zipCode) {
    for (let store of stores) {
      let postal = store.address.postalCode.substring(0, 5);
      if (postal === zipCode) {
        foundStores.push(store);
      }
    }
  } else {
    foundStores = stores;
  }
  clearLocations(); // to clear previous searches markers
  displayStores(foundStores);
  showStoresMarkers(foundStores);
  setOnClickListener();
}


// clear locations
const clearLocations = () => {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

const setOnClickListener = () => {
  let storeElements = document.querySelectorAll('.store-container');
  storeElements.forEach((elem, index) => {
    elem.addEventListener('click', function() {
      new google.maps.event.trigger(markers[index], 'click');
    })
  })
}


// function to loop through stores data and display it:
// function displayStores() {
const displayStores = (stores) => {
  let storesHTML = '';
  for (let [index, store] of stores.entries()) { //.entries() for using index in for of loop 
    let address = store['addressLines'];
    let phone = store.phoneNumber; // dot notation, bracket above
    storesHTML += `
      <div class="store-container">
        <div class="store-container-background">
          <div class="store-info-container">
            <div class="store-address">
              <span>${address[0]}</span>
              <span>${address[1]}</span>
            </div>
            <div class="store-phone-number">${phone}</div>
          </div>
          <div class="store-number-container">
            <div class="store-number">
              ${index+1}
            </div>
          </div>
        </div>
      </div>
    `;
    document.querySelector('.stores-list').innerHTML = storesHTML;
  }
}

// index+1 is so the circle displays starting with 1, not 0

const showStoresMarkers = (stores) => {
  let bounds = new google.maps.LatLngBounds();
  for (let [index, store] of stores.entries()) {
    let latlng = new google.maps.LatLng(
      store.coordinates.latitude,
      store.coordinates.longitude);
    let name = store.name;
    let address = store.addressLines[0];
    let openStatusText = store.openStatusText;
    let encodedAddress = encodeURI(address);
    let phoneNumber = store.phoneNumber;
    bounds.extend(latlng);
    createMarker(latlng, name, address, openStatusText, encodedAddress, phoneNumber, index+1);
  }
  map.fitBounds(bounds);
}

// const iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
// let icons = {
//   parking: {
//     icon: iconBase + 'parking_lot_maps.png'
//   },
//   library: {
//     icon: iconBase + 'library_maps.png'
//   },
//   info: {
//     icon: iconBase + 'info-i_maps.png'
//   }
// };



const createMarker = (latlng, name, address, openStatusText, encodedAddress, phoneNumber, index) => {
  let html = `
    <div class="store-info-window">
      <div class="store-info-name">
        ${name}
      </div>
      <div class="store-info-status">
        ${openStatusText}
      </div>
      <div class="store-info-address">
        <div class="circle">
          <i class="fas fa-location-arrow"></i>
        </div>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}">
          ${address}
        </a>
      </div>
      <div class="store-info-phone">
        <div class="circle">
          <i class="fas fa-phone-alt"></i>
        </div>
        ${phoneNumber}
      </div>
    </div>
  `;
  let marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: index.toString(),
    // if you want to make coffee cup icon markers:
    icon: {
      url: "http://maps.google.com/mapfiles/kml/shapes/coffee.png"
    },
  });
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}