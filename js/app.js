
    
    var initialLocations = [
	{
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
       name:'University of Hyderabad' ,
        lat:17.463087,
        lng:78.333979
    },
    {   name:'KBR National Park',
        lat: 17.422657, 
        lng:78.416451
    },
    {
      name:'Lanco Hills',
        lat:17.411028, 
        lng:78.375252
    },
	{
		name: 'IIIT Hyderabad',
		lat: 17.447156,
		lng:78.3465713
	},
	{
		name: 'ISB Hyderabad',
		lat: 17.42596768,
		lng: 78.3153504
	},
	{
		name: 'Golkonda Fort',
		lat: 17.383379,
		lng:  78.401181
	},
	{
		name: 'Nehru Garden',
		lat: 17.353136,
		lng: 78.4500068
	},
	{
		name: 'Charminar',
		lat: 17.361717,
		lng: 78.475016
	},
        {
            name:'Snow world',
            lat:17.414265,
            lng:78.480646
        }
	
];
    
     var map;
    
    
    var Location = function(data){
       var self = this;
        this.name = data.name;
        this.lat = data.lat;
	    this.lng = data.lng;
        this.visible = ko.observable(true);
       // this.contentString = '<b>'+self.name +'</b>';
        this.infoWindow = new google.maps.InfoWindow({content: self.contentString});
        this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(data.lat, data.lng),
			map: map,
			title: data.name
            });
        
         this.marker.addListener('click', function() {
             self.contentString = '<b>'+self.name +'</b>';
             self.infoWindow.setContent(self.contentString);     
            self.infoWindow.open(map, self.marker);
        });

  
    }
    
    
    
    function AppViewModel() {
	var self = this;

	this.searchTerm = ko.observable("");

	this.locationList = ko.observableArray([]);

	map = new google.maps.Map(document.getElementById('map'), {
			zoom: 11,
			center: {lat: 17.44, lng: 78.34}
	});


	initialLocations.forEach(function(locationItem){
		self.locationList.push( new Location(locationItem));
	});

    this.currentLocation = ko.observable(this.locationList()[0]);
    this.setLocation = function(clickedLoc){
        self.currentLocation(clickedLoc);
    }

}

    
function startApp() {
    	ko.applyBindings(new AppViewModel());
}
    
