export default class DrumHit {

    constructor(p5, x, y, size, fill) {
        this.p = p5;
        this.x = x;
        this.y = y;
        this.size = size;
        this.fill = fill;
    }

    draw() {
        this.p.stroke('#000000');
        this.p.fill(this.fill);
        this.p.ellipse(this.x, this.y, this.size);   
    }

    update() {
        this.size = this.size - (this.size / 16);
    }

}