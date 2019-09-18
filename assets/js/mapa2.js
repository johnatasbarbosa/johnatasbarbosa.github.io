//Atividades domésticas

var map;
var marcado = false;
var overlays = [];
      
function initMap() {
    console.log("initMap");
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -14.793962392255583, lng: -39.04142079172203},
        zoom: 15,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER
        },
        //zoomControl: boolean,
        //mapTypeControl: boolean,
        //scaleControl: false,
        streetViewControl: false,
        //rotateControl: boolean,
        fullscreenControl: false,
        //mapTypeId: google.maps.MapTypeId.SATELLITE
        mapTypeId: 'hybrid'
        //mapTypeId: google.maps.MapTypeId.HYBRID
    });
    
    google.maps.event.addListener(map, 'click', function( event ){
        if(!marcado){
            var houseCircle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: map,
                draggable: true,
                center: event.latLng,
                radius: 100
            });
            marcado = true;
            overlays.push(houseCircle);
        }
    });
}
