
import { LitElement, css, html } from "lit";

import * as CANNON from 'cannon-es';

import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';


//Tip: Keep in mind like anything else that happens in the browser, this way of determining a discount is not really safe, as an user can always
// just send whatever value he wants for discount, so you have to validate on the server side
class DiceComponent extends LitElement {
    static styles = css`
        .content {
            display: grid;
            justify-content: center;
        }

        .ui {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 5fr;
            justify-content: center;
        }

        .ui-controls {
            margin: auto 0;
            padding: 10px 0;
            text-align: right;
        }

        button {
            margin: auto;
            font-size: 21px;
            padding: 10px;
            text-align: center;
            color: white;
            background: rgb(124, 126, 126);
            cursor: pointer;
            border: none;
        }

        canvas {
            border: 1px solid black;
            margin-bottom: 30px;
        }

        button[disabled] {
            background: rgba(124, 126, 126, 0.5);
        }

        .message-wrapper {
            position:relative;
            width: 0px;
            height: 0px;
            top: 10%;
            left: 20%;
        }

        .message {
            position: absolute;
            padding: 10px;
            width: 500px;
            color: purple;
            font-size:50px;
        }

        .hidden {
            display: none;
        }
      `;

    static properties = {
        discount: { type: Number },
        canvasWidth: { type: Number },
        canvasHeight: { type: Number },
        disableButton: { type: Boolean}
    };


    constructor() {
        super();
        this.diceArray = [];
        this.renderer = undefined;
        this.scene = undefined;
        this.camera = undefined;
        this.diceMesh = undefined;
        this.physicsWorld = undefined;
        this.params = {
            numberOfDice: 2,
            segments: 40,
            edgeRadius: .07,
            notchRadius: .12,
            notchDepth: .1,
        };
        this.throwDice = this._throwDice.bind(this);
        this.createFloor = this._createFloor.bind(this);
        this.createDiceMesh = this._createDiceMesh.bind(this);
        this.createDice = this._createDice.bind(this);
        this.createBoxGeometry = this._createBoxGeometry.bind(this);
        this.createInnerGeometry = this._createInnerGeometry.bind(this);
        // this.addDiceEvents = this._addDiceEvents.bind(this);
        // this.showRollResults = this._showRollResults.bind(this);
        this.renderDice = this._renderDice.bind(this);
        this.updateSceneSize = this._updateSceneSize.bind(this);
        this.initPhysics = this._initPhysics.bind(this);
        this.initScene = this._initScene.bind(this);
        this.calculateDiscount = this._calculateDiscount.bind(this);
        this.discount = 0;
        this.canvasWidth = 800;
        this.canvasHeight = 600
        this.disableButton = false;
    }

    firstUpdated() {
        this.canvasEl = this.renderRoot.querySelector('#canvas');
        // const scoreResult = document.querySelector('#score-result');

        // let renderer, scene, camera, diceMesh, physicsWorld;

        // const params = {

        // };

        // const diceArray = [];

        this.initPhysics();
        this.initScene();

        // window.addEventListener('resize', updateSceneSize);
        // window.addEventListener('dblclick', throwDice);
        // rollBtn.addEventListener('click', throwDice);

    }

    _initScene() {
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            canvas: this.canvasEl
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(40, this.canvasWidth / this.canvasHeight, .1, 100)
        this.camera.position.set(0, 1, 4).multiplyScalar(7);
        this.camera.rotation.set(-0.34, -0.04, 0);

        this.updateSceneSize();

        const ambientLight = new THREE.AmbientLight(0xffffff, .5);
        this.scene.add(ambientLight);
        const topLight = new THREE.PointLight(0xffffff, .5);
        topLight.position.set(10, 15, 0);
        topLight.castShadow = true;
        topLight.shadow.mapSize.width = 2048;
        topLight.shadow.mapSize.height = 2048;
        topLight.shadow.camera.near = 5;
        topLight.shadow.camera.far = 400;
        this.scene.add(topLight);

        this.createFloor();
        this.diceMesh = this.createDiceMesh();
        for (let i = 0; i < this.params.numberOfDice; i++) {
            this.diceArray.push(this.createDice());
            // this.addDiceEvents(this.diceArray[i], i);
        }

        // this.throwDice();

        this.renderDice();
    }

    _initPhysics() {
        this.physicsWorld = new CANNON.World({
            allowSleep: true,
            gravity: new CANNON.Vec3(0, -50, 0),
        })
        this.physicsWorld.defaultContactMaterial.restitution = .3;
    }

