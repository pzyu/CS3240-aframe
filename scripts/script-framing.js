window.addEventListener('vrdisplayactivate', function (evt) {
    console.log("vrdisplayactivate");
});

// Add listener to models
AFRAME.registerComponent('cursor-listener', {
    init: function () {
        this.el.addEventListener('click', function (evt) {
            if (isValidGridPoint(evt.detail.cursorEl.id)) {
                gridReferences.push(evt.detail.cursorEl);
            }
            //transition(evt.detail.target.getAttribute("data-link-to"));
        });
    }
});

var isCatVisible = false;
var isBirdVisible = false;

AFRAME.registerComponent('collider-check', {
    dependencies: ['raycaster'],

    init: function () {
        this.el.addEventListener('raycaster-intersection', function (event) {
            if (event.detail.target.id == "cat-raycaster") {
                if (event.detail.els[0] != null && event.detail.els[1] != null) {
                    isCatVisible = event.detail.els[0].getAttribute("id") == "frame" && event.detail.els[1].getAttribute("class") == "player";
                }
            }
            
            if (event.detail.target.id == "bird-raycaster") {
                if (event.detail.els[0] != null && event.detail.els[1] != null) {
                    isBirdVisible = event.detail.els[0].getAttribute("id") == "frame" && event.detail.els[1].getAttribute("class") == "player";
                }
            }

        });
    }
});

var mouseDownTimeout = 1000;
var currentMouseStatus = false;
var isMouseDown = false;
var imgData;

AFRAME.registerComponent('mousedown-check', {
    dependencies: ['raycaster'],

    init: function () {
        this.el.addEventListener('mousedown', function (evt) {
            if (!currentMouseStatus) {
                currentMouseStatus = true;
                setTimeout(function () {
                    if (currentMouseStatus) {
                        mainCamera.getAttribute('keyboard-controls').moveTowards = true;
                    }
                    currentMouseStatus = false;
                }, mouseDownTimeout);
            }
        });

        this.el.addEventListener('mouseup', function (evt) {
            currentMouseStatus = false;

            if (!mainCamera.getAttribute('keyboard-controls').moveTowards) {
                setTimeout(function () {
                    // Only check if photo is valid on cursor up
                    if (isCatVisible || isBirdVisible) {
                        console.log("Valid photo!");
                        transitionPlane.emit('success');
                        photoFadeInAndOut();
                    } else {
                        console.log("Invalid!");
                        transitionPlane.emit('failure');
                        photoFadeInAndOut();
                    }
                }, 100);
            }
            mainCamera.getAttribute('keyboard-controls').moveTowards = false;
        });
    }
});

// Global so we don't need to keep querying
var transitionPlane;
var currentScene = "#scene_landing";
var mainCamera;
var mouse; 

// Init on load
window.onload = function (e) {
    transitionPlane = document.querySelector('#transition');
    mainCamera = document.querySelector("#camera");
    mouse = document.querySelector("#centerMiddle");

    // Offset with some delay otherwise value will get overriden before it's complete
    transitionDuration = 500;
    setTimeout(fadeOut, 100);
    
    setTimeout(setPosition, 1000);
    document.querySelector('a-scene').enterVR();
}

function setPosition() {
    mainCamera.setAttribute('position', '0 1.6 -8');
}

function getPageName() {
    var loc = location.pathname.split("/");
    return loc[loc.length - 1];
}

// Fade will toggle between fade out and fade in
function fadeOut() {
    transitionPlane.emit('fadeOut');
    setTimeout(setBackwards, 100);
}

function fadeIn() {
    if (transitionPlane.getAttribute("material").opacity == 0) {
        transitionPlane.setAttribute("rotation", "0 0 0");
        transitionPlane.emit('fadeIn');
    }
}

function setBackwards() {
    transitionPlane.setAttribute("rotation", "0 180 0");
}

function fadeInAndOut() {
    fadeIn();
    setTimeout(fadeOut, 400);
}

function photoFadeInAndOut() {
    photoFadeIn();
    setTimeout(photoFadeOut, 400);
}

function photoFadeOut() {
    transitionPlane.emit('successFadeOut');
    setTimeout(setBackwards, 1000);
}

function photoFadeIn() {
    if (transitionPlane.getAttribute("material").opacity == 0) {
        transitionPlane.setAttribute("rotation", "0 0 0");
        transitionPlane.emit('successFadeIn');
    }
}

// Fades out and fades in
function transition(destinationScene) {
    fadeOut();
    setTimeout(function () {
        resetCamera();
        fadeIn();
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