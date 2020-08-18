var embassyStuff = document.getElementById("embassy");
embassyStuff.addEventListener("click", changeToEmbassy);

var timelineStuff = document.getElementById("timeline");
timelineStuff.addEventListener("click", changeToTimeline);

var historyStuff = document.getElementById("history");
historyStuff.addEventListener("click", changeToHistory);

diplomacy_timeline = [];

var xhttp3 = new XMLHttpRequest();
xhttp3.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(xhttp3.responseText);
        let output = Object.values(response);
        for (let i = 0; i < output.length; i++) {
            diplomacy_timeline.push(output[i]);
        }
    }
};
xhttp3.open("GET", "data/Diplomacy_Timeline.json", true);
xhttp3.send();

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
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
let renderer = new THREE.WebGLRenderer( {antialias: true} );
renderer.setSize( window.innerWidth, window.innerHeight );
let controls = new THREE.OrbitControls( camera, renderer.domElement );
document.body.appendChild( renderer.domElement );
let lights = [];
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var touchTest = new THREE.Vector2();

// Create the Earth Object
let earthMap = new THREE.TextureLoader().load( '../images/earthmap4k.jpg' );
let earthBumpMap = new THREE.TextureLoader().load( '../images/earthbump4k.jpg' );
let earthSpecMap = new THREE.TextureLoader().load( '../images/earthspec4k.jpg' );

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
let parent = new THREE.Object3D();
parent.position.y = 60;
scene.add( parent );
let pointLight = new THREE.PointLight( 0xffffff, 0.9 );
var light = new THREE.DirectionalLight( 0xffffff );

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
controls.saveState();

function removeChildren(){
    let destroy = sphere.children.length;
    while (destroy--) {
        sphere.remove(sphere.children[destroy]);
    }
    if(parent.children.length > 0){
        let destoyer = parent.children.length;
        while(destoyer--) {
            parent.children.length;
        }
    }
}

addTimelineCoord = (sphere, latitude, longitude, color, country, establish_legation, elevate_to_embassy, establish_embassy, closure, reopen_legation, reopen_embassy) => {
    if (country == 'Austria') {
        let particleGeo = new THREE.SphereGeometry(.11, 32, 32);
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
    } else {
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
    }
};