    _createFloor() {
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.ShadowMaterial({
                opacity: .1
            })
        )
        floor.receiveShadow = true;
        floor.position.y = -7;
        floor.quaternion.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI * .5);
        this.scene.add(floor);

        const floorBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
        });
        floorBody.position.copy(floor.position);
        floorBody.quaternion.copy(floor.quaternion);
        this.physicsWorld.addBody(floorBody);
    }

    _createDiceMesh() {
        const boxMaterialOuter = new THREE.MeshStandardMaterial({
            color: 0xeeeeee,
        })
        const boxMaterialInner = new THREE.MeshStandardMaterial({
            color: 0x000000,
            roughness: 0,
            metalness: 1,
            side: THREE.DoubleSide
        })

        const diceMesh = new THREE.Group();
        const innerMesh = new THREE.Mesh(this.createInnerGeometry(), boxMaterialInner);
        const outerMesh = new THREE.Mesh(this.createBoxGeometry(), boxMaterialOuter);
        outerMesh.castShadow = true;
        diceMesh.add(innerMesh, outerMesh);

        return diceMesh;
    }

    _createDice() {
        const mesh = this.diceMesh.clone();
        this.scene.add(mesh);

        const body = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Box(new CANNON.Vec3(.5, .5, .5)),
            sleepTimeLimit: .1
        });
        this.physicsWorld.addBody(body);

        return { mesh, body };
    }

    _createBoxGeometry() {

        let boxGeometry = new THREE.BoxGeometry(1, 1, 1, this.params.segments, this.params.segments, this.params.segments);

        const positionAttr = boxGeometry.attributes.position;
        const subCubeHalfSize = .5 - this.params.edgeRadius;


        for (let i = 0; i < positionAttr.count; i++) {

            let position = new THREE.Vector3().fromBufferAttribute(positionAttr, i);

            const subCube = new THREE.Vector3(Math.sign(position.x), Math.sign(position.y), Math.sign(position.z)).multiplyScalar(subCubeHalfSize);
            const addition = new THREE.Vector3().subVectors(position, subCube);

            if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.y) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
                addition.normalize().multiplyScalar(this.params.edgeRadius);
                position = subCube.add(addition);
            } else if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.y) > subCubeHalfSize) {
                addition.z = 0;
                addition.normalize().multiplyScalar(this.params.edgeRadius);
                position.x = subCube.x + addition.x;
                position.y = subCube.y + addition.y;
            } else if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
                addition.y = 0;
                addition.normalize().multiplyScalar(this.params.edgeRadius);
                position.x = subCube.x + addition.x;
                position.z = subCube.z + addition.z;
            } else if (Math.abs(position.y) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
                addition.x = 0;
                addition.normalize().multiplyScalar(this.params.edgeRadius);
                position.y = subCube.y + addition.y;
                position.z = subCube.z + addition.z;
            }

            const notchWave = (v) => {
                v = (1 / this.params.notchRadius) * v;
                v = Math.PI * Math.max(-1, Math.min(1, v));
                return this.params.notchDepth * (Math.cos(v) + 1.);
            }
            const notch = (pos) => notchWave(pos[0]) * notchWave(pos[1]);

            const offset = .23;

            if (position.y === .5) {
                position.y -= notch([position.x, position.z]);
            } else if (position.x === .5) {
                position.x -= notch([position.y + offset, position.z + offset]);
                position.x -= notch([position.y - offset, position.z - offset]);
            } else if (position.z === .5) {
                position.z -= notch([position.x - offset, position.y + offset]);
                position.z -= notch([position.x, position.y]);
                position.z -= notch([position.x + offset, position.y - offset]);
            } else if (position.z === -.5) {
                position.z += notch([position.x + offset, position.y + offset]);
                position.z += notch([position.x + offset, position.y - offset]);
                position.z += notch([position.x - offset, position.y + offset]);
                position.z += notch([position.x - offset, position.y - offset]);
            } else if (position.x === -.5) {
                position.x += notch([position.y + offset, position.z + offset]);
                position.x += notch([position.y + offset, position.z - offset]);
                position.x += notch([position.y, position.z]);
                position.x += notch([position.y - offset, position.z + offset]);
                position.x += notch([position.y - offset, position.z - offset]);
            } else if (position.y === -.5) {
                position.y += notch([position.x + offset, position.z + offset]);
                position.y += notch([position.x + offset, position.z]);
                position.y += notch([position.x + offset, position.z - offset]);
                position.y += notch([position.x - offset, position.z + offset]);
                position.y += notch([position.x - offset, position.z]);
                position.y += notch([position.x - offset, position.z - offset]);
            }

            positionAttr.setXYZ(i, position.x, position.y, position.z);
        }


        boxGeometry.deleteAttribute('normal');
        boxGeometry.deleteAttribute('uv');
        boxGeometry = BufferGeometryUtils.mergeVertices(boxGeometry);

        boxGeometry.computeVertexNormals();

        return boxGeometry;
    }

    _createInnerGeometry() {
        const baseGeometry = new THREE.PlaneGeometry(1 - 2 * this.params.edgeRadius, 1 - 2 * this.params.edgeRadius);
        const offset = .48;
        return BufferGeometryUtils.mergeBufferGeometries([
            baseGeometry.clone().translate(0, 0, offset),
            baseGeometry.clone().translate(0, 0, -offset),
            baseGeometry.clone().rotateX(.5 * Math.PI).translate(0, -offset, 0),
            baseGeometry.clone().rotateX(.5 * Math.PI).translate(0, offset, 0),
            baseGeometry.clone().rotateY(.5 * Math.PI).translate(-offset, 0, 0),
            baseGeometry.clone().rotateY(.5 * Math.PI).translate(offset, 0, 0),
        ], false);
    }

    _diceHandler(e, resolve) {
        let diceBody = e.target;
        diceBody.allowSleep = false;
        const euler = new CANNON.Vec3();
        e.target.quaternion.toEuler(euler);

        const eps = .1;
        let isZero = (angle) => Math.abs(angle) < eps;
        let isHalfPi = (angle) => Math.abs(angle - .5 * Math.PI) < eps;
        let isMinusHalfPi = (angle) => Math.abs(.5 * Math.PI + angle) < eps;
        let isPiOrMinusPi = (angle) => (Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps);


        if (isZero(euler.z)) {
            if (isZero(euler.x)) {
                resolve(1);
            } else if (isHalfPi(euler.x)) {
                resolve(4);
            } else if (isMinusHalfPi(euler.x)) {
                resolve(3);
            } else if (isPiOrMinusPi(euler.x)) {
                resolve(6);
            } else {
                // landed on edge => wait to fall on side and fire the event again
                dice.body.allowSleep = true;
            }
        } else if (isHalfPi(euler.z)) {
            resolve(2);
        } else if (isMinusHalfPi(euler.z)) {
            resolve(5);
        } else {
            // landed on edge => wait to fall on side and fire the event again
            diceBody.allowSleep = true;
        }
    } 
    // _addDiceEvents(dice, resolve) {
    //     dice.body.addEventListener('sleep', (e) => {

    //     });
    // }

    // _showRollResults(score, index) {
    //     // this.diceValues[index] = score;
    //     // this.discount = this.diceValues.reduce((a, c) => a + c, 0);

    //     // if(this.diceValues.every(x => x !== 0)) {

    //     // }

    //     // console.log(this.discount);
    //     // if (scoreResult.innerHTML === '') {
    //     //     scoreResult.innerHTML += score;
    //     // } else {
    //     //     scoreResult.innerHTML += ('+' + score);
    //     // }
    // }

    _renderDice() {
        this.physicsWorld.fixedStep();

        for (const dice of this.diceArray) {
            dice.mesh.position.copy(dice.body.position)
            dice.mesh.quaternion.copy(dice.body.quaternion)
        }

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.renderDice);
    }

    _updateSceneSize() {
        this.camera.aspect = this.canvasWidth / this.canvasHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    }


    async _throwDice() {
        this.disableButton = true;
        this.discount = 0;

        let promises = [];
        for (let i = 0; i < this.params.numberOfDice; i++) {
            const dice = this.diceArray[i];
            let dicePromise = new Promise(resolve => {
                const partialAppliedDiceHandler = (e) => this._diceHandler(e, resolve);
                this.diceArray[i].body.addEventListener('sleep', partialAppliedDiceHandler);
            })
            promises.push(dicePromise);
        }
        // scoreResult.innerHTML = '';

        this.diceArray.forEach((d, dIdx) => {

            d.body.velocity.setZero();
            d.body.angularVelocity.setZero();

            d.body.position = new CANNON.Vec3(6, dIdx * 1.5, 0);
            d.mesh.position.copy(d.body.position);

            d.mesh.rotation.set(2 * Math.PI * Math.random(), 0, 2 * Math.PI * Math.random())
            d.body.quaternion.copy(d.mesh.quaternion);

            const force = 3 + 5 * Math.random();
            d.body.applyImpulse(
                new CANNON.Vec3(-force, force, 0),
                new CANNON.Vec3(0, 0, .2)
            );

            d.body.allowSleep = true;
        });

        let values = await Promise.all(promises);
        this.discount = values.reduce((a,c) => a + c, 0);
        this.disableButton = false;
        let wait = new Promise(resolve => {
            setTimeout(resolve, 2000);
        });
        console.log(values);
        await wait;
        return this.discount;
    }

    _calculateDiscount() {
        return this.throwDice();
    }

    render() {
        return html`
        <div class="message-wrapper">
            <h2 class="message ${this.discount != 0 ? '' : 'hidden'}">Congratulations you received ${this.discount}% discount</h2>
        </div>
        <div class="content">
            <!-- <div class="ui">
                <h2 class="score">Discount: ${this.discount}%</h2>
                <div class="ui-controls">
                    <button id="roll-btn" ?disabled=${this.disableButton} @click=${this.throwDice}>Throw the dice</button>
                </div>
            </div>  -->
            <canvas id="canvas"></canvas>
        </div>`;
    }

}
customElements.define('dice-component', DiceComponent);

