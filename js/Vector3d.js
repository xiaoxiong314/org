/**
 * 创建Vector3d对象
 * @param {Number} x X
 * @param {Number} y Y
 * @param {Number} z Z
 */
function Vector3d(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};
/**
 * X轴
 */
Vector3d.XAxis = Object.freeze(new Vector3d(1, 0, 0));
/**
 * Y轴
 */
Vector3d.YAxis = Object.freeze(new Vector3d(0, 1, 0));
/**
 * Z轴
 */
Vector3d.ZAxis = Object.freeze(new Vector3d(0, 0, 1));

/**
 * 向量相加
 * @param {Vector3d} vec3 相加的向量
 * @returns 相加后的结果
 */
Vector3d.prototype.add = function (vec3) {
    var _x = this.x + vec3.x;
    var _y = this.y + vec3.y;
    var _z = this.z + vec3.z;
    return new Vector3d(_x, _y, _z);
};
/**
 * 向量叉乘
 * @param {Vector3d} vec3 叉乘的向量
 * @returns 叉乘后的结果
 */
Vector3d.prototype.crossProduct = function (vec3) {
    var _x = this.y * vec3.z - vec3.y * this.z;
    var _y = vec3.x * this.z - this.x * vec3.z;
    var _z = this.x * vec3.y - vec3.y * this.x;
    return new Vector3d(_x, _y, _z);
};
/**
 * 向量单位化
 * @returns 单位化后的向量
 */
Vector3d.prototype.normalize = function () {
    var mod = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    return new Vector3d(this.x / mod, this.y / mod, this.z / mod);
};
/**
 * 向量求反
 * @returns 求反后的向量
 */
Vector3d.prototype.negtive = function () {
    return new Vector3d(-this.x, -this.y, -this.z);
};

/**
 *  向量缩放
 * @param {Number} d 缩放的倍数
 * @returns 缩放后的向量
 */
Vector3d.prototype.scale = function (d) {
    return new Vector3d(this.x * d, this.y * d, this.z * d);
};
export default Vector3d;