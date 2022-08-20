import React, { Component } from "react";
import "./styles.css";
import MyMap from "./MyMap";
import MapRef from "./map-context";
import L from "leaflet";
import geojsonFeature from "./Bihar_Villg_Bndry.json";
import Infobox from "./infobox";
import SearchAppBar from "./SearchAppBar";
import PersistentDrawerLeft from "./PersistentDrawerLeft";

class App extends Component {
  render() {
    return (
      <>
        {/* <PersistentDrawerLeft /> */}
        <SearchAppBar />
        <MyMap />
        {/* <Infobox /> */}
      </>
    );
  }
}

export default App;
