function Kml(name, ring) {
    this.lineColor = "9900FF00";
    this.lineWidth = 1;
    this.fillColor = "550000FF";
    this.name = name;
    this.ring = ring;
};
Kml.prototype.toString = function () {
    var kmlStr = (
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + "\n"
        + "<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:atom=\"http://www.w3.org/2005/Atom\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\">" + "\n"
        + "		<Placemark>" + "\n"
        + "			<name>" + this.name + "</name>" + "\n"
        + "			<Style>" + "\n"
        + "				<LineStyle><color>" + this.lineColor + "</color><width>" + this.lineWidth + "</width></LineStyle>" + "\n"
        + "				<PolyStyle><color>" + this.fillColor + "</color></PolyStyle>" + "\n"
        + "			</Style>" + "\n"
        + "				<Polygon>" + "\n"
        + "					<tessellate>1</tessellate>" + "\n"
        + "					<outerBoundaryIs>" + "\n"
        + "						<LinearRing>" + "\n"
        + "							<coordinates>" + getRingStr(this.ring) + "</coordinates>" + "\n"
        + "						</LinearRing>" + "\n"
        + "					</outerBoundaryIs>" + "\n"
        + "				</Polygon>" + "\n"
        + "		</Placemark>" + "\n"
        + "</kml>"
    );
    return kmlStr;
}
function getRingStr(ring) {
    let ringStr = "";
    for (let i = 0; i < ring.length; i++) {
        const coor = ring[i];
        ringStr += coor.toString() + ",0 ";
    }
    return ringStr;
}
export default Kml;