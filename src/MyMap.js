import React, { Component } from "react";
import "./App.css";
import "./MyMap.css";
import "./legend.css";
import "leaflet/dist/leaflet.css";
// import "leaflet/dist/leaflet.draw.css";
import {
  Map,
  TileLayer,
  ScaleControl,
  GeoJSON,
  Control,
  withLeaflet,
  ZoomControl,
  Circle,
  FeatureGroup,
  LayerGroup,
  LayersControl,
  Marker,
  Popup,
  Rectangle,
  defaultExtentControl,
  drawControl
} from "react-leaflet";
import LinearRuler from "react-leaflet-linear-ruler";
import { EditControl } from "react-leaflet-draw";
import MapRef from "./map-context";
import Home from "./Home";
import Download from "./Download";
import L from "leaflet";
import printPlugin from "leaflet-easyprint";
import boxZoom from "react-leaflet-box-zoom";
import geojsonFeatures from "./Bihar_Villg_Bndry.json";
import MiniMap from "leaflet-minimap";
import "../../node_modules/leaflet-minimap/dist/Control.MiniMap.min.css";
// import LeafletPoviders from "LeafletPoviders";
import Infobox from "./infobox";
import "./myInfobox.css";
import html2canvas from "html2canvas";
import PrintControlDefault from "react-leaflet-easyprint";
import easyButton from "leaflet-easybutton";
import zoomBox from "leaflet-zoombox";
import fullScreen from "leaflet-fullscreen";
// import { faHome } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HomeIcon from "@material-ui/icons/Home";
import { BoxZoomControl } from "react-leaflet-box-zoom";
import MeasureControlDefault from "react-leaflet-measure";

import PanoStreetView from "react-leaflet-street-view";
// import "./boxZoomControl.css";
const MeasureControl = withLeaflet(MeasureControlDefault);
const { BaseLayer, Overlay } = LayersControl;

const rectangle = [
  [51.49, -0.08],
  [51.5, -0.06]
];

const propTypes = {};
const defaultProps = {};
// wrap `PrintControl` component with `withLeaflet` HOC
const PrintControl = withLeaflet(PrintControlDefault);
// const basemapUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const defaultMap = { lat: 22.167057857886153, lng: 79.6728515625, zoom: 5 };
const colorArray = ["red", "green", "#ffbf00"];
const linearRulerOptions = {
  position: "topleft",
  unitSystem: "imperial",
  color: "#FF0080",
  type: "line",
  // color: "#4D90FE",
  fillColor: "#fff",
  // type: "node",
  features: [
    "node",
    "line",
    "polygon",
    "ruler",
    "paint",
    "drag",
    "rotate",
    "nodedrag",
    "trash"
  ],
  pallette: ["#FF0080", "#4D90FE", "red", "blue", "green", "orange", "black"],
  dashArrayOptions: [
    "5, 5",
    "5, 10",
    "10, 5",
    "5, 1",
    "1, 5",
    "0.9",
    "15, 10, 5",
    "15, 10, 5, 10",
    "15, 10, 5, 10, 15",
    "5, 5, 1, 5"
  ],
  fill: true,
  stroke: true,
  dashArray: [5, 5],
  weight: 2,
  opacity: 1,
  fillOpacity: 0.5,
  radius: 3,
  doubleClickSpeed: 300
};

let cities = L.layerGroup();

L.marker([39.61, -105.02]).bindPopup("This is Littleton, CO.").addTo(cities);
L.marker([39.74, -104.99]).bindPopup("This is Denver, CO.").addTo(cities);
L.marker([39.73, -104.8]).bindPopup("This is Aurora, CO.").addTo(cities);
L.marker([39.77, -105.23]).bindPopup("This is Golden, CO.").addTo(cities);

let mbAttr =
  'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
  '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
let mbUrl =
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

let grayscale = L.tileLayer(mbUrl, {
  id: "mapbox/light-v9",
  tileSize: 512,
  zoomOffset: -1,
  attribution: mbAttr
});
let streets = L.tileLayer(mbUrl, {
  id: "mapbox/streets-v11",
  tileSize: 512,
  zoomOffset: -1,
  attribution: mbAttr
});