function addTimeline(e) {
    removeChildren();
    var target = e.target;
    for (let i = 0; i < timelineData.length; i++) {
        if (
            (
                timelineData[i].reopen_embassy <= target.value && timelineData[i].reopen_embassy != '0') 
            ){
                addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, '#fecf6a', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy);
        }
        else if (
            (
                timelineData[i].elevate_to_embassy <= target.value && timelineData[i].elevate_to_embassy > timelineData[i].closure && timelineData[i].elevate_to_embassy != '0')
            | (timelineData[i].elevate_to_embassy <= target.value && target.value < timelineData[i].closure && timelineData[i].elevate_to_embassy != '0')
            ) 
        {
            addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, '#fecf6a', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy);
        }
        else if (
            (
                timelineData[i].establish_embassy <= target.value && timelineData[i].establish_embassy > timelineData[i].closure && timelineData[i].establish_embassy != '0')
            ||  (timelineData[i].establish_embassy <= target.value && target.value < timelineData[i].closure && timelineData[i].establish_embassy != '0')    
            ){
                addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, '#fecf6a', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy);
        } else if (
            (
                timelineData[i].reopen_legation <= target.value && timelineData[i].reopen_legation > timelineData[i].closure && timelineData[i].reopen_legation != '0')
            //||  (timelineData[i].reopen_legation <= target.value && target.value < timelineData[i].closure && timelineData[i].reopen_legation != '0')    
            ){
                addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, '#0066FF', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy);
        } else if (
            (
                timelineData[i].closure <= target.value && target.value < timelineData[i].reopen_legation && timelineData[i].reopen_legation != '0' && timelineData[i].closure !='0') 
            || (timelineData[i].closure <= target.value && target.value < timelineData[i].reopen_embassy && timelineData[i].reopen_embassy != '0' && timelineData[i].closure !='0')
            || (timelineData[i].closure <= target.value && target.value < timelineData[i].establish_embassy && timelineData[i].establish_embassy != '0' && timelineData[i].closure !='0')
            || (timelineData[i].closure <= target.value && target.value < timelineData[i].elevate_to_embassy && timelineData[i].elevate_to_embassy != '0' && timelineData[i].closure !='0')
            || (timelineData[i].closure <= target.value && target.value > timelineData[i].establish_legation && timelineData[i].establish_legation != '0' && timelineData[i].closure !='0')
            || (timelineData[i].closure <= target.value && timelineData[i].elevate_to_embassy == '0' && timelineData[i].reopen_embassy == '0' && timelineData[i].reopen_legation == '0' && timelineData[i].closure !='0')
            ){
                addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, '#df1c1c', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy);
        } else if (
            (
                timelineData[i].establish_legation <= target.value && timelineData[i].establish_legation != '0') 
            ){
                addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, 'white', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy);
        }
        // if (timelineData[i].reopen_embassy <= target.value && timelineData[i].reopen_embassy != '0') {
        //     addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, '#0066FF', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy); 
        // } else if (timelineData[i].reopen_legation <= target.value && timelineData[i].reopen_legation != '0'){ 
        //     addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, '#0066FF', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy); 
        // } else if (timelineData[i].elevate_to_embassy <= target.value && timelineData[i].elevate_to_embassy != '0') {
        //     addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, '#fecf6a', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy); 
        // } else if (timelineData[i].establish_embassy <= target.value && timelineData[i].establish_embassy != '0') {
        //     addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, '#fecf6a', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy); 
        // } else if (timelineData[i].closure <= target.value && timelineData[i].closure != '0') {
        //     addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, '#df1c1c', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy); 
        // }else if (timelineData[i].establish_legation <= target.value && timelineData[i].establish_legation != '0') {
        //     addTimelineCoord(sphere, timelineData[i].lat, timelineData[i].lon, 'white', timelineData[i].country, timelineData[i].establish_legation, timelineData[i].elevate_to_embassy, timelineData[i].establish_embassy, timelineData[i].closure, timelineData[i].reopen_legation, timelineData[i].reopen_embassy); 
        // }
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
    mesh.userData.color = color;
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

    if(sphere.children.length > 0){
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
            document.getElementById("bureau").style.color = intersects[0].object.userData.color;
            document.querySelector('#post').innerText = "Post: " + intersects[0].object.userData.post
            document.querySelector('#country-two').innerText = "Country: " + intersects[0].object.userData.country
            document.querySelector('#language').innerText = "Languages: " + intersects[0].object.userData.language
            document.querySelector('#status').innerText = "Status: " + intersects[0].object.userData.status
        }
    }
    else if(parent.children.length > 0) {
        var intersects = raycaster.intersectObjects(parent.children);
        if (intersects[0].object.userData.date_2 == '') {
            document.querySelector('#source-1').style.display = 'flex';
            for (var i = 0; i < intersects.length; i++) {
                console.log(intersects[0])
                document.querySelector('#date-1').innerText = intersects[0].object.userData.date
                document.querySelector('#event').innerText = intersects[0].object.userData.event
                document.querySelector("#source-1").addEventListener('click', function() {
                    setTimeout(function() {
                        window.open(intersects[0].object.userData.source, '_blank');
                    }, 3000);
                });
            }
        }
        else {
            document.querySelector('#source-2').style.display = 'flex';
            document.querySelector('#source-1').style.display = 'flex';
            for (var i = 0; i < intersects.length; i++) {
                console.log(intersects[0])
                document.querySelector('#date-1').innerText = intersects[0].object.userData.date + " - " + intersects[0].object.userData.date_2
                document.querySelector('#event').innerText = intersects[0].object.userData.event
                document.querySelector("#source-1").addEventListener('click', function() {
                    setTimeout(function() {
                        window.open(intersects[0].object.userData.source, '_blank');
                    }, 3000);
                });
                document.querySelector("#source-2").addEventListener('click', function() {
                    setTimeout(function() {
                        window.open(intersects[0].object.userData.source_2, '_blank');
                    }, 3000);
                });
                
            }
        }
    }
}

