import Sprite from './Sprite';

export default class Enemy extends Sprite {
    constructor(options) {
        super(options);
        this.speed = options.speed || 5;
        this.type = options.type; // 'SMALL', 'TALL', 'FLYING'
    }

    update() {
        super.update();
        this.x -= this.speed;
    }

    isOffScreen() {
        return this.x + (this.width * this.scale) < 0;
    }

    get hitbox() {
        // Ultra forgiving hitbox for enemies (40% of visual size)
        return {
            x: this.x + (this.width * this.scale * 0.3),
            y: this.y + (this.height * this.scale * 0.3),
            width: this.width * this.scale * 0.4,
            height: this.height * this.scale * 0.4,
        };
    }
}
