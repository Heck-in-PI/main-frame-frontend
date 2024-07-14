var output = document.getElementById("output");
var socket = new WebSocket("ws://"+location.host+":8080/api/v1/modules/wifi/viewer");

socket.onopen = function () {
  output.innerHTML += "Status: Connected\n";
};

socket.onmessage = function (e) {
  var map = new Map(Object.entries(JSON.parse(e.data)));
  // strength | name | mac | channel | freq
  var viewerList = document.getElementById("viewer-list");
  viewerList.innerHTML = '<li class="viewer-item" style="margin-bottom: 1.1rem;">\
          <span class="bx bx-wifi viewer-item-icon"></span>\
          <div class="viewer-item-text-container">\
            <span class="viewer-item-text-name" id="id1">name</span>\
            <span class="viewer-item-text-mac" id="id2">mac</span>\
            <span class="viewer-item-text-channel" id="id3">channel</span>\
          </div>\
          <span class="bx bx-lock viewer-item-icon"></span>\
        </li>'

  var viewerListClient = document.getElementById("viewer-list-client");
  viewerListClient.innerHTML = '<li class="viewer-item" style="margin-bottom: 1.1rem;">\
          <div class="viewer-item-text-container-client">\
            <span class="viewer-item-text">client name</span>\
            <span class="viewer-item-text">client mac</span>\
            <span class="viewer-item-text">ap mac</span>\
          </div>\
        </li>\
        <div class="module-element">\
          <div class="attack-item-text" id="client-scan">deauth</div>\
        </div>'
  for (const [apKey, apValue] of map) {

    apList(apValue);
    if (Object.keys(apValue.Clients).length > 0) {

      for (const [clientKey, clientValue] of Object.entries(apValue.Clients)) {
        clientList(apKey,clientValue);
      }
    }
  }

  socket.send("ack");
};

window.onbeforeunload = function() {
  socket.close();
};

function attackExpender2(id) {

  socket.close();

  var coll = document.getElementById(id);
  var content = coll.nextElementSibling;
  if (content.style.maxHeight){
      content.style.maxHeight = null;
      window.location.reload();
  } else {
      content.style.maxHeight = content.scrollHeight + "px";
  } 

  
}

function deauther(apMac,clientMac) {
    
  var deauthBody =  { "body": { "apMac": apMac, "clientMac": clientMac, }, };
  v1ModulesWifiDeauthPost(deauthBody);

}


function apList(json) {

  var liElem = document.createElement("li");
  liElem.className = "viewer-item";
  liElem.id = json.hostname;

  var wifiStrength = document.createElement("span");
  if (json.rssi > -51) {
    wifiStrength.className = "bx bx-wifi viewer-item-icon";
    wifiStrength.style.color = "#00FF00";
  } else if (json.rssi > -101) {
    wifiStrength.className = "bx bx-wifi-2 viewer-item-icon";
    wifiStrength.style.color = "#99ff00";
  } else if (json.rssi > -151) {
    wifiStrength.className = "bx bx-wifi-1 viewer-item-icon";
    wifiStrength.style.color = "#FFFF00";
  } else {
    wifiStrength.className = "bx bx-wifi-0 viewer-item-icon";
    wifiStrength.style.color = "#FF0000";
  }
  liElem.appendChild(wifiStrength);
  
  var divBig = document.createElement("div");
  divBig.className = "viewer-item-text-container";
  liElem.appendChild(divBig);
  
  var wifiName = document.createElement("span");
  wifiName.className = "viewer-item-text-name";
  wifiName.innerHTML = json.hostname;
  divBig.appendChild(wifiName);
  
  var wifiMac = document.createElement("span");
  wifiMac.className = "viewer-item-text-mac";
  wifiMac.innerHTML = json.mac;
  divBig.appendChild(wifiMac);
  
  var wifiChan = document.createElement("span");
  wifiChan.className = "viewer-item-text-channel";
  wifiChan.innerHTML = json.channel;
  divBig.appendChild(wifiChan);
  
  var wifiLocked = document.createElement("span");
  wifiLocked.className = "bx bx-lock viewer-item-icon";
  wifiLocked.style.color = "#FF0000";
  liElem.appendChild(wifiLocked);
  
  var viewerList = document.getElementById("viewer-list");
  viewerList.appendChild(liElem);
}

function clientList(apMac,json) {

  if (json.hostname == "") {
    json.hostname = json.mac
  }

  var liElem = document.createElement("li");
  liElem.innerHTML = '<li class="viewer-item" id="'+json.hostname+'" onclick="attackExpender2(\''+json.hostname+'\')">\
          <div class="viewer-item-text-container-client">\
            <span class="viewer-item-text">'+json.hostname+'</span>\
            <span class="viewer-item-text">'+json.mac+'</span>\
            <span class="viewer-item-text">'+apMac+'</span>\
          </div>\
        </li>\
        <div class="module-element">\
          <div class="attack-item-text" onclick="deauther(\''+apMac+'\',\''+json.mac+'\')">deauth</div>\
        </div>'

  var viewerList = document.getElementById("viewer-list-client");
  viewerList.appendChild(liElem);
}
