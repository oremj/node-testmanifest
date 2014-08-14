var domainParts = window.location.hostname.split('.');
var domainBase = domainParts.slice(-2).join(".");

var subDomains = domainParts.slice(0, -2);
var subDomain = subDomains.slice(0,1).join("");

if(subDomain === "") {
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

$(function() {
    $.get("/manifest.webapp", function(data) {
        $('#manifest').val(JSON.stringify(data, null, 4));
    });
    $('#domainlist')
        .append($('<li>').text(window.location.origin))
        .append($('<li>').html(getOrigin(subDomain + '<span>-1</span>')))
        .append($('<li>').html(getOrigin(subDomain + '<span>-2</span>')))
        .append($('<li>').html(getOrigin(subDomain + '<span>-new</span>')))
        .append($('<li>').html(getOrigin(subDomain + '<span>-&lt;anything&gt;</span>')));

    $('#edit').attr('href', getOrigin(subDomain));
    $('#thingy').val(manifestLocation(getOrigin(subDomain)));
    $('#install').click(function(e) {
        e.preventDefault();
        if(!navigator.mozApps) {
            alert("Your browser doesn't support app installation. Try Firefox Nightly.");
            return;
        }
        if(isSubdomain(subDomains)) {
            navigator.mozApps.install(manifestLocation(window.location.origin));
        } else {
            navigator.mozApps.install(manifestLocation(getOrigin(subDomain)));
        }
    });
    $('#thingy')[0].focus();
    $('#thingy')[0].select();

    $('#browserid').click(function(e) {
        e.preventDefault();
        navigator.id.get(gotAssertion);
        return false;
    });
});

function loggedIn(res) {
    $('#locking').hide();
    $('#locking').html(res);
    $('#locking').fadeIn();
    updateLoggedin();
}

function loggedOut(res) {
    alert('logged out!');
}

$('#locking').delegate('.lock-input', 'click', function(e) {
    e.preventDefault();

    var $this = $(this),
        action = $this.attr('data-action');

    $.post('/lock', {'action': action}, function(d) {
        $('#locking').html(d);
        updateLoggedin();
    });
});

function updateLoggedin() {
    if($('#locking').find('.lock-input').length) {
        $('.is_locked').removeClass('is_locked').addClass('is_unlocked');
    }
}

function gotAssertion(assertion) {
  // got an assertion, now send it up to the server for verification
  if (assertion !== null) {
    $.ajax({
      type: 'POST',
      url: '/login',
      data: { assertion: assertion },
      success: function(res, status, xhr) {
        if (res === null) {}//loggedOut();
          else loggedIn(res);
        },
      error: function(res, status, xhr) {
        alert("login failure" + res);
      }
    });
  } else {
    loggedOut();
  }
}