function onTouchStart (event) {
    event.preventDefault();
    touchTest.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    touchTest.y = - (event.touches[0].clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(touchTest,camera);

        var intersects = raycaster.intersectObjects(scene.children);

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
            document.getElementById("bureau").style.color = intersects[0].object.userData.color;
            document.querySelector('#post').innerText = "Post: " + intersects[0].object.userData.post
            document.querySelector('#country-two').innerText = "Country: " + intersects[0].object.userData.country
            document.querySelector('#language').innerText = "Languages: " + intersects[0].object.userData.language
            document.querySelector('#status').innerText = "Status: " + intersects[0].object.userData.status
        }
        if (intersects[0].object.userData.date_2 == '') {
            document.querySelector('#source-1').style.display = 'flex';
            for (var i = 0; i < intersects.length; i++) {
                console.log(intersects[0])
                document.querySelector('#date-1').innerText = intersects[0].object.userData.date
                document.querySelector('#event').innerText = intersects[0].object.userData.event
                document.querySelector("#source-1").addEventListener('click', function() {
                    setTimeout(function() {
                        window.open(intersects[0].object.userData.source, '_blank');
                    }, 3000);
                });
            }
        }
        else {
            document.querySelector('#source-2').style.display = 'flex';
            document.querySelector('#source-1').style.display = 'flex';
            for (var i = 0; i < intersects.length; i++) {
                console.log(intersects[0])
                document.querySelector('#date-1').innerText = intersects[0].object.userData.date + " - " + intersects[0].object.userData.date_2
                document.querySelector('#event').innerText = intersects[0].object.userData.event
                document.querySelector("#source-1").addEventListener('click', function() {
                    setTimeout(function() {
                        window.open(intersects[0].object.userData.source, '_blank');
                    }, 3000);
                });
                document.querySelector("#source-2").addEventListener('click', function() {
                    setTimeout(function() {
                        window.open(intersects[0].object.userData.source_2, '_blank');
                    }, 3000);
                });
                
            }
        }
}

var slider = document.getElementById("slider");
slider.addEventListener("input", addTimeline);
document.getElementById('info-box').style.display = 'none';
document.getElementById('info-box-two').style.display = 'none';
document.getElementById('diplomacy-box').style.display = 'none';
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('click', onMouseClick, false);
window.addEventListener('touchstart', onTouchStart, false);
animate();

function changeToEmbassy() {
    removeChildren();
    document.querySelector('#bureau').innerText = "Bureau: ";
    document.querySelector('#post').innerText = "Post: ";
    document.querySelector('#country-two').innerText = "Country: ";
    document.querySelector('#language').innerText = "Languages: ";
    document.querySelector('#status').innerText = "Status: ";
    document.getElementById('info-box-two').style.display = 'flex';
    document.getElementById('info-box').style.display = 'none';
    document.getElementById('diplomacy-box').style.display = 'none';
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
    if(camera.fov != 75){
        camera.fov = 75;
        camera.near = 0.1;
        camera.far = 1000;
        camera.updateProjectionMatrix();

        controls.reset();
        controls.update();
    }
    controls.enableZoom = false;
    //camera.set(3.0260065921289407, 1.2246467991473519e-15, 19.76975680438157)
    camera.position.z = 19.76975680438157;
    camera.position.y = 1.2246467991473519e-15;
    controls.reset();
    controls.update();
};

function changeToTimeline() {
    removeChildren();
    document.querySelector('#country').innerText = "Point of Interest: ";
    document.querySelector('#establish-legation').innerText = "Established Legation: ";
    document.querySelector('#elevate-to-embassy').innerText = "Elevated to Embassy: ";
    document.querySelector('#establish-embassy').innerText = "Established Embassy: ";
    document.querySelector('#closure').innerText = "Closed: ";
    document.querySelector('#reopen-legation').innerText = "Reopened Legation: ";
    document.querySelector('#reopen-embassy').innerText = "Reopened Embassy: ";
    document.getElementById('info-box-two').style.display = 'none';
    document.getElementById('info-box').style.display = 'flex';
    document.getElementById('diplomacy-box').style.display = 'none';

    if(camera.fov != 75){
        camera.fov = 75;
        camera.near = 0.1;
        camera.far = 1000;
        camera.updateProjectionMatrix();
        
        controls.enablePan = false;
        controls.maxPolarAngle = Math.PI;
        controls.minPolarAngle = 0;
        controls.reset();
        controls.update();
    }
    camera.position.z = 19.76975680438157;
    camera.position.y = 1.2246467991473519e-15;
    controls.reset();
    controls.update();
};

