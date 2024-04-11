// Importatation de la carte et ses paramètres
var map = L.map('map').setView([0, 0], 2);
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)
// Différent fond de carte
var stadia = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'jpg'
});
var esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 16
});


//icons 
var IconNiveau1 = L.icon({
    iconUrl: 'icone/Niveau1.jpeg',
    iconSize: [10, 10],
  iconAnchor: [10, 10]
});
var IconNiveau2 = L.icon({
    iconUrl: 'Icone/Niveau2.jpeg',
    iconSize: [10, 10],
  iconAnchor: [15, 15]
});
var IconNiveau3 = L.icon({
    iconUrl: 'Icone/Niveau3.jpeg',
    iconSize: [10, 10],
  iconAnchor: [10, 10]
});
var IconNiveau4 = L.icon({
    iconUrl: 'Icone/Niveau4.jpeg',
    iconSize: [10, 10],
  iconAnchor: [10, 10]
});
var IconNiveau5 = L.icon({
    iconUrl: 'Icone/Niveau5.jpeg',
    iconSize: [10, 10],
  iconAnchor: [10, 10]
});
var IconNiveau6 = L.icon({
    iconUrl: 'Icone/Niveau6.jpeg',
    iconSize: [10, 10],
  iconAnchor: [10, 10]
});
var IconNiveau7 = L.icon({
    iconUrl: 'Icone/Niveau7.jpeg',
    iconSize: [10, 10],
  iconAnchor: [10, 10]
});

var  TremblementdeTerreLayer = 
//fetch sur l'API pour aller chercher l'information pour les tremblements de terre de plus de 2.5 de magnétude dans le monde entier dans la dernière semaine.
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson')
  .then(response => response.json())
  .then(data => {
    var earthquakes = data.features;
    // Itération pour visité chaque tremblement de terre de l'API
    earthquakes.forEach(earthquake => {
      var mag = earthquake.properties.mag;
      var coord = earthquake.geometry.coordinates;
      // critère pour appliqué la symbologie sur les tremblements de terre receuilli sur l'API
      if (mag < 3.5) {
        L.marker([coord[1], coord[0]], {
          icon: IconNiveau1
        }).addTo(map);}
        else if (mag >= 3.5 && mag < 5.4){
            L.marker([coord[1], coord[0]], {
              icon: IconNiveau2
            }).addTo(map);}
        else if (mag >= 5.4 && mag <= 6.0){
            L.marker([coord[1], coord[0]], {
                icon: IconNiveau3
            }).addTo(map);}
            else if (mag >= 6.1 && mag <= 6.9){
                L.marker([coord[1], coord[0]], {
                    icon: IconNiveau4
                }).addTo(map);}
                else if (mag >= 7.0 && mag <= 7.9){
                    L.marker([coord[1], coord[0]], {
                        icon: IconNiveau5
                    }).addTo(map);}
                    else if (mag >= 8.0 && mag <= 8.9){
                        L.marker([coord[1], coord[0]], {
                            icon: IconNiveau6
                        }).addTo(map);}
                        else if (mag >= 9.0){
                            L.marker([coord[1], coord[0]], {
                                icon: IconNiveau7
                            }).addTo(map);}
    });
  })
  
//variable pour le layer control
var contextLayer = {
//Importation du Geojson
    "contexte": L.geoJSON(context, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.geogdesc);
        },
//aller chercher le style dans les propriétés du geojson
        style: function (feature) {
            return {
                color: feature.properties.color
            };
        }
    }).addTo(map)
};

//définition de la variable pour mon divIcon
var myIcon = L.divIcon({className: 'my-div-icon'});
var plaqueLayer = {
//Importation du Geojson
    "plaque": L.geoJSON(plaque, {
        onEachFeature: function (feature, layer) {
//Utilisation du la propriété du nom pour créé le divIcon
             layer.bindTooltip(feature.properties.PlateName, {direction:"center",permanent:true, 
             className: 'my-div-icon'});
         },
}).addTo(map)
}


//creation de layer group pour le layer control
var plaqueGroup = L.layerGroup([plaqueLayer["plaque"]]);
var contextGroup = L.layerGroup([contextLayer["contexte"]]);
var tremblementGroup = L.layerGroup(TremblementdeTerreLayer);

//Layer Groups and Layers Control
var baseMaps = {
    "Open Street Map": osm,
    "Stadia Alidade Satellite" : stadia,
    "Esri" : esri
};
var overlays = {
    "plaque tectonique": plaqueGroup,
    "Faille et autres éléments de contexte" : contextGroup,
};
L.control.layers(baseMaps,overlays).addTo(map);

//Ajout de l'échelle
L.control.scale().addTo(map);

//Ajour de la légende
L.control.Legend({
    position: "bottomleft",
    legends: [{
        label: " Moins de 3,5 de magnitude",
        type: "image",
        url: "icone/Niveau1.jpeg",
    }, 
    {
        label: " 3,5 à 5,4 de magnitude",
        type: "image",
        url: "icone/Niveau2.jpeg"
    }, 
    {
        label: " Sous 6,0 de magnitude",
        type: "image",
        url: "icone/Niveau3.jpeg"
    }, 
    {
        label: " 6,1 à 6,9 de magnitude",
        type: "image",
        url: "icone/Niveau4.jpeg"
    }, 
    {
        label: "7,0 à 7,9 de magnitude",
        type: "image",
        url: "icone/Niveau5.jpeg"
    }, 
    {
        label: "8,0 à 8,9 de magnitude",
        type: "image",
        url: "icone/Niveau6.jpeg"
    }, 
    {
        label: "9 et plus de magnitude",
        type: "image",
        url: "icone/Niveau7.jpeg"
    }, 
    {
        label: "Failles",
        type: "polyline",
        color: "#fdc086"
    }, 
    {
        label: "Crêtes",
        type: "polyline",
        color: "#7fc97f"
    }, 
    {
        label: "Trenchés",
        type: "polyline",
        color: "#beaed4"
    }]
}).addTo(map);
