export default class Sprite {
  constructor({ imageSrc, x, y, width, height, frameCount = 1, frameRate = 10, scale = 1, imageArray = null }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.frameCount = frameCount;
    this.frameRate = frameRate;
    this.scale = scale;

    this.currentFrame = 0;
    this.elapsedFrames = 0;
    this.loaded = false;

    const checkLoaded = () => {
      if (this.isImageArray) {
        if (this.images.every(i => i.complete && i.naturalWidth > 0)) {
          this.loaded = true;
          this.width = this.images[0].naturalWidth;
          this.height = this.images[0].naturalHeight;
        }
      } else {
        if (this.image.complete && this.image.naturalWidth > 0) {
          this.loaded = true;
          this.width = this.image.naturalWidth / this.frameCount;
          this.height = this.image.naturalHeight;
        }
      }
    };

    if (imageArray) {
      this.isImageArray = true;
      this.images = imageArray.map(src => {
        const img = new Image();
        img.src = src;
        img.onload = checkLoaded;
        img.onerror = () => console.error("Failed to load image:", src);
        return img;
      });
      // Initial check in case they are already cached
      setTimeout(checkLoaded, 0);
    } else {
      this.isImageArray = false;
      this.image = new Image();
      this.image.src = imageSrc;
      this.image.onload = checkLoaded;
      this.image.onerror = () => console.error("Failed to load image:", imageSrc);
      setTimeout(checkLoaded, 0);
    }
  }

  draw(ctx) {
    if (!this.loaded) return;

    if (this.isImageArray) {
      const img = this.images[this.currentFrame];
      ctx.drawImage(
        img,
        this.x,
        this.y,
        this.width * this.scale,
        this.height * this.scale
      );
    } else {
      const sourceX = this.currentFrame * this.width;
      ctx.drawImage(
        this.image,
        sourceX,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width * this.scale,
        this.height * this.scale
      );
    }
  }

  update() {
    this.elapsedFrames++;

    if (this.elapsedFrames % this.frameRate === 0) {
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
    }
  }

  get hitbox() {
    return {
      x: this.x + (this.width * this.scale * 0.1),
      y: this.y + (this.height * this.scale * 0.1),
      width: this.width * this.scale * 0.8,
      height: this.height * this.scale * 0.8,
    };
  }
}
