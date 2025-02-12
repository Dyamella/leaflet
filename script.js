// Initialiser la carte
var map = L.map('map', {
center: [48.11, -1.64],
zoom: 12,
attributionControl: true});

// Ajouter une attribution personnalisée directement via la carte
map.attributionControl.addAttribution
('Réalisation: <a href= "https://sites-formations.univ-rennes2.fr/mastersigat/" target="_blank">MAster SIGAT</a> / Sources : OSM et Rennes Métropole');

// Ajouter des fonds de carte
var baselayers = {
OSM: L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png').addTo(map),
ESRI:L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.png'),
CARTO: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'),
OrthoRM:L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',{layers: 'raster:ortho2021'}),
PlanRM:L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',{layers:'ref_fonds:pvci_simple_gris'})
};


// Ajouter l'echelle cartographique
L.control.scale().addTo(map);

// Ajouter une MiniMap
var miniMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png');
var miniMap = new L.Control.MiniMap(miniMapLayer, { toggleDisplay: true,
minimized: false, position: 'bottomright'
}).addTo(map);


//Ajout des WMS:
//Ajout Cadastre
var Cadastre = L.tileLayer.wms('http://geobretagne.fr/geoserver/cadastre/wms',
{layers: 'CP.CadastralParcel',format: 'image/png',transparent: true, opacity :0.5});
//Ajout Bâtiments
var Batiments = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',
{layers: 'ref_cad:batiment',format: 'image/png',transparent: true});
//Ajout Aménagements cyclables
var velo = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',
{layers: 'trp_doux:v_voirie_amenagement_velo',format: 'image/png',transparent: true});
//Ajout Trafic en temps réel
var trafic = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',
{layers: 'trp_rout:v_rva_trafic_fcd',format: 'image/png',transparent: true});


// Ajouter marqueur Rennes 2
var popuprennes2 = '<h1>Université Rennes 2 </h1> <br> <img src="https://www.wiki-rennes.fr/images/5/58/Campus_villejean.jpg" width="350px">';

var customOptions = {'maxWidth': '500', 'className' : 'custom'}

var rennes2icone = L.icon({iconUrl:'https://media.theapolis.de/uploads/organization/655cb49559dee.png',
iconSize: [30, 30] });

var Rennes2 = L.marker([48.119, -1.7013],{icon: rennes2icone}).bindPopup(popuprennes2,customOptions);


//Ajout marqueur Gare
var popupGare = '<h1>Gare de Rennes </h1> <br> <img src="https://fr.wikipedia.org/wiki/Gare_de_Rennes#/media/Fichier:Gare_de_Rennes_-_August_2024.jpg" width="350px">';

var customOptions = {'maxWidth': '500', 'className' : 'custom'}

var Gareicone = L.icon({iconUrl:'https://upload.wikimedia.org/wikipedia/commons/f/f4/Sncf-logo.svg',
iconSize: [30, 30] });

var Gare = L.marker([48.103, -1.672],{icon: Gareicone}).bindPopup('<b>Gare de Rennes</b>');

// Ajouter un gestionnaire d'événements pour le survol (hover)
Gare.on('mouseover', function (e) {
this.openPopup();
});

// Ajouter un gestionnaire d'événements pour quitter le survol (hover)
Gare.on('mouseout', function (e) {
this.closePopup();
});


// Ajout des Stations de vélos
var url = 'https://raw.githubusercontent.com/mastersigat/data/main/velostar.geojson';
$.getJSON(url, function (geojson) {
var velos = L.geoJson(geojson).addTo(map);
  
// Ajout Popup
velos.bindPopup(function(velos) {console.log(velos.feature.properties);
return "<h1> Station : "+velos.feature.properties.nom+"</h1>"+"<hr><h2>"
+velos.feature.properties.nombreemplacementstheorique+ "&nbsp; vélos</h2>" ;
});
  
});


//Gestion des markeurs
var couches = {"Université de Rennes 2": Rennes2, "Gare de Rennes": Gare, "Cadastre": Cadastre, "Batiments": Batiments, "velo": velo, "trafic": trafic};

// Ajouter le controleur de couches
//var menu1 = L.control.layers(baselayers, null, {position: 'topleft', collapsed : false }).addTo(map);
//var menu2 = L.control.layers(null, couches, {position: 'topright', collapsed : false }).addTo(map);
// Fonction pour ajouter un titre à un menu
function ajouterTitre(menu, titre) {
    var container = menu.getContainer();
    var titreElement = L.DomUtil.create('div', 'menu-title', container);
    titreElement.innerHTML = `<strong>${titre}</strong>`;
}

// Ajouter le contrôleur de couches
var menu1 = L.control.layers(baselayers, null, {position: 'topleft', collapsed: false }).addTo(map);
var menu2 = L.control.layers(null, couches, {position: 'topright', collapsed: false }).addTo(map);

// Ajouter les titres
ajouterTitre(menu1, "Fonds de carte");
ajouterTitre(menu2, "Couches thématiques");

// Ajouter un peu de style CSS (optionnel)
var style = document.createElement('style');
style.innerHTML = `
    .menu-title {
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 5px;
    }
`;
document.head.appendChild(style);