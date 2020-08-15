var embassyStuff = document.getElementById("embassy");
embassyStuff.addEventListener("click", changeToEmbassy);

var timelineStuff = document.getElementById("timeline");
timelineStuff.addEventListener("click", changeToTimeline);

embassy_data = [];
var xhttp2 = new XMLHttpRequest();
xhttp2.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(xhttp2.responseText);
        let output = Object.values(response);
        for (let i = 0; i < output.length; i++) {
            embassy_data.push(output[i]);
        }
    }
};
xhttp2.open("GET", "data/Final_data.json", false);
xhttp2.send();

timelineData = [];
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(xhttp.responseText);
        let output = Object.values(response);
        for (let i = 0; i < output.length; i++) {
            timelineData.push(output[i]);
        }
    }
};
xhttp.open("GET", "data/Embassy_Timeline.json", true);
xhttp.send();

// Creat THREEJS Environment
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer( {antialias: true} );
renderer.setSize( window.innerWidth, window.innerHeight );
const controls = new THREE.OrbitControls( camera, renderer.domElement );
document.body.appendChild( renderer.domElement );
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

// Create the Earth Object
let earthMap = new THREE.TextureLoader().load( 'images/earthmap4k.jpg' );
let earthBumpMap = new THREE.TextureLoader().load( 'images/earthbump4k.jpg' );
let earthSpecMap = new THREE.TextureLoader().load( 'images/earthspec4k.jpg' );

let geometry = new THREE.SphereGeometry( 10, 32, 32 );
let material = new THREE.MeshPhongMaterial({
    map: earthMap,
    bumpMap: earthBumpMap,
    bumpScale: 0.10,
    specularMap: earthSpecMap,
    specular: new THREE.Color('grey')
});

let sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );

createSkyBox = (scene) => {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        '../images/space_right.png',
        '../images/space_left.png',
        '../images/space_top.png',
        '../images/space_bot.png',
        '../images/space_front.png',
        '../images/space_back.png',
    ])
    scene.background = texture;
};

createLights = (scene) => {
    const lights = [];
    lights[0] = new THREE.PointLight(0x00FFFF, .3, 0);
    lights[1] = new THREE.PointLight(0x00FFFF, .4, 0);
    lights[2] = new THREE.PointLight(0x00FFFF, .7, 0);
    lights[3] = new THREE.AmbientLight( 0x706570 );
    
    lights[0].position.set(0, 200, 0);
    lights[1].position.set(200, 100, 400);
    lights[2].position.set(-200, -200, -50);
    
    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);
    scene.add(lights[3]);
};

addSceneObjects = (scene, camera, renderer) => {
    createSkyBox(scene);
    createLights(scene);
};

addSceneObjects(scene, camera, renderer);
camera.position.z = 20;
controls.enableZoom = false;
controls.enablePan = false;
controls.update();

function removeTimeline(){
    let destroy = sphere.children.length;
    while (destroy--) {
        sphere.remove(sphere.children[destroy]);
    }
}

addTimelineCoord = (sphere, latitude, longitude, color, country, establish_legation, elevate_to_embassy, establish_embassy, closure, reopen_legation, reopen_embassy) => {
    let particleGeo = new THREE.SphereGeometry(.1, 32, 32);
    let lat = latitude * (Math.PI/180);
    let lon = -longitude * (Math.PI/180);
    const radius = 10;
    const phi   = (90-lat)*(Math.PI/180);
    const theta = (lon+180)*(Math.PI/180);

    var material = new THREE.MeshBasicMaterial({
		color: color
	});

    let mesh = new THREE.Mesh(
		particleGeo,
		material 
    );

    mesh.position.set(
        Math.cos(lat) * Math.cos(lon) * radius,
        Math.sin(lat) * radius,
        Math.cos(lat) * Math.sin(lon) * radius
    );

    mesh.rotation.set(0.0, -lon,lat-Math.PI*0.5);
    mesh.userData.country = country;
    mesh.userData.establish_legation = establish_legation;
    mesh.userData.elevate_to_embassy = elevate_to_embassy;
    mesh.userData.establish_embassy = establish_embassy;
    mesh.userData.closure = closure;
    mesh.userData.reopen_legation = reopen_legation;
    mesh.userData.reopen_embassy = reopen_embassy;
    sphere.add(mesh);
};

