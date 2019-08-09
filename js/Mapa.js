// This example requires the Drawing library. Include the libraries=drawing
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=drawing">

var map;
var drawingManager;
var ultimoDesenho;
var cancelarDesenho = false;
var overlays = [];
var id = 0;
      
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -14.793962392255583, lng: -39.04142079172203},
        zoom: 15,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.RIGHT_TOP
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
    
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    
    drawingManager = new google.maps.drawing.DrawingManager({
        //drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: false,
        //drawingControl: true,
        //drawingControlOptions: {
        //    position: google.maps.ControlPosition.TOP_CENTER,
        //    drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
        //},
        //markerOptions: { icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png' },
        //markerOptions: {
        //    animation: google.maps.Animation.DROP,
        //    icon: new google.maps.MarkerImage('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'),
        //    //draggable: true,
        //    flat: true,
        //    raiseOnDrag: true
        //},
        polylineOptions: {
            strokeColor: 'red',
            // fillColor: 'red',
            // fillOpacity: 0.5,
            // strokeWeight: 2,
            // strokeOpacity: 0.8,
            //clickable: true,
            //editable: true,
            //draggable: true,
            zIndex: 1
        },
        polygonOptions: {
            fillColor: '#cccccc',
            fillOpacity: 0.5,
            strokeWeight: 2,
            strokeOpacity: 0.8,
            //clickable: true,
            //editable: true,
            //draggable: true,
            zIndex: 1
        }
    });
    drawingManager.setMap(map);
    //drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
     //drawingManager.setDrawingMode(null);

    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });
    var markers = [];
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            console.log("place", place);
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
            console.log(place.geometry.location.lat() + ", " + place.geometry.location.lng());
        });
        map.fitBounds(bounds);
        map.setZoom(15);
        var localName = input.value;
    })

    function mudando(num) {
        console.log("mudando " + num);
        //console.log("event", e);
        //$('#overlayModal').modal('show');
    }

    function mudou(num, coordenadas) {
        console.log("mudou " + num);
        App.formulario.paginas.forEach(function (pagina) {
            pagina.conteudos.forEach(function (conteudo) {
                if (conteudo.tipo == 11) {
                    conteudo.resposta.desenhos.forEach(function (desenho, index) {
                        if (desenho.indexOverlay == num) {
                            desenho.coordenadas = coordenadas;
                            App.desenhoEditando = index;
                        }
                    })
                }
            })
        })
    }

    function selecionar(num) {
        console.log("clicou " + num);

        if(App.formulario.paginas[App.paginaAtual].conteudos[App.conteudoSelecionado].valor == 2 || App.formulario.paginas[App.paginaAtual].conteudos[App.conteudoSelecionado].valor == 4){
            if(App.selecionandoDesenhoExcluir && num > App.indexOverlayPodeExcluir){
                overlays[num - 1].setMap(null);
            }
        }
        else
            App.formulario.paginas.forEach(function (pagina, indexPagina) {
                pagina.conteudos.forEach(function (conteudo, indexConteudo) {
                    if (conteudo.tipo == 11) {
                        if(conteudo.valor == 2 || conteudo.valor == 3 || conteudo.valor == 4) return;
                        conteudo.resposta.desenhos.forEach(function (desenho, indexDesenho) {
                            if (desenho.indexOverlay == num) {
                                console.log(indexPagina, indexConteudo, indexDesenho);
                                App.editarDesenho(indexPagina, indexConteudo, indexDesenho);
                            }
                        })
                    }
                })
            })
    }

    function tooltipMouse(e){
        //if(e.wa){
        //    var tooltip = document.querySelector("#tooltipEsporte");
        //    tooltip.style.display = "block";
        //    console.log(tooltip);
        //    console.log(this);
        //    tooltip.style.left = e.wa.pageX + 15 + 'px';
        //    tooltip.style.top = e.wa.pageY + 15 + 'px';
        //    console.log(e.wa.pageX, e.wa.pageY);
        //    console.log("event", e);
        //}
    }

    function mousesaiu(e){
        //var tooltip = document.querySelector("#tooltipEsporte");
        //tooltip.style.display = "none";
        //console.log(tooltip);
        //console.log(this);
        }

    function verificar(num) {
        App.formulario.paginas.forEach(function (pagina) {
            pagina.conteudos.forEach(function (conteudo) {
                if (conteudo.tipo == 11) {
                    conteudo.resposta.desenhos.forEach(function (desenho) {
                        if (desenho.indexOverlay == num)
                            console.log(desenho.respostasDesenho[0].texto);
                    })
                }
            })
        })
    }

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
        if (cancelarDesenho == true) {
            event.overlay.setMap(null);
            cancelarDesenho = false;
            return;
        }
        id += 1;
        var num = id;
        event.overlay.addListener('click', function () {
            selecionar(num);
            console.log(num);
        });
        //event.overlay.addListener('click', selecionar);
        var valor = App.formulario.paginas[App.paginaAtual].conteudos[App.conteudoSelecionado].valor;
        event.overlay.addListener('mouseover', function(){
            if(App.selecionandoDesenhoExcluir && valor == 2 && num > App.indexOverlayPodeExcluir)
                this.setCursor('not-allowed');
            if(App.selecionandoDesenhoExcluir && valor == 4 && num > App.indexOverlayPodeExcluir){
                console.log("Definindo cursor");
                //this.setOptions({draggableCursor: 'url(http://pngimg.com/uploads/cursor/cursor_PNG11.png), not-allowed;'});
            }
            console.log('mouseover');
        });
        event.overlay.addListener('mouseout', function(){
            console.log(this);
            if(valor == 2)
                this.setCursor('grap');
            console.log('mouseout');
        });

        event.overlay.addListener('mousemove', tooltipMouse);
        //event.overlay.addListener('mouseout', mousesaiu);
        //event.overlay.addListener('drag', function () {
        //    mudando(num);
        //});
        event.overlay.addListener('dragend', function (e) {
            console.log('dragend');
            console.log(e);
            var coordenadas = [];
            coordenadas.push(new Coordenada({ Latitude: event.overlay.getPosition().lat(), Longitude: event.overlay.getPosition().lng() }));
            mudou(num, coordenadas);
        });
        var desenho = new Desenho();
        overlays.push(event.overlay);
        desenho.indexOverlay = id;
        //desenho.indexOverlay = overlays.length - 1;
        if (event.type == 'marker') {
            var radius = event.overlay.getPosition();
            desenho.coordenadas.push(new Coordenada({ Latitude: event.overlay.getPosition().lat(), Longitude: event.overlay.getPosition().lng() }));
            //var coordenada = new Coordenada();
            //coordenada.latitude = event.overlay.getPosition().lat();
            //coordenada.longitude = event.overlay.getPosition().lng();
            event.overlay.getPosition().lat();
            event.overlay.getPosition().lng();
            //desenho.coordenadas.push(coordenada);
            console.log(radius);
        }
        //if (event.type == 'circle') {
        //    var radius = event.overlay.getRadius();
        //    event.overlay.center.lat();
        //    event.overlay.center.lng();
        //    event.overlay.radius;
        //    console.log(radius);
        //}
        if (event.type == 'polygon') {
            var radius = event.overlay.getPath().getArray();
            radius.forEach(function (e) {
                desenho.coordenadas.push(new Coordenada({ Latitude: e.lat(), Longitude: e.lng() }));
                console.log(e.lat());
                console.log(e.lng());
            });
            console.log(radius);
        }
        if (event.type == 'polyline') {
            var radius = event.overlay.getPath().getArray();
            radius.forEach(function (e) {
                desenho.coordenadas.push(new Coordenada({ Latitude: e.lat(), Longitude: e.lng() }));
                console.log(e.lat());
                console.log(e.lng());
            });
            var radius = event.overlay.getPath();
            console.log(radius);
        }
        //if (event.type == 'rectangle') {
        //    var radius = event.overlay.getBounds();
        //    event.overlay.getBounds().ia;//.j e .l
        //    event.overlay.getBounds().na;//.j e .l
        //    console.log(radius);
        //}

        completouDesenho = true;
        console.log("modalConteudoDesenho abrindo");
        App.abrirConteudosDesenho(desenho);
    });
        
    google.maps.event.addListener(map, 'click', function( event ){
        console.log(event);
        console.log( "Latitude: "+event.latLng.lat()+" "+", longitude: "+event.latLng.lng() ); 
    });

    google.maps.event.addListenerOnce(map, 'idle', function () {
        if (App.formulario.paginas[App.paginaAtual].zoomLevel != 0) {
            console.log("Definindo localização");
            var latlng = new google.maps.LatLng(parseFloat(App.formulario.paginas[App.paginaAtual].latitude), parseFloat(App.formulario.paginas[App.paginaAtual].longitude));
            console.log(latlng);
            console.log(map);
            map.panTo(latlng);
            //map.setCenter({ lat: this.formulario.paginas[this.paginaAtual].latitude, lng: this.formulario.paginas[this.paginaAtual].longitude });
            map.setZoom(parseInt(App.formulario.paginas[App.paginaAtual].zoomLevel));
        }
        //google.maps.event.removeListener(listener);
    });

    google.maps.event.addListener(map, 'dragend', function() { 
        console.log("dragend");
        dragend = true;
    });

}

