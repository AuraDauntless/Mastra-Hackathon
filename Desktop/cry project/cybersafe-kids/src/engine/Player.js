import Sprite from './Sprite';

export default class Player extends Sprite {
    constructor(options) {
        super(options);
        this.velocityY = 0;
        this.gravity = 1.2;
        this.jumpStrength = -28;
        this.isJumping = false;
        this.groundY = options.y; // Keep track of starting ground level

        this.state = 'RUNNING'; // RUNNING, JUMPING, STILL

        // Load still image
        this.stillImage = new Image();
        this.stillImage.src = '/src/assets/player/stand_still.png';
        this.stillImageLoaded = false;
        this.stillImage.onload = () => {
            this.stillImageLoaded = true;
        };
    }

    setStill(isStill) {
        if (isStill) {
            this.state = 'STILL';
        } else if (this.state === 'STILL') {
            this.state = this.isJumping ? 'JUMPING' : 'RUNNING';
        }
    }

    jump() {
        if (!this.isJumping && this.state !== 'STILL') {
            this.velocityY = this.jumpStrength;
            this.isJumping = true;
            this.state = 'JUMPING';
        }
    }

    update() {
        if (this.state !== 'STILL') {
            super.update();
            this.y += this.velocityY;

            if (this.y < this.groundY) {
                this.velocityY += this.gravity;
            } else {
                this.y = this.groundY;
                this.velocityY = 0;
                this.isJumping = false;
                if (this.state === 'JUMPING') this.state = 'RUNNING';
            }
        }
    }

    draw(ctx) {
        if (this.state === 'STILL' && this.stillImageLoaded) {
            ctx.drawImage(
                this.stillImage,
                this.x,
                this.y,
                this.width * this.scale,
                this.height * this.scale
            );
        } else {
            super.draw(ctx);
        }
    }
}
