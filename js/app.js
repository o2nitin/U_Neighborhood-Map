
//model data
var initialLocations = [{
        name: 'Birla Mandir',
        lat: 17.4062367,
        lng: 78.4668714
    },
    {
        name: 'Buddha Statue',
        lat: 17.4108026,
        lng: 78.4677941
    },
    {
        name: 'University of Hyderabad',
        lat: 17.463087,
        lng: 78.333979
    },
    {
        name: 'Kasu Brahmananda Reddy National Park',
        lat: 17.422657,
        lng: 78.416451
    },
    {
        name: 'Manikonda',
        lat: 17.411028,
        lng: 78.375252
    },
    {
        name: 'International Institute of Information Technology',
        lat: 17.447156,
        lng: 78.3465713
    },
    {
        name: 'Indian School of Business',
        lat: 17.42596768,
        lng: 78.3153504
    },
    {
        name: 'Golkonda',
        lat: 17.383379,
        lng: 78.401181
    },
    {
        name: 'Nehru Zoological Park',
        lat: 17.353136,
        lng: 78.4500068
    },
    {
        name: 'Charminar',
        lat: 17.361717,
        lng: 78.475016
    },
    {
        name: 'Snow world',
        lat: 17.414265,
        lng: 78.480646
    }

];

var map;
var infoWindow;
var $wikiElem = $('#wikipedia-header');

// my octopus (controller)
var Location = function(data) {
    var self = this;
    this.name = data.name;
    this.lat = data.lat;
    this.lng = data.lng;
    this.description = "";
    this.url = "";
    this.visible = ko.observable(true);
    infoWindow = new google.maps.InfoWindow({
        content: self.contentString
    });
    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.lng),
        map: map,
        title: data.name
    });

    this.showMarker = ko.computed(function() {
        if (this.visible() === true) {
            this.marker.setVisible(true);
        } else {
            this.marker.setVisible(false);
        }
        return true;
    }, this);


    this.wikiLinks = ko.observableArray([]);
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + self.name + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("failed to get Some or all wikipedia resources please Reload the page");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function(response) {
            self.wikiLinks = "";
            self.wikiLinks = response[1];
            self.description = response[2][0];
            self.url = response[3][0];

            clearTimeout(wikiRequestTimeout);
        }
    });

    this.marker.addListener('click', function() {
        self.contentString = '<b>' + self.name + '</b><div>' + self.description + '</div>';
        self.marker.setAnimation(google.maps.Animation.BOUNCE);
      	setTimeout(function() {
      		self.marker.setAnimation(null);
     	}, 2100);
        infoWindow.setContent(self.contentString);
        infoWindow.open(map, self.marker);
        self.clickList(self);
    });
}


// ViewModel for app
function AppViewModel() {
    var self = this;
    this.searchItem = ko.observable("");
    this.locationList = ko.observableArray([]);
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: {
            lat: 17.44,
            lng: 78.34
        }
    });

    initialLocations.forEach(function(locationItem) {
        self.locationList.push(new Location(locationItem));
    });

    this.currentLocation = ko.observable(this.locationList()[0]);
    this.setLocation = function(clickedLoc) {
        self.currentLocation(clickedLoc);
        google.maps.event.trigger(clickedLoc.marker, 'click');
    }

    this.filteredList = ko.computed(function() {
        var filter = self.searchItem().toLowerCase();
        if (!filter) {
            self.locationList().forEach(function(locationItem) {
                locationItem.visible(true);
            });
            return self.locationList();
        } else {
            return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
                var string = locationItem.name.toLowerCase();
                var result = (string.search(filter) >= 0);
                locationItem.visible(result);
                return result;
            });
        }
    }, self);

}

//applyBindings
function startApp() {
    ko.applyBindings(new AppViewModel());
}

function errorHandling() {
	alert("Google Maps has failed to load....! check internet");
}