function addTimeline(e) {
    removeTimeline();
    var target = e.target;
    for (let i = 0; i < timelineData.length; i++) {
        if (timelineData[i].reopen_embassy <= target.value && timelineData[i].reopen_embassy != '0') {
            addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, '#0066FF', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy); 
        } else if (timelineData[i].reopen_legation <= target.value && timelineData[i].reopen_legation != '0'){ 
            addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, '#0066FF', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy); 
        } else if (timelineData[i].closure <= target.value && timelineData[i].closure != '0') {
            addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, '#df1c1c', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy); 
        } else if (timelineData[i].elevate_to_embassy <= target.value && timelineData[i].elevate_to_embassy != '0') {
            addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, '#fecf6a', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy); 
        } else if (timelineData[i].establish_embassy <= target.value && timelineData[i].establish_embassy != '0') {
            addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, '#fecf6a', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy); 
        } else if (timelineData[i].establish_legation <= target.value && timelineData[i].establish_legation != '0') {
            addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, 'white', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy); 
        }
    }
    console.log(sphere.children.length)
}

// Create the Coordinates for the sphere to be added
addEmbassyCoord = (sphere, latitude, longitude, color, post, bureau, country, language, status) => {
    let particleGeo = new THREE.SphereGeometry(.1, 32, 32);
    let lat = latitude * (Math.PI/180);
    let lon = -longitude * (Math.PI/180);
    const radius = 10;
    const phi   = (90-lat)*(Math.PI/180);
    const theta = (lon+180)*(Math.PI/180);

    var material = new THREE.MeshBasicMaterial({
		color: color
	});

    let mesh = new THREE.Mesh(
		particleGeo,
		material 
    );

    mesh.position.set(
        Math.cos(lat) * Math.cos(lon) * radius,
        Math.sin(lat) * radius,
        Math.cos(lat) * Math.sin(lon) * radius
    );

    mesh.rotation.set(0.0, -lon,lat-Math.PI*0.5);
    mesh.userData.post = post;
    mesh.userData.bureau = bureau;
    mesh.userData.country = country;
    mesh.userData.language = language;
    mesh.userData.status = status;
    sphere.add(mesh);
};

onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

animate = () => {
    requestAnimationFrame( animate );
    render();
    controls.update();   
}

render = () => {
    renderer.render( scene, camera );
}

