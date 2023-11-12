var map;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    var latlng = new google.maps.LatLng(lat, lon);

    // Inicializar o mapa
    var mapOptions = {
        center: latlng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL,
        },
    };

    map = new google.maps.Map(document.getElementById("mapholder"), mapOptions);

    // Adicionar um marcador para a posição atual
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: "Você está aqui!",
    });

    // Reverse geocoding para obter a cidade
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latlng }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                var city = getCity(results[0]);
                alert("Cidade: " + city);
            }
        } 
        // else {
        //     alert("Geocoding falhou devido a: " + status);
        // }
    });
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("O usuário negou a solicitação de Geolocalização.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Informações de localização estão indisponíveis.");
            break;
        case error.TIMEOUT:
            alert("A solicitação para obter a localização do usuário expirou.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Ocorreu um erro desconhecido ao obter a localização do usuário.");
            break;
    }
}

function getCity(geocodeResponse) {
    var type = "locality";
    for (var i = 0; i < geocodeResponse.address_components.length; i++) {
        for (var j = 0; j < geocodeResponse.address_components[i].types.length; j++) {
            if (geocodeResponse.address_components[i].types[j] == type) {
                return geocodeResponse.address_components[i].long_name;
            }
        }
    }
    return "";
}