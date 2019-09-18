// This example requires the Drawing library. Include the libraries=drawing
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=drawing">

var map;
var cancelarDesenho = false;
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
    
    drawingManager = new google.maps.drawing.DrawingManager({
        //drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: false,
        //drawingControl: true,
        //drawingControlOptions: {
        //    position: google.maps.ControlPosition.TOP_CENTER,
        //    drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
        //},
        //markerOptions: { icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png' },
        markerOptions: {
            //animation: google.maps.Animation.DROP,
            //icon: new google.maps.MarkerImage('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'),
            draggable: true,
            flat: true,
            raiseOnDrag: true
        }
    });
    drawingManager.setMap(map);
    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
    //drawingManager.setDrawingMode(null);

    
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
        drawingManager.setDrawingMode(null);
        $("#boxMapa").css("display", "block");
        var num = overlays.length;
        overlays.push(event.overlay);
        event.overlay.addListener('click', function () {
            excluirMarker(num);
        });
    });
    
}

function excluirMarker(num){
    if(cancelarDesenho){
        overlays[num].setMap(null);
        $("#boxMapa").css("display", "block");
    }
}

function excluirMarcacao(){
    $("#boxMapa").css("display", "none");
    drawingManager.setDrawingMode(null);
    cancelarDesenho = true;
}

function naoMarcacao(){
    $slider.slick('slickNext');
}

function simMarcacao(){
    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
    $("#boxMapa").css("display", "none");
}
