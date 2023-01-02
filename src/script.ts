import './style.css';
import {World} from "./World/World";
import * as THREE from 'three';

const canvas: HTMLCanvasElement = document.querySelector('.webgl');

//@ts-ignore
window._world = new World(new THREE.Scene(), canvas);
//@ts-ignore
window._three = THREE;