let topographic = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  {
    id: "Topographic",
    tileSize: 512,
    zoomOffset: -1,
    attribution: mbAttr
  }
);

const getColor = (properties) => {
  return colorArray[Math.floor(Math.random() * colorArray.length)];

  // return properties.CEN_2001 <= 1001000700092100
  //   ? "green"
  //   : properties.CEN_2001 >= 1001001300122300
  //   ? "red"
  //   : "#ffbf00";
};

class MyMap extends Component {
  static contextType = MapRef;
  constructor(props) {
    super(props);
    this.basemapUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
    // this.getColor = this.getColor.bind(this);
  }

  state = {
    lat: defaultMap.lat,
    lng: defaultMap.lon,
    zoom: defaultMap.zoom,
    streetView: null
  };

  // setMapAtDefaultExtent = () => {
  //   this.setState(() => ({
  //     lat: defaultCenter[0],
  //     lng: defaultCenter[1],
  //     zoom: 5
  //   }));
  // };

  handleDragEnd = () => {
    const { lat, lng } = this.map.leafletElement.getCenter();
    this.setState({
      lat,
      lng
    });
  };

  // handleZoomEnd = () => {
  //   this.setState({
  //     zoom: this.map.leafletElement.getZoom()
  //   });
  // };

  FillShades({ properties }) {
    return {
      fillColor: getColor(properties),
      weight: 1,
      opacity: 1,
      color: "white",
      dashArray: "1",
      fillOpacity: 0.8
    };
  }

  componentDidMount() {
    const geojsonLayer = L.geoJSON(geojsonFeatures, {
      // style: function(feature) {
      //   return {
      //     color:
      //       feature.properties.CEN_2001 <= 1001000700092100
      //         ? "green"
      //         : feature.properties.CEN_2001 >= 1001001300122300
      //         ? "red"
      //         : "#ffbf00"
      //   };
      // },
      style: this.FillShades,
      // onEachFeature: function (feature, layer) {
      //   if (feature.properties) {
      //     let popupContent = "<table>";

      //    let popupContent += `<tr class = "infoboxHeader"> <th colspan="2">Firstname</th></tr>`;
      //     Object.keys(feature.properties).forEach((key, index) => {
      //       popupContent +=
      //         `<tr class = "infoboxData"><td>` +
      //         key +
      //         "&nbsp&nbsp</td><td><b>" +
      //         feature.properties[key] +
      //         "</b></td></tr>";
      //     });
      //     popupContent += "</table>";
      //     layer.bindPopup(popupContent);
      //   }
      // }
      onEachFeature: function (feature, layer) {
        if (feature.properties) {
          let popupContent = "<div class='popupContent'>";

          popupContent += `<h3 class = "infoboxHeader"> Village Boundary</h3>`;
          Object.keys(feature.properties).forEach((key, index) => {
            popupContent +=
              `<div class = "infoboxData"><span>` +
              key +
              "</span><span>" +
              feature.properties[key] +
              "</span></div>";
          });
          popupContent += "</div>";
          let popup1 = layer.bindPopup(popupContent);
          popup1.on("popupclose", function (e) {
            alert("Hi!");
          });
        }
      }
    });
    // .addTo(this.map.leafletElement)
    this.map.leafletElement.on("popupclose", function (e) {
      console.log("popup closed");
    });

    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function (map) {
      let div = L.DomUtil.create("div", "info legend"),
        grades = [0, 2, 3];
      // labels = [];
      div.innerHTML = "<span> Quaterly Occurrences </span><br/>";
      // loop through our density intervals and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
        let color =
          grades[i] === 0 ? "green" : grades[i] === 3 ? "red" : "#ffbf00";
        div.innerHTML +=
          '<i style="background:' +
          color +
          '"></i> ' +
          grades[i] +
          (grades[i + 1] ? "&ndash;" + parseInt(grades[i] + 1) + "<br/>" : "+");
      }
      return div;
    };

    // legend.addTo(this.map.leafletElement);

    // L.easyPrint({
    //   title: "Download Map",
    //   position: "topleft",
    //   sizeModes: ["Current", "A4Portrait", "A4Landscape"],
    //   filename: "myMap",
    //   exportOnly: true
    // }).addTo(this.map.leafletElement);

