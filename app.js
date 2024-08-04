import Map from '@arcgis/core/Map';
import SceneView from '@arcgis/core/views/SceneView';
import Polygon from '@arcgis/core/geometry/Polygon';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomBoolean() {
  return Math.random() >= 0.5;
}
function generateRandomPoint(centerLng, centerLat, radiusInMeters) {
  const R = 6371000;

  const radiusInDegrees = radiusInMeters / R;


  const latRad = centerLat * Math.PI / 180;
  const lngRad = centerLng * Math.PI / 180;

  const randomDistance = radiusInDegrees * Math.sqrt(Math.random());
  const randomAngle = Math.random() * 2 * Math.PI;

  const newLat = Math.asin(Math.sin(latRad) * Math.cos(randomDistance) +
    Math.cos(latRad) * Math.sin(randomDistance) * Math.cos(randomAngle));
  const newLng = lngRad + Math.atan2(Math.sin(randomAngle) * Math.sin(randomDistance) * Math.cos(latRad),
    Math.cos(randomDistance) - Math.sin(latRad) * Math.sin(newLat));

  return {
    y: newLat * 180 / Math.PI,
    x: newLng * 180 / Math.PI
  };
}
function getRandomColor() {
  const colorRange = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78]
  ];
  return colorRange[getRandomInt(0, colorRange.length - 1)]
}




function generateBars(anchor, radius, count) {
  return new Array(count).fill(undefined).map(() => {
    const coordinates = generateRandomPoint(anchor.x, anchor.y, radius)
    return {
      ...coordinates, height: getRandomInt(100, 1500), color: getRandomColor(), radius: 0.0001
    }
  })
}



function boot() {
  const center = { x: 54.4388775, y: 24.429743, z: 1000 }
  const map = new Map({
    basemap: 'dark-gray-vector',
  })
  const view = new SceneView({
    container: 'viewDiv',
    map,
    center: [center.x, center.y],
    zoom: 15,
    camera: {
      position: { ...center, z: 1000 },
      heading: 100,
      tilt: 45
    },
    viewingMode: 'local'
  });

  var graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  const data = generateBars(center, 500, 150)
  function createHexagon(centerX, centerY, radius) {
    var points = [];
    const resolution = 10
    for (var i = 0; i < resolution; i++) {
      var angle = 2 * Math.PI / resolution * i;
      var x = centerX + radius * Math.cos(angle);
      var y = centerY + radius * Math.sin(angle);
      points.push([x, y]);
    }
    points.push(points[0]);  // Close the hexagon
    return points;
  }

  const w = 0.0001
  data.forEach(function (point) {
    var polygon = new Polygon({
      rings: [
        createHexagon(point.x, point.y, point.radius)
      ]
    });

    var graphic = new Graphic({
      geometry: polygon,
      symbol: {
        type: "polygon-3d",
        symbolLayers: [{
          type: "extrude",
          size: point.height,
          material: { color: point.color }
        }]
      }
    });

    graphicsLayer.add(graphic);
  });
}

boot()