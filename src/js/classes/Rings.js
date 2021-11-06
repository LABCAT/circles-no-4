export default class Rings {

    constructor(p5, x, ringColours) {
        this.ringColours = ringColours;
        this.p = p5;
        this.x = x;
        this.y = 0;
    }

    draw() {
        this.p.strokeWeight(3);
        this.p.noFill();
        
        for (let i = 0; i < this.ringColours.length; i++) {
            const colour = this.p.color(this.ringColours[i]);
            colour.setAlpha(63);
            this.p.stroke(colour);
            this.p.circle(this.x, this.y * i, this.p.width/32);    
        }
    }

    update() {
        this.y++;
    }

}