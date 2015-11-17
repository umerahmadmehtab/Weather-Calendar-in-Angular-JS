var app = angular.module("WeatherCalendar", []);
var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
app.run(function(){
 
});
 app.factory('weatherService', ['$http', '$q', function ($http, $q){
      function getWeather() {
        var deferred = $q.defer();
        $http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22islamabad%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys')
          .success(function(data){
            deferred.resolve(data.query.results.channel);
          })
          .error(function(err){
            console.log('Error retrieving markets');
            deferred.reject(err);
          });
        return deferred.promise;
      }
      
      return {
        getWeather: getWeather
      };
    }]);

function loadWeather() {
		console.log(localStorage.getItem('json'));
		var formData = JSON.parse(localStorage.getItem('json'));
		if(formData != null) {
			return buildForm(formData);
		}
	}

app.controller("calendarController", ['$scope','weatherService',function($scope,weatherService) {
    
    if (typeof (date) === 'undefined') {
        date = new Date();
    } else {
        date = new Date(date);
    }

    var year = date.getFullYear(),
            month = date.getMonth(),
            todate = (new Date()),
            monStr = monthNames[month],
            day = date.getDate(),
            dayInMon = (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();
            
            
            
    $scope.currMonth = monStr + ", " + year.toString();
    $scope.preMonth = new Date(year, month - 1, day);
    $scope.nextMonth = new Date(year, month + 1, day);
    $scope.todate = todate;
    $scope.weeks = new Array([],[],[],[],[],[],[]);
    

    
    
    var monthStartDate = (new Date(date.getFullYear(), date.getMonth(), 1));
    var monthStartDay = monthStartDate.getDay();
    var LastDayPrevMonth = new Date(year, month, 0);

    if (monthStartDay === 0) {
        monthStartDay = 7;
    }

    var preMonDayIte = monthStartDay - 1;
    var preMonDateIte = 0;
    var weekSlot = 0;
    while (preMonDayIte > 0) {
        var preMonDate = new Date(year, month, preMonDateIte--);
        var day = {};
        day.number = preMonDate.getDate();
        day.id = 'pre_'+day.number;
        day.class = "disabled";
        day.data = day.number + "  ";
        $scope.weeks[weekSlot].push(day);
        preMonDayIte--;
    }
    $scope.weeks[weekSlot].reverse();
    var weekHasSpace = 7-$scope.weeks[0].length;
    if(weekHasSpace<1){
        weekSlot++;
        weekHasSpace = 7;
    }
    
    var dayIte = monthStartDay;
    for (var dateIte = 1; dayIte < 43, dateIte < dayInMon + 1; dayIte++, dateIte++) {
        var date = new Date(year, month, dateIte);
        
        var isToday = ((todate.getDate() === date.getDate()) ? true : false);
        var day = {};
        day.number = date.getDate();
        day.id = 'curr_'+day.number;
        day.weather = ' ';
        day.data = day.number + " " + day.weather;
        day.class = (isToday)?"today":"";
            var weekHasSpace = 7-$scope.weeks[weekSlot].length;
        if(weekHasSpace<1){
            weekSlot++;
            weekHasSpace = 7;
        }

        $scope.weeks[weekSlot].push(day);
    }

    var nextMonDayIte = dayIte;
    var nextMonDateIte = 1;
    while (nextMonDayIte < 43) {
        var nextMonDate = new Date(year, month + 1, nextMonDateIte++);
        var day = {};
        day.number = nextMonDate.getDate();
        day.id = 'next_'+day.number;
        day.class = "disabled";
        day.data = day.number + " ";
        var weekHasSpace = 7-$scope.weeks[weekSlot].length;
        if(weekHasSpace<1){
            weekSlot++;
            weekHasSpace = 7;
        }

        $scope.weeks[weekSlot].push(day);
        
        
        nextMonDayIte++;
    }
    
    weatherService.getWeather().then(function(data){
        $scope.weather = data;
        document.getElementsByClassName('today')[0].innerHTML = data.item.condition.temp+" °F "+data.item.condition.text;
        console.log($scope.weather);
    });
    
}]);

function createMonthlyView(date) {
    if (typeof (date) === 'undefined') {
        date = new Date();
    } else {
        date = new Date(date);
    }

    var year = date.getFullYear(),
            month = date.getMonth(),
            monStr = monthNames[month],
            day = date.getDate(),
            dayInMon = (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();

    $("#currMonth").html("<div class='calCap'>" + monStr + ", " + year.toString() + "</div>");

    var previous = "<a href='#' id='a_previousMonth' data-transition='slide' class='previous-btn icon left'>Previous</a>";
    $("#preMonth").html(previous);

    $("#a_previousMonth").click(function(event) {
        createMonthlyView(new Date(year, month - 1, day));
    });

    var next = "<a href='#' id='a_nextMonth' data-transition='slide' class='next-btn icon right'>Next</a>";
    $("#nextMonth").html(next);
    $('#a_nextMonth').click(function(event) {
        createMonthlyView(new Date(year, month + 1, day));
    });

    var monthStartDate = (new Date(date.getFullYear(), date.getMonth(), 1));
    var monthStartDay = monthStartDate.getDay();
    var LastDayPrevMonth = new Date(year, month, 0);
    
    if (monthStartDay === 0) {
        monthStartDay = 7;
    }

    var preMonDayIte = monthStartDay - 1;
    var preMonDateIte = 0;
    while (preMonDayIte > 0) {
        var preMonDate = new Date(year, month, preMonDateIte--);

        $("#day" + preMonDayIte).html(preMonDate.getDate());
        $("#day" + preMonDayIte).addClass("disabled");
        preMonDayIte--;
    }
    var dayIte = monthStartDay;
    for (var dateIte = 1; dayIte < 43, dateIte < dayInMon + 1; dayIte++, dateIte++) {
        var date = new Date(year, month, dateIte);
        var dayHtml = "<input type='hidden' value='" + date.toString() + "' id='date_" + dayIte + "'>"
                + "<label id='dateLabel_" + dayIte + "'>" + date.getDate() + "</label>";
        $("#day" + (dayIte)).html(dayHtml);

        document.getElementById("day" + (dayIte)).onclick = onDayClicked(dayIte);

    }

    var nextMonDayIte = dayIte;
    var nextMonDateIte = 1;
    while (nextMonDayIte < 43) {
        var nextMonDate = new Date(year, month + 1, nextMonDateIte++);
        //console.log(nextMonDate.toString());
        $("#day" + nextMonDayIte).html(nextMonDate.getDate());
        $("#day" + nextMonDayIte).addClass("disabled");
        nextMonDayIte++;
    }

    $("#monthlyViewData").bind("swipeLeft", function() {
        createMonthlyView(new Date(year, month + 1, day));
    });
    $("#monthlyViewData").bind("swipeRight", function() {
        alert("swipe Right");
        createMonthlyView(new Date(year, month - 1, day));

    });

}