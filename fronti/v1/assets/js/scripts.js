
var open = true;
var modulesListOpen = false
let collapser = document.querySelector('.logo-name-wrapper')
let sideBar = document.querySelector('.side-bar');
let arrowCollapse = document.querySelector('#logo-name__icon');
sideBar.classList.toggle('collapse');
arrowCollapse.classList.toggle('collapse');
arrowCollapse.classList = 'bx bx-arrow-from-left logo-name__icon collapse';

function closeNav(arrowCollapse) {
  
  sideBar.classList.toggle('collapse');
  arrowCollapse.classList.toggle('collapse');
  arrowCollapse.classList = 'bx bx-arrow-from-left logo-name__icon collapse';

  let content = document.getElementById("contert");
  if (content.style.maxHeight){
    content.style.maxHeight = null;
    modulesListOpen = true;
  }
}

function openNav(arrowCollapse) {

  sideBar.classList.toggle('collapse');
  arrowCollapse.classList.toggle('collapse');
  arrowCollapse.classList = 'bx bx-arrow-from-right logo-name__icon';

  if (modulesListOpen) {
    content.style.maxHeight = content.scrollHeight + "px";
    modulesListOpen = false;
  }
}

function loadAbout(){
  window.location.pathname = 'index.html';
}

function loadModules(){
  window.location.pathname = 'modules';
}

function loadWifi(){
  window.location.pathname = 'modules/wifi';
}

{
  collapser.onclick = () => {
    if (arrowCollapse.classList.contains('collapse')) {
      openNav(arrowCollapse);
    } else {
      closeNav(arrowCollapse);
    }
  };
}

{
  var coll = document.getElementById("modules-extend");
  var content = document.getElementById("contert");
  coll.onclick = () =>{
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  }
}

{
  var start = null;
  window.addEventListener("touchstart",function(event){
   if(event.touches.length === 1){
      //just one finger touched
      start = event.touches.item(0).clientX;
    }else{
      //a second finger hit the screen, abort the touch
      start = null;
    }
  });
  
  window.addEventListener("touchend",function(event){
    
    var offset = 100;//at least 100px are a swipe
    if(start){
  
      //the only finger that hit the screen left it
      var end = event.changedTouches.item(0).clientX;
      if(end > start + offset){
        //a left -> right swipe
        openNav(arrowCollapse);
      }
      if(end < start - offset ){
        //a right -> left swipe
        closeNav(arrowCollapse);
      }
    }
  });
}
