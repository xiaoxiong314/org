function ORGPoint(num, offset, sumdist, elev) {
    this.num = num;
    this.offset = offset;
    this.sumDist = sumdist;
    this.elevation = elev;
    this.code = 13;
    this.connectPoint = 0;
    this.lineType = 0;
    this.lineCode = 11;
}
ORGPoint.prototype.toString = function () {
    return "b,\t" + this.num + "," + this.offset + "," + this.sumDist + "," + this.elevation + ",\t" +
        this.code + "=00+\t" + this.code + ",\t" + this.connectPoint + ",\t" + this.lineType + ",\t" + this.lineCode + ",,";
}
export default ORGPoint;
