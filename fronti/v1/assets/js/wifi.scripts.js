function attackExpender(id) {
    var coll = document.getElementById(id);
    var content = coll.nextElementSibling;
    if (content.style.maxHeight){
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    } 
}

function loadViewer(){
  window.location.pathname = 'modules/wifi/viewer';
}


function listInterfaces(id) {

    // Now, add the newly created table with json data, to a container.
    const divUper = document.getElementById(id);
    divShowData = divUper.nextElementSibling;
    divShowData.innerHTML = "";

    v1ModulesWifiInterfaceGet().then( response => {
      
      if (!!response.data && response.data.length == undefined) {
        response.data = JSON.parse("[" + JSON.stringify(response.data) + "]");
      }

      if (response.response.status == 200) {

        let interfacesSelector = document.getElementById("interfaces");
        for (let i = 0; i < response.data.length; i++) { 

          let option = document.createElement("option");
          option.innerHTML =  response.data[i].Name;
          interfacesSelector.appendChild(option);
        }
      }

      divShowData.appendChild(tableFromJson(response.data));
  
      var content = divUper.parentElement;
      content.style.maxHeight = content.scrollHeight + "px";
    });
}

function apScan(id) {

    // Now, add the newly created table with json data, to a container.
    const divUper = document.getElementById(id);
    divShowData = divUper.nextElementSibling;
    divShowData.innerHTML = "";

    let interfacesSelector = document.getElementById("interfaces");
    var interfaceName = interfacesSelector.options[interfacesSelector.selectedIndex].text;
    var V1ModulesWifiScanApInterfaceNameGetParams0 = { "path": { "interfaceName": interfaceName, }, };
  
    v1ModulesWifiScanApInterfaceNameGet(V1ModulesWifiScanApInterfaceNameGetParams0).then( response => {

      if (response.response.status == 200 || (response.response.status == 400 && response.data.Error == "ap scanner already running")) {

        let viewer = document.getElementById("ap-scan-viewer");
        viewer.style.display = "block";
        viewer.style.pointerEvents = "all";
      }
      
      if (!!response.data && response.data.length == undefined) {
        response.data = JSON.parse("[" + JSON.stringify(response.data) + "]");
      }


      divShowData.appendChild(tableFromJson(response.data));
  
      var content = divUper.parentElement;
      content.style.maxHeight = content.scrollHeight + "px";
    });
}

function clientScan(id) {

    // Now, add the newly created table with json data, to a container.
    const divUper = document.getElementById(id);
    divShowData = divUper.nextElementSibling;
    divShowData.innerHTML = "";

    v1ModulesWifiScanClientGet().then( response => {
      
      if (response.response.status == 200 || (response.response.status == 400 && response.data.Error == "client scanning already running")) {
        let viewer = document.getElementById("client-scan-viewer");
        viewer.style.display = "block";
        viewer.style.pointerEvents = "all";
      }

      console.log(!!response.data.length)
       
      if (!!response.data && response.data.length == undefined) {
        response.data = JSON.parse("[" + JSON.stringify(response.data) + "]");
      }
      

      divShowData.appendChild(tableFromJson(response.data));
  
      var content = divUper.parentElement;
      content.style.maxHeight = content.scrollHeight + "px";
    });
}

function captureHandshake(id) {
  
    // Now, add the newly created table with json data, to a container.
    const divUper = document.getElementById(id);
    divShowData = divUper.nextElementSibling;
    divShowData.innerHTML = "";

    v1ModulesWifiCptHandshakeGet().then( response => {
      
      if (response.response.status == 200 || (response.response.status == 400 && response.data.Error == "capture handshake already running")) {
        let viewer = document.getElementById("capture-handshake-viewer");
        viewer.style.display = "block";
        viewer.style.pointerEvents = "all";
      }

      if (!!response.data && response.data.length == undefined) {
        response.data = JSON.parse("[" + JSON.stringify(response.data) + "]");
      }

      divShowData.appendChild(tableFromJson(response.data));
  
      var content = divUper.parentElement;
      content.style.maxHeight = content.scrollHeight + "px";
    });
}

