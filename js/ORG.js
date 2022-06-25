import ORGLine from "./ORGLine.js";
function ORG() {
    this.ORGPiles = [];
    this.ORGPoints = [];
    this.ORGPointsL = [];
    this.ORGPointsR = [];
    this.ORGLines = [];
};

ORG.prototype.UpdateAngle = function () {
    for (let i = 1; i < this.ORGPiles.length - 1; i++) {
        var va = {
            x: this.ORGPiles[i].X - this.ORGPiles[i - 1].X,
            y: this.ORGPiles[i].Y - this.ORGPiles[i - 1].Y
        };
        var vb = {
            x: this.ORGPiles[i + 1].X - this.ORGPiles[i].X,
            y: this.ORGPiles[i + 1].Y - this.ORGPiles[i].Y
        };
        var angle = this.AngleBetween(va, vb);
        this.ORGPiles[i].angle = angle;
    }
}
ORG.prototype.UpdateLine = function () {
    for (let i = 0; i < this.ORGPoints.length - 1; i++) {
        this.ORGLines.push(new ORGLine(this.ORGPoints[i], this.ORGPoints[i + 1], 11));
    }
    for (let i = 0; i < this.ORGPointsL.length - 1; i++) {
        this.ORGLines.push(new ORGLine(this.ORGPointsL[i], this.ORGPointsL[i + 1], 12));
    }
    for (let i = 0; i < this.ORGPointsR.length - 1; i++) {
        this.ORGLines.push(new ORGLine(this.ORGPointsR[i], this.ORGPointsR[i + 1], 13));
    }
}

ORG.prototype.AngleBetween = function (va, vb) {
    let vaL = Math.sqrt(va.x * va.x + va.y * va.y);
    let vbL = Math.sqrt(vb.x * vb.x + vb.y * vb.y);
    let ang = (va.x * vb.x + va.y * vb.y) / (vaL * vbL);
    ang = Math.acos(ang) * 180 / Math.PI;
    let temp = va.x * vb.y - vb.x * va.y;
    let flag = temp > 0 ? 1 : -1;
    return flag * ang;
}

ORG.prototype.toString = function () {
    var orgStr = "";
    for (let i = 0; i < this.ORGPiles.length; i++) {
        const pile = this.ORGPiles[i];
        orgStr += pile.toString() + "\n";
    }
    for (let i = 0; i < this.ORGPoints.length; i++) {
        const point = this.ORGPoints[i];
        orgStr += point.toString() + "\n";;
    }
    for (let i = 0; i < this.ORGPointsL.length; i++) {
        const point = this.ORGPointsL[i];
        orgStr += point.toString() + "\n";;
    }
    for (let i = 0; i < this.ORGPointsR.length; i++) {
        const point = this.ORGPointsR[i];
        orgStr += point.toString() + "\n";;
    }
    for (let i = 0; i < this.ORGLines.length; i++) {
        const line = this.ORGLines[i];
        orgStr += line.toString() + "\n";;
    }
    return orgStr;
}
export default ORG;