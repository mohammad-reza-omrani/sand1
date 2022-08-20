import React from "react";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const Home = props => {
  return (
    <div className="home-button homeIcon" onClick={props.setMapAtDefaultExtent}>
      <div className="HomeButton" style={{ display: "block" }}>
        <div className="homeContainer">
          <div title="Default extent" className="home">
            <FontAwesomeIcon icon={faHome} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
