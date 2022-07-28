import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { usePromiseTracker } from "react-promise-tracker";
import logo from "../../Images/bare-logo.png";
import "./index.css";

function Loading() {
  const { promiseInProgress } = usePromiseTracker();

  return (
    <>
      {promiseInProgress && (
        <div className="form-loading">
          <div className="fill-loading">
            <div id="topSvg">
              <img src={logo} />
            </div>

            <div id="endsvg">
              <ReactLoading type="bubbles" color="#fff #ccc #ddd" width={92} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Loading;
