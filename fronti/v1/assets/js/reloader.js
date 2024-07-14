$("#container").load("/assets/html/sidebar.html #mySidenav");
$(document).ready(function() {
    var script = document.createElement('script');
    script.src = '/assets/js/scripts.js?'+(Math.floor(Math.random() * 70)+2);
    document.body.appendChild(script);
});