export default class Bubble {
    constructor(p5, x, y, colorPallette) {
        this.p = p5;
        this.x = x + this.p.random(-(this.p.width / 32), this.p.width / 32);
        this.y = y + this.p.random(-(this.p.width / 32), this.p.width / 32);
        this.strokeColour = this.p.color(this.p.random(colorPallette));
        this.fillColour = this.strokeColour;
        this.fillColour.setAlpha(31);
        this.speed = 3;
        this.ax = this.p.random(-this.speed, this.speed);
        this.ay = this.p.random(-this.speed, this.speed);
        this.gravity = 0.1;
        this.diameter = (this.p.dist(this.x, this.y, x, y)) * 0.8;
    }

    update() {
        this.diameter = this.diameter - 0.15;
        this.x += this.ax / 2;
        this.y += this.ay / 2;

        this.x += this.p.random(-this.speed / 2, this.speed / 2);
        this.y += this.p.random(-this.speed / 2, this.speed / 2);
    }

    ballisFinished() {
        if (this.diameter < 0) {
            return true;
        }
    }

    draw() {
        this.p.noStroke();
        if (this.diameter > 0) {
            this.p.noFill();
            this.p.stroke(this.strokeColour);
            //this.p.fill(this.fillColour);
            this.p.ellipse(this.x, this.y, this.diameter, this.diameter);
        }
    }
}