function changeToHistory() {
    document.getElementById('info-box-two').style.display = 'none';
    document.getElementById('info-box').style.display = 'none';
    document.getElementById('diplomacy-box').style.display = 'flex';
    removeChildren();
    if(camera.fov != 65){
        camera.fov = 65;
        camera.near = 0.001;
        camera.far = 1000;
        camera.position.y = 47;
        camera.position.z = 1535;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.maxPolarAngle = 1.54;
        controls.minPolarAngle = 1.54;
        controls.rotateSpeed = 0.5;
        controls.update();
        light.position.set( 10, 10, 11 );
        light.position.normalize();
    }
    document.querySelector('#source-1').style.display = 'none';
    document.querySelector('#source-2').style.display = 'none';

    // angles
    var camSize = 100;
    var startAngle = 0;
    var circleRadius = 230;
    var diameter = circleRadius*4;
    var centerX = -5;
    var centerZ = 0.5;
    var targetRotation = 0;
    var targetRotationOnMouseDown = 0; 

    var mpi = Math.PI/180;
    var startRadians = startAngle + mpi;
    var total_length = 62;
    var incrementAngle = 360/total_length;
    var incrementRadians = incrementAngle * mpi;

    let arrayOfImages = {
        "0":"0.jpg",
        "1":"1.jpg",
        "2":"2.jpg",
        "3":"3.jpg",
        "4":"4.jpg",
        "5":"5.jpg",
        "6":"6.jpg",
        "7":"7.jpg",
        "8":"8.jpg",
        "9":"9.jpg",
        "10":"10.jpg",
        "11":"11.jpg",
        "12":"12.jpg",
        "13":"13.jpg",
        "14":"14.jpg",
        "15":"15.jpg",
        "16":"16.jpg",
        "17":"17.jpg",
        "18":"18.jpg",
        "19":"19.jpg",
        "20":"20.jpg",
        "21":"21.jpg",
        "22":"22.jpg",
        "23":"23.jpg",
        "24":"24.jpg",
        "25":"25.jpg",
        "26":"26.jpg",
        "27":"27.jpg",
        "28":"28.jpg",
        "29":"29.jpg",
        "30":"30.jpg",
        "31":"31.jpg",
        "32":"32.jpg",
        "33":"33.jpg",
        "34":"34.jpg",
        "35":"35.jpg",
        "36":"36.jpg",
        "37":"37.jpg",
        "38":"38.jpg",
        "39":"39.jpg",
        "40":"40.jpg",
        "41":"41.jpg",
        "42":"42.jpg",
        "43":"43.jpg",
        "44":"44.jpg",
        "45":"45.jpg",
        "46":"46.jpg",
        "47":"47.jpg",
        "48":"48.jpg",
        "49":"49.jpg",
        "50":"50.jpg",
        "51":"51.jpg",
        "52":"52.jpg",
        "53":"53.jpg",
        "54":"54.jpg",
        "55":"55.jpg",
        "56":"56.jpg",
        "57":"57.jpg",
        "58":"58.jpg",
        "59":"59.jpg",
        "60":"60.jpg",
        "61":"61.jpg"
    }

    addTimelineData = (i,parent, date, date_2, event, source, source_2) => {
            let x_position = centerX + Math.sin(startRadians) * circleRadius * 6;
            let z_position = centerZ + Math.cos(startRadians) * circleRadius * 6;
                let loader = new THREE.TextureLoader();
                let texture = loader.load('../images/'+arrayOfImages[i]);
                var mesh = new THREE.Mesh( 
                    new THREE.PlaneGeometry( camSize, .95*camSize), 
                    new THREE.MeshBasicMaterial( {  
                    map: texture
                })
                );
            
                mesh.position.x = x_position;
                mesh.position.z = z_position;
            
                mesh.rotation.y = i*incrementAngle * (Math.PI/180.0);
                
                startRadians += incrementRadians;
                
                mesh.userData.date = date;
                mesh.userData.date_2 = date_2;
                mesh.userData.event = event;
                mesh.userData.source = source;
                mesh.userData.source_2 = source_2;

                parent.add( mesh ); 
    }

    for ( let i = 0; i < diplomacy_timeline.length; i++ ) {
        addTimelineData(i, parent, diplomacy_timeline[i].Date, diplomacy_timeline[i].Date_2, diplomacy_timeline[i].Event, diplomacy_timeline[i].Source_1, diplomacy_timeline[i].Source_2)
    }
    camera.updateProjectionMatrix();
}