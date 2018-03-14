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
    transitionDuration = parseInt(document.querySelector('#transitionAnimation').getAttribute("dur")) + 100;
    fade();
    hideScene("#scene_portals");
}

// Fade will toggle between fade out and fade in
function fade() {
    transitionPlane.emit('fade');
}

// Fades out and fades in
function transition(destinationScene) {
    fade();
    setTimeout(function () {
        resetCamera();
        fade();
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