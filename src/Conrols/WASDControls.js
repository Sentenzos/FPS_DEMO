import * as THREE from 'three';

export class WASDControls {
    objects = [];
    moveForward = false;
    moveBackward = false;
    moveLeft = false;
    moveRight = false;
    canJump = false;
    velocity = new THREE.Vector3();
    direction = new THREE.Vector3();
    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    constructor(controls, scene, camera, renderer) {
        this.controls = controls;
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.prevTime = performance.now();

        this.animate();

        document.addEventListener( 'keydown', this.onKeyDown );
        document.addEventListener( 'keyup', this.onKeyUp );
    }

    onKeyDown( event ) {
        switch ( event.code ) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = true;
                break;

            case 'Space':
                if ( this.canJump === true ) this.velocity.y += 350;
                this.canJump = false;
                break;
        }
    };

    onKeyUp( event ) {
        switch ( event.code ) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = false;
                break;

        }
    };

    animate = () => {
        console.log(this.animate)
        requestAnimationFrame( this.animate );

        const time = performance.now();

        if ( this.controls.isLocked === true ) {

            this.raycaster.ray.origin.copy( this.controls.getObject().position );
            this.raycaster.ray.origin.y -= 10;

            // const intersections = this.raycaster.intersectObjects( objects, false );

            // const onObject = intersections.length > 0;

            const delta = ( time - this.prevTime ) / 1000;

            this.velocity.x -= this.velocity.x * 10.0 * delta;
            this.velocity.z -= this.velocity.z * 10.0 * delta;

            this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

            this.direction.z = Number( this.moveForward ) - Number( this.moveBackward );
            this.direction.x = Number( this.moveRight ) - Number( this.moveLeft );
            this.direction.normalize(); // this ensures consistent movements in all directions

            if ( this.moveForward || this.moveBackward ) this.velocity.z -= this.direction.z * 400.0 * delta;
            if ( this.moveLeft || this.moveRight ) this.velocity.x -= this.direction.x * 400.0 * delta;

            // if ( onObject === true ) {
            //     this.velocity.y = Math.max( 0, this.velocity.y );
            //     canJump = true;
            // }

            this.controls.moveRight( - this.velocity.x * delta );
            this.controls.moveForward( - this.velocity.z * delta );

            this.controls.getObject().position.y += ( this.velocity.y * delta ); // new behavior

            if ( this.controls.getObject().position.y < 10 ) {

                this.velocity.y = 0;
                this.controls.getObject().position.y = 10;

                this.canJump = true;

            }

        }

        this.prevTime = time;

        this.renderer.render( this.scene, this.camera );

    }

}