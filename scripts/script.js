// Add listener to models
AFRAME.registerComponent('cursor-listener', {
    init: function () {
        this.el.addEventListener('click', function (evt) {
            //console.log('I was clicked at: ', evt.detail.intersection.point);
            //var test = document.querySelector("#image-360");
            //test.setAttribute("src", "#sechelt");
            //console.log(evt.detail.target.getAttribute("data-dest"));
            transition(evt.detail.target.getAttribute("data-link-to"));
        });
    }
});

var mouseDownTimeout = 1000;
var currentMouseStatus = false;
var isMouseDown = false;

AFRAME.registerComponent('mousedown-check', {
    dependencies: ['raycaster'],

    init: function () {
        this.el.addEventListener('mousedown', function (evt) {
            if (!currentMouseStatus) {
                currentMouseStatus = true;
                setTimeout(function () {
                    if (currentMouseStatus) {
                        mainCamera.getAttribute('wasd-controls').moveTowards = true;
                    }
                    currentMouseStatus = false;
                }, mouseDownTimeout);
            }
        });

        this.el.addEventListener('mouseup', function (evt) {
            currentMouseStatus = false;
            mainCamera.getAttribute('wasd-controls').moveTowards = false;
        });
    }
});

// Raycaster
AFRAME.registerComponent('collider-check', {
  dependencies: ['raycaster'],

  init: function () {
//    this.el.addEventListener('raycaster-intersected', function (evt) {
//      console.log(evt.detail.target);
//    });
  }
});

// Global so we don't need to keep querying
var transitionPlane;
var transitionDuration;
var currentScene = "#scene_landing";
var mainCamera;

// Init on load
window.onload = function (e) {
    transitionPlane = document.querySelector('#transition');
    mainCamera = document.querySelector("#camera");
    // Offset with some delay otherwise value will get overriden before it's complete
    transitionDuration = 500;
    
    setTimeout(fadeOut, 100);
    if (getPageName() == "index.html") {
        hideScene("#scene_portals");
    }
    
    document.querySelector('a-scene').enterVR();
}

function getPageName() {
    var loc = location.pathname.split("/");
    return loc[loc.length - 1];
}

// Fade will toggle between fade out and fade in
function fadeOut() {
    console.log("fadeout");
    transitionPlane.emit('fadeOut');
}

function fadeIn() {
     if (transitionPlane.getAttribute("material").opacity == 0) { 
        transitionPlane.emit('fadeIn');
     }
}

function fadeInAndOut() {
    fadeIn();
    setTimeout(fadeOut, 500);
}

// Fades out and fades in
function transition(destinationScene) {
    fadeIn();
    setTimeout(function () {
        resetCamera();
        fadeOut();
        hideScene(currentScene);
        showScene(destinationScene);
        currentScene = destinationScene;
    }, transitionDuration);
}


// Hides a scene given sceneId
function hideScene(sceneId) {
    var scene = document.querySelector(sceneId);
    scene.setAttribute("visible", false);
    scene.setAttribute("scale", "0 0 0");
}

// Shows a scene given sceneId
function showScene(sceneId) {
    var scene = document.querySelector(sceneId);
    scene.setAttribute("visible", true);
    scene.setAttribute("scale", "1 1 1");
}

// Resets camera to default transformation
function resetCamera() {
    mainCamera.setAttribute("rotation", "0 0 0");
    mainCamera.setAttribute("position", "0 1.6 0");
}