onMouseClick = (event) => {
    event.preventDefault();
    mouse.x = ((event.clientX / window.innerWidth) * 2 - 1);
    mouse.y = (-(event.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    
    var intersects = raycaster.intersectObjects(sphere.children);

    for (var i = 0; i < intersects.length; i++) {
        document.querySelector('#country').innerText = "Point of Interest: " + intersects[0].object.userData.country
        document.querySelector('#establish-legation').innerText = "Established Legation: " + intersects[0].object.userData.establish_legation
        document.querySelector('#elevate-to-embassy').innerText = "Elevated to Embassy: " + intersects[0].object.userData.elevate_to_embassy
        document.querySelector('#establish-embassy').innerText = "Established Embassy: " + intersects[0].object.userData.establish_embassy
        document.querySelector('#closure').innerText = "Closed: " + intersects[0].object.userData.closure
        document.querySelector('#reopen-legation').innerText = "Reopened Legation: " + intersects[0].object.userData.reopen_legation
        document.querySelector('#reopen-embassy').innerText = "Reopened Embassy: " + intersects[0].object.userData.reopen_embassy
    }

    for (var i = 0; i < intersects.length; i++) {
        document.querySelector('#bureau').innerText = "Bureau: " + intersects[0].object.userData.bureau
        document.querySelector('#post').innerText = "Post: " + intersects[0].object.userData.post
        document.querySelector('#country-two').innerText = "Country: " + intersects[0].object.userData.country
        document.querySelector('#language').innerText = "Languages: " + intersects[0].object.userData.language
        document.querySelector('#status').innerText = "Status: " + intersects[0].object.userData.status
    }
}
var slider = document.getElementById("slider");
slider.addEventListener("input", addTimeline);
document.getElementById('info-box').style.display = 'none';
document.getElementById('info-box-two').style.display = 'none';
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('click', onMouseClick, false);
animate();

function changeToEmbassy() {
    document.querySelector('#bureau').innerText = "Bureau: ";
    document.querySelector('#post').innerText = "Post: ";
    document.querySelector('#country-two').innerText = "Country: ";
    document.querySelector('#language').innerText = "Languages: ";
    document.querySelector('#status').innerText = "Status: ";
    removeTimeline();
    document.getElementById('info-box-two').style.display = 'flex';
    document.getElementById('info-box').style.display = 'none';
    // Get the data from JSON file
    for(let i = 0; i < embassy_data.length; i++){
        if(embassy_data[i].Bureau==='EUR'){
            addEmbassyCoord(sphere,embassy_data[i].Latitude, embassy_data[i].Longitude, 'red', embassy_data[i].Post, embassy_data[i].Bureau, embassy_data[i].Country, embassy_data[i].Languages, embassy_data[i].Status);
        } else if(embassy_data[i].Bureau==='NEA') {
            addEmbassyCoord(sphere,embassy_data[i].Latitude, embassy_data[i].Longitude, 'orange', embassy_data[i].Post, embassy_data[i].Bureau, embassy_data[i].Country, embassy_data[i].Languages, embassy_data[i].Status);
        } else if(embassy_data[i].Bureau==='SCA') {
            addEmbassyCoord(sphere,embassy_data[i].Latitude, embassy_data[i].Longitude, 'yellow', embassy_data[i].Post, embassy_data[i].Bureau, embassy_data[i].Country, embassy_data[i].Languages, embassy_data[i].Status);
        } else if(embassy_data[i].Bureau==='EAP') {
            addEmbassyCoord(sphere,embassy_data[i].Latitude, embassy_data[i].Longitude, 'violet', embassy_data[i].Post, embassy_data[i].Bureau, embassy_data[i].Country, embassy_data[i].Languages, embassy_data[i].Status);
        } else if(embassy_data[i].Bureau==='AF') {
            addEmbassyCoord(sphere,embassy_data[i].Latitude, embassy_data[i].Longitude, 'pink', embassy_data[i].Post, embassy_data[i].Bureau, embassy_data[i].Country, embassy_data[i].Languages, embassy_data[i].Status);
        } else if (embassy_data[i].Bureau==='WHA') {
            addEmbassyCoord(sphere,embassy_data[i].Latitude, embassy_data[i].Longitude, 'white', embassy_data[i].Post, embassy_data[i].Bureau, embassy_data[i].Country, embassy_data[i].Languages, embassy_data[i].Status);
        }
    }
};

function changeToTimeline() {
    document.querySelector('#country').innerText = "Point of Interest: ";
    document.querySelector('#establish-legation').innerText = "Established Legation: ";
    document.querySelector('#elevate-to-embassy').innerText = "Elevated to Embassy: ";
    document.querySelector('#establish-embassy').innerText = "Established Embassy: ";
    document.querySelector('#closure').innerText = "Closed: ";
    document.querySelector('#reopen-legation').innerText = "Reopened Legation: ";
    document.querySelector('#reopen-embassy').innerText = "Reopened Embassy: ";
    removeTimeline();
    document.getElementById('info-box-two').style.display = 'none';
    document.getElementById('info-box').style.display = 'flex';
};