    // L.control.legend({
    //   items: [
    //     { color: "red", label: "reserved" },
    //     { color: "blue", label: "not reserved" }
    //   ],
    //   collapsed: true,
    //   // insert different label for the collapsed legend button.
    //   buttonHtml: "legend"
    // });

    // L.Control.boxzoom({ position: "topleft" }).addTo(this.map.leafletElement);

    // adding minimap started

    this.minimapLayer = new L.TileLayer(this.basemapUrl, {
      minZoom: 0,
      maxZoom: 13
    });

    // let miniMap = new L.Control.MiniMap(osm2, { toggleDisplay: true, aimingRectOptions : rect1, shadowRectOptions: rect2}).addTo(map);
    this.MiniMap = new L.Control.MiniMap(this.minimapLayer, {
      position: "bottomleft",
      minimized: true,
      toggleDisplay: true,
      width: 200,
      height: 150,
      zoomLevelFixed: false,
      zoomAnimation: false,
      aimingRectOptions: { color: "#ff7800", weight: 1, clickable: false },
      shadowRectOptions: {
        color: "#000000",
        weight: 1,
        clickable: false,
        opacity: 1,
        fillOpacity: 1
      },
      collapsedWidth: 32,
      collapsedHeight: 32
    }).addTo(this.map.leafletElement);
    // Adding minimap ended
    let baseLayers = {
      Streets: streets,
      Grayscale: grayscale,
      Topographic: topographic
    };

    let overlays = {
      geojsonLayer: geojsonLayer,
      geojsonLayer1: geojsonLayer
    };

    L.control.layers(baseLayers, overlays).addTo(this.map.leafletElement);
    // Box Zoom
    // let options1 = {
    //   modal: true,
    //   title: "Box area zoom"
    // };
    // let control = L.control.zoomBox(options1);
    // this.map.leafletElement.addControl(control);

    // L.control.defaultExtent().addTo(this.map.leafletElement);

    L.easyButton(
      '<img src="/images/Home.svg" alt="W3Schools.com"  class="easyButtonHomeIcon">',
      function (btn, map) {
        map.setView([defaultMap.lat, defaultMap.lng], 5);
      },
      "Default Extent"
    ).addTo(this.map.leafletElement);

    //Edit controls
    // FeatureGroup is to store editable layers
    //   let drawnItems = new L.FeatureGroup();
    //   this.map.leafletElement.addLayer(drawnItems);
    //   let drawControl = new L.Control.Draw({
    //     edit: {
    //       featureGroup: drawnItems
    //     }
    //   });
    //   this.map.leafletElement.addControl(drawControl);

    // let editableLayers = new L.FeatureGroup();
    // this.map.leafletElement.addLayer(editableLayers);

    // let MyCustomMarker = L.Icon.extend({
    //   options: {
    //     shadowUrl: null,
    //     iconAnchor: new L.Point(12, 12),
    //     iconSize: new L.Point(24, 24),
    //     iconUrl: "link/to/image.png"
    //   }
    // });
    // let options = {
    //   position: "topright",
    //   draw: {
    //     polyline: {
    //       shapeOptions: {
    //         color: "#f357a1",
    //         weight: 10
    //       }
    //     },
    //     polygon: {
    //       allowIntersection: false, // Restricts shapes to simple polygons
    //       drawError: {
    //         color: "#e1e100", // Color the shape will turn when intersects
    //         message: "<strong>Oh snap!<strong> you can't draw that!" // Message that will show when intersect
    //       },
    //       shapeOptions: {
    //         color: "#bada55"
    //       }
    //     },
    //     circle: false, // Turns off this drawing tool
    //     rectangle: {
    //       shapeOptions: {
    //         clickable: false
    //       }
    //     },
    //     marker: {
    //       icon: new MyCustomMarker()
    //     }
    //   },
    //   edit: {
    //     featureGroup: editableLayers, //REQUIRED!!
    //     remove: false
    //   }
    // };

    // let drawControl = new L.Control.Draw(options);
    // this.map.leafletElement.addControl(drawControl);

