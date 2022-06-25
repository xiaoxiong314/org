function ORGPile(name, offset, sumdist, elev, angle, x, y, z) {
    this.name = name;
    this.offset = offset;
    this.sumDist = sumdist;
    this.elevation = elev;
    this.code = 96;
    this.angle = angle;
    this.X = x;
    this.Y = y;
    this.Z = z;
}
ORGPile.prototype.toString = function () {
    return "0," + this.name + "," + this.offset
        + "," + this.sumDist + "," + this.elevation + ",\t" +
        this.code + "=00+\t" + this.code + ",\t" + this.angle
        + "0.00000000,,," + this.X + "," + this.Y + "," + this.Z;
}
export default ORGPile;