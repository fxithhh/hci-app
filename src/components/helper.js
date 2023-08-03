// helper.js

export function getDistFromCoords(refCarparkCoords, targetLocationCoords) {
    const targetLat = parseFloat(targetLocationCoords.split(",")[0]);
    const targetLng = parseFloat(targetLocationCoords.split(",")[1]);
    const refCarparkLat = parseFloat(refCarparkCoords[0]);
    const refCarparkLng = parseFloat(refCarparkCoords[1]);
    const referenceMapDist = 111.32;
    const distance = Math.sqrt(
        Math.pow(targetLat - refCarparkLat, 2) +
        Math.pow(targetLng - refCarparkLng, 2)
    ) * referenceMapDist;
    return distance;
}

export function getMapDistance(carparkList, targetLocation) {
    for (let i = 0; i < carparkList.length; i++) {
        const refCarpark = carparkList[i];
        const dist = getDistFromCoords(refCarpark.coordinates, targetLocation);
        refCarpark["distance_from_target"] = dist;
    }
}