    // this.map.leafletElement.on(L.Draw.Event.CREATED, function (e) {
    //   let type = e.layerType,
    //     layer = e.layer;

    //   if (type === "marker") {
    //     layer.bindPopup("A popup!");
    //   }

    //   editableLayers.addLayer(layer);

    // });

    // create a fullscreen button and add it to the map
    //   L.control
    //     .fullscreen({
    //       position: "topleft", // change the position of the button can be topleft, topright, bottomright or bottomleft, defaut topleft
    //       title: "Show me the fullscreen !", // change the title of the button, default Full Screen
    //       titleCancel: "Exit fullscreen mode", // change the title of the button when fullscreen is on, default Exit Full Screen
    //       content: null, // change the content of the button, can be HTML, default null
    //       forceSeparateButton: true, // force seperate button to detach from zoom buttons, default false
    //       forcePseudoFullscreen: true, // force use of pseudo full screen even if full screen API is available, default false
    //       fullscreenElement: false // Dom element to render in full screen, false by default, fallback to map._container
    //     })
    //     .addTo(this.map.leafletElement);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("changed");
  }

  render() {
    const { lat, lng, zoom } = defaultMap;
    const measureOptions = {
      position: "topright",
      primaryLengthUnit: "meters",
      secondaryLengthUnit: "kilometers",
      // primaryAreaUnit: "sqmeters",
      // secondaryAreaUnit: "acres",
      activeColor: "#db4a29",
      completedColor: "#9b2d14"
    };

    return (
      <>
        <Map
          center={[lat, lng]}
          layers={[streets]}
          zoom={zoom}
          maxZoom={20}
          attributionControl={true}
          defaultExtentControl={false}
          zoomControl={true}
          fullscreenControl={true}
          // drawControl={true}
          // EditControl={true}
          doubleClickZoom={true}
          scrollWheelZoom={true}
          dragging={true}
          animate={true}
          easeLinearity={0.35}
          ref={(ref) => {
            this.map = ref;
          }}
          onClick={(e) => this.setState({ streetView: e })}
          // onDragEnd={this.handleDragEnd.bind(this)}
          // onZoomEnd={this.handleZoomEnd.bind(this)}
        >
          {/* <TileLayer
            url={baseLayers}
            // attribution={
            //   '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            // }
          /> */}
          <ScaleControl />
          {/* <defaultExtentControl /> */}
          {/* <drawControl position="topleft" /> */}
          <PrintControl
            ref={(ref) => {
              this.printControl = ref;
            }}
            position="topleft"
            sizeModes={["Current", "A4Portrait", "A4Landscape"]}
            hideControlContainer={false}
          />
          {/* <FeatureGroup>
            <EditControl
              position="topright"
              onEdited={this._onEditPath}
              onCreated={this._onCreate}
              onDeleted={this._onDeleted}
              draw={{
                rectangle: true,
                circle: true
              }}
            />
            <Circle center={[51.51, -0.06]} radius={200} />
          </FeatureGroup> */}
          <BoxZoomControl
            style={{
              width: "36px",
              height: "36px",
              border: "none",
              borderRadius: "4px",
              background: "url('./images/boxZoomIcon.png')",
              backgroundColor: "rgb(255, 255, 255)",
              outline: "none",
              backgroundPosition: "50% 50%",
              backgroundRepeat: "no-repeat",
              backgroundSize: "32px",
              title: "hfbhdkgj"
            }}
            position="topleft"
            // sticky={true}
            title="jdfucegbf"
          />
          <MeasureControl {...measureOptions} />
          {/* <LinearRuler {...linearRulerOptions} /> */}
          <PanoStreetView
            streetView={this.state.streetView}
            position="bottomright"
            sameWindow="true"
          />
          {/* <CustomReactComponent /> */}
        </Map>
        {/* <Home setMapAtDefaultExtent={this.setMapAtDefaultExtent.bind(this)} /> */}
        {/* <Download takeScreenShot={this.takeScreenShot.bind(this)} /> */}
      </>
    );
  }
}

export default MyMap;
MyMap.propTypes = propTypes;
MyMap.defaultProps = defaultProps;