function prober(id) {}
function beaconer(id) {}
function rogueAp(id) {}
function killAll(id) {
  
    // Now, add the newly created table with json data, to a container.
    const divUper = document.getElementById(id);
    divShowData = divUper.nextElementSibling;
    divShowData.innerHTML = "";

    v1ModulesWifiStopGet().then( response => {
      if (!!response.data && response.data.length == undefined) {
        response.data = JSON.parse("[" + JSON.stringify(response.data) + "]");
      }

      divShowData.appendChild(tableFromJson(response.data));
  
      var content = divUper.parentElement;
      content.style.maxHeight = content.scrollHeight + "px";
    });
}

function stopClientScan(id) {
  
    // Now, add the newly created table with json data, to a container.
    const divUper = document.getElementById(id);
    divShowData = divUper.nextElementSibling;
    divShowData.innerHTML = "";

    v1ModulesWifiStopScanClientGet().then( response => {
      if (!!response.data && response.data.length == undefined) {
        response.data = JSON.parse("[" + JSON.stringify(response.data) + "]");
      }

      divShowData.appendChild(tableFromJson(response.data));
  
      var content = divUper.parentElement;
      content.style.maxHeight = content.scrollHeight + "px";
    });
}

function stopHandshakeCpt(id) {}
function stopBeaconAttack(id) {}
function stopRogueAp(id) {}

var ip = "http://" + location.host + ":8080";

function v1ModulesWifiBeaconPost(params) {
  return request("post", ip + `/api/v1/modules/wifi/beacon`, { "header": { "accept": "application/json", "Content-Type": "application/json", }, })(params);
}

function v1ModulesWifiConnectApInterfaceNamePost(params) {
  return request("post", ip + `/api/v1/modules/wifi/connectAp/${params.path.interfaceName}`, { "header": { "accept": "application/json", "Content-Type": "application/json", }, })(params);
}

function v1ModulesWifiCptHandshakeGet() {
  return request("get", ip + `/api/v1/modules/wifi/cptHandshake`, { "header": { "Content-Type": "application/json", }, })();
}

function v1ModulesWifiDeauthPost(params) {
  return request("post", ip + `/api/v1/modules/wifi/deauth`, { "header": { "accept": "application/json", "Content-Type": "application/json", }, })(params);
}

function v1ModulesWifiInterfaceGet() {
  return request("get", ip + `/api/v1/modules/wifi/interfaces`, { "header": { "Content-Type": "application/json", }, })();
}

function v1ModulesWifiProbePost(params) {
  return request("post", ip + `/api/v1/modules/wifi/probe`, { "header": { "accept": "application/json", "Content-Type": "application/json", }, })(params);
}

function v1ModulesWifiRogueApPost(params) {
  return request("post", ip + `/api/v1/modules/wifi/rogueAp`, { "header": { "accept": "application/json", "Content-Type": "application/json", }, })(params);
}

function v1ModulesWifiScanApInterfaceNameGet(params) {
  return request("get", ip + `/api/v1/modules/wifi/scanAp/${params.path.interfaceName}`, { "header": { "Content-Type": "application/json", }, })(params);
}

function v1ModulesWifiScanClientGet() {
  return request("get", ip + `/api/v1/modules/wifi/scanClient`, { "header": { "Content-Type": "application/json", }, })();
}

function v1ModulesWifiStopGet() {
  return request("get", ip + `/api/v1/modules/wifi/stop`, { "header": { "Content-Type": "application/json", }, })();
}

function v1ModulesWifiStopBeaconerGet() {
  return request("get", ip + `/api/v1/modules/wifi/stopBeaconer`, { "header": { "Content-Type": "application/json", }, })();
}

function v1ModulesWifiStopCptHandshakeGet() {
  return request("get", ip + `/api/v1/modules/wifi/stopCptHandshake`, { "header": { "Content-Type": "application/json", }, })();
}

function v1ModulesWifiStopRogueApGet() {
  return request("get", ip + `/api/v1/modules/wifi/stopRogueAp`, { "header": { "Content-Type": "application/json", }, })();
}

function v1ModulesWifiStopScanClientGet() {
  return request("get", ip + `/api/v1/modules/wifi/stopScanClient`, { "header": { "Content-Type": "application/json", }, })();
}

