/**
 * 创建Org中的连线
 * @param {ORGPoint} pt1 连线点1
 * @param {ORGPoint} pt2 连线点2
 * @param {Number} lnCode 连线编码，11-中线，12-左边线，13-右边线
 */
function ORGLine(pt1, pt2, lnCode) {
    this.ptNum1 = pt1.num;
    this.ptNum2 = pt2.num;
    this.lineCode = lnCode;
}
ORGLine.prototype.toString = function () {
    return "c,\t" + this.ptNum1 + ",\t" + this.ptNum2 + ",\t0,\t" + this.lineCode;
}
export default ORGLine;