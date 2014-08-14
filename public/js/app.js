var domainParts = window.location.hostname.split('.');
var domainBase = domainParts.slice(-2).join(".");

var subDomains = domainParts.slice(0, -2);
var subDomain = subDomains.slice(0,1).join("");

if(subDomain === "" || subDomain === "www") {
    subDomain = uuid.v4().split('-')[0];
}

function isSubdomain(subDomains) {
    return subDomains.length >= 1 && subDomains[0] != 'www';
}

function getOrigin(sub) {
    var port = window.location.port;
    var origin = window.location.protocol + '//' + sub + '.' + domainBase;
    if (port !== "") {
        origin += ":" + port;
    }
    return origin;
}

function manifestLocation(origin) {
    return origin + '/manifest.webapp';
}

angular.module('testmanifest', [])
.controller('IndexCtrl', function($scope) {
    $scope.manifestLocation = manifestLocation(getOrigin(subDomain));
    $scope.newDomain = getOrigin(subDomain);

    $scope.install = function() {
        if(!navigator.mozApps) {
            alert("Your browser doesn't support app installation. Try Firefox Nightly.");
            return;
        }
        navigator.mozApps.install(manifestLocation(getOrigin(subDomain)));
    };


})
.controller('EditCtrl', function($scope, $http) {
    $http.get("/manifest.raw").success(function(data) {
        $scope.manifest = JSON.stringify(data, null, 4);
    });
    $scope.manifestLocation = manifestLocation(getOrigin(subDomain));
    $scope.newDomain = getOrigin(subDomain);
    $scope.manifest = "";
    $scope.subDomain = subDomain;
    $scope.getSubURL = function(suffix) {
        return getOrigin(subDomain + suffix);
    };

    $scope.install = function() {
        if(!navigator.mozApps) {
            alert("Your browser doesn't support app installation. Try Firefox Nightly.");
            return;
        }
        navigator.mozApps.install(manifestLocation(window.location.origin));
    };
});
