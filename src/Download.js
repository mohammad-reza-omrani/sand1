import React from "react";
import "./Download.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const Download = (props) => {
  return (
    <div
      className="download-button downloadIcon"
      onClick={props.takeScreenShot}
    >
      <div className="DownloadButton" style={{ display: "block" }}>
        <div className="downloadContainer">
          <div title="Default extent" className="download">
            <FontAwesomeIcon icon={faDownload} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Download;
