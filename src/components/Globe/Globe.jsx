import React, { Component } from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import earthmap from '../../assets/images/earthmap4k.jpg';
import earthbump from '../../assets/images/earthbump4k.jpg';
import earthspec from '../../assets/images/earthspec4k.jpg';
import particle from '../../assets/images/particle.jpg';
import clouds from '../../assets/images/earthhiresclouds4K.jpg';
import { useRef } from 'react';

const style = {height: 500};

class Globe extends Component {
    
    // componentWillReceiveProps() {
    //     this.createScene();
    //     this.addSceneObjects();
    //     this.startAnimation();
    // };

    componentDidMount() {
        this.createScene();
        this.addSceneObjects();
        this.startAnimation();
        window.addEventListener('resize', this.handleWindowResize);
        window.addEventListener('click', this.onMouseMove, false);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
        window.cancelAnimationFrame(this.requestID);
        this.controls.dispose();
    }

    createScene = () => {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, 500 / 500, 0.1, 1000 );
        this.controls = new OrbitControls(this.camera, this.mount);
        this.controls.enableZoom = false
        
        this.renderer = new THREE.WebGLRenderer({ antialiasing: true });
        this.renderer.setSize( 500, 500 );

        this.raycaster = new THREE.Raycaster();
        //this.mouse = useRef([0,0]);

        this.mount.appendChild( this.renderer.domElement );
        this.labelContainerElem = document.querySelector('#labels');
        this.camera.position.z = 20;
    };

    addSceneObjects = () => {
        const data = this.props.data;
        let output = Object.values(data);
        this.vals = [];
        this.clickableObjects = [];
        //let finalReturn = [];
        for (let i = 0; i < output.length; i++) {
            let datum=output[i];
            this.vals.push(datum);
        }
        this.addLight();
        this.addEarth();
        for(let i = 0; i < this.vals.length; i++){
            if(this.vals[i].Bureau==='EUR'){
                this.addCoord(this.vals[i].Latitude, this.vals[i].Longitude, 'red', this.vals[i].Post);
            } else if(this.vals[i].Bureau==='NEA') {
                this.addCoord(this.vals[i].Latitude, this.vals[i].Longitude, 'yellow',this.vals[i].Post);
            } else if(this.vals[i].Bureau==='SCA') {
                this.addCoord(this.vals[i].Latitude, this.vals[i].Longitude, 'orange',this.vals[i].Post);
            } else if(this.vals[i].Bureau==='EAP') {
                this.addCoord(this.vals[i].Latitude, this.vals[i].Longitude, 'purple',this.vals[i].Post);
            } else if(this.vals[i].Bureau==='AF') {
                this.addCoord(this.vals[i].Latitude, this.vals[i].Longitude, 'brown',this.vals[i].Post);
            } else if (this.vals[i].Bureau==='WHA') {
                this.addCoord(this.vals[i].Latitude, this.vals[i].Longitude, 'blue',this.vals[i].Post);
            }
        }
        console.log('scene')
    };

    addLight = () => {
        const lights = [];
        lights[0] = new THREE.PointLight(0xffffff, .3, 0);
        lights[1] = new THREE.PointLight(0xffffff, .4, 0);
        lights[2] = new THREE.PointLight(0xffffff, .7, 0);
        lights[3] = new THREE.AmbientLight( 0x706570 );

        lights[0].position.set(0, 200, 0);
        lights[1].position.set(200, 100, 400);
        lights[2].position.set(-200, -200, -50);

        this.scene.add(lights[0]);
        this.scene.add(lights[1]);
        this.scene.add(lights[2]);
        this.scene.add(lights[3]);
    };

    addEarth = () => {
        const earthMap = new THREE.TextureLoader().load( earthmap );
        const earthBumpMap = new THREE.TextureLoader().load( earthbump);
        const earthSpecMap = new THREE.TextureLoader().load( earthspec);

        const earthGeometry = new THREE.SphereGeometry( 10, 32, 32 );
        const earthMaterial = new THREE.MeshPhongMaterial({
            map: earthMap,
            bumpMap: earthBumpMap,
            bumpScale: 0.10,
            specularMap: earthSpecMap,
            specular: new THREE.Color('grey')
        });

        this.earthSphere = new THREE.Mesh( earthGeometry, earthMaterial );
        this.scene.add( this.earthSphere );

        const earthGeo = new THREE.SphereGeometry(10, 32, 32 );
        const cloudsTexture = new THREE.TextureLoader().load( clouds );
        const materialClouds = new THREE.MeshLambertMaterial({
            color: 0xffffff, 
            map: cloudsTexture, 
            transparent:true, 
            opacity:0.4
        });

        this.earthClouds = new THREE.Mesh( earthGeo, materialClouds );
        this.earthClouds.scale.set( 1.015, 1.015, 1.015 );
        this.earthSphere.add( this.earthClouds );
    };

    addCoord = (latitude, longitude, color, name) => {
        this.particleMat = new THREE.PointsMaterial({
            color: color,
            size: 0.25,
            map: new THREE.TextureLoader().load(particle),
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particleGeo = new THREE.SphereGeometry(10, 32, 32);
        this.particleGeo.vertices.forEach(function(vertex) {
            let lat = latitude;
            let lon = longitude;
            const radius = 10;
            const phi   = (90-lat)*(Math.PI/180);
            const theta = (lon+180)*(Math.PI/180);
            vertex.x = -((radius) * Math.sin(phi)*Math.cos(theta));
            vertex.z = ((radius) * Math.sin(phi)*Math.sin(theta));
            vertex.y = ((radius) * Math.cos(phi));
        });

        this.particleSystem = new THREE.Points(
            this.particleGeo,
            this.particleMat
        );
        
        this.particleSystem.name = name;
        this.earthClouds.add(this.particleSystem);
        this.clickableObjects.push(this.particleSystem);
        
        const elem = document.createElement('div');
        elem.textContent = name;
        //this.labelContainerElem.appendChild(elem);

        console.log('coord');
    };

    startAnimation = () => {
        this.earthSphere.rotation.y += 0.0009;
        //this.earthClouds.rotation.y += 0.001;
        this.requestID = window.requestAnimationFrame(this.startAnimation);
        //requestAnimationFrame(this.startAnimation);
    
        this.controls.update();

        this.intersects = this.raycaster.intersectObjects(this.scene.children);
        for (let i = 0; i < this.intersects.length; i++) {
            this.intersects[i].particleSystem.material.color.set(0xff0000);
            console.log('hit')
        };

        this.renderer.render( this.scene, this.camera );
    };

    // onMouseMove = (event) => {
    //     this.mouse.x = (event.clientX / 500) * 2 - 1;
    //     this.mouse.y = - (event.clientY / 500) * 2 + 1;

        
    // };

    handleWindowResize = () => {
        const width = 500;
        const height = 500;

        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;

        this.camera.updateProjectionMatrix();
    };



    render() {
        
        return (
        <>
            <div
            style={style} 
            ref={ref => (this.mount = ref)} 
            data = {this.props.data} 
            region = {this.props.region}>
            </div>
            {/* <div id='labels'></div> */}
        </>
        )
    }
}

export default Globe;