//document.addEventListener("touchstart", function (e) {
//    console.log(e.defaultPrevented);  // will be false
//    e.preventDefault();   // does nothing since the listener is passive
//    console.log(e.defaultPrevented);  // still false
//}, Modernizr.passiveeventlisteners ? { passive: true } : false);

function selecionarDesenhoExcluir(){
    drawingManager.setDrawingMode(null);
    // map.setOptions({draggableCursor:'not-allowed'});
    var tooltip = document.querySelector("#tooltipEsporte");
    tooltip.style.display = "none";
}

function overlaysLength(){
    return overlays.length;
}

var comecouDesenharPolyline = true;
var completouDesenho = false;
var dragend = false;
var possuiEvento = false;
function eventoClick(){
    console.log("click");
    if(!possuiEvento){
        var gmDomHackSelect = $('.gm-style').children().eq(0);
        gmDomHackSelect.mousemove(function(e) {
            if(!comecouDesenharPolyline && !completouDesenho && e){
                //console.log(e.pageX, e.pageY);
                var tooltip = document.querySelector("#tooltipEsporte");
                tooltip.style.display = "block";
                tooltip.style.left = e.pageX + 15 + 'px';
                tooltip.style.top = e.pageY + 15 + 'px';
            }
        })
        gmDomHackSelect.click(function(e){
            console.log("clique");
            if(App.formulario.paginas[App.paginaAtual].conteudos[App.conteudoSelecionado] && App.formulario.paginas[App.paginaAtual].conteudos[App.conteudoSelecionado].valor == 4){
                if(!comecouDesenharPolyline && dragend) dragend = false;
                if(comecouDesenharPolyline && !completouDesenho){
                    console.log("comecouDesenharPolyline && !completouDesenho");
                    //alert("dsfdsf");
                    comecouDesenharPolyline = false;
                }
                if(completouDesenho || dragend){
                    console.log("completouDesenho || dragend");
                    completouDesenho = false;
                    comecouDesenharPolyline = true;
                    dragend = false;
            
                    var tooltip = document.querySelector("#tooltipEsporte");
                    tooltip.style.display = "none";
                }
            }
        });
        possuiEvento = true;
    }
}