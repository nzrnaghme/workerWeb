import { useEffect, useState } from "react";
import Mapir from "mapir-react-component";
import clientMarker from "../../Images/waitingToArrived/client.svg";
import servantMarker from "../../Images/waitingToArrived/servant.svg";
import { faExpand, faCompress } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

const api =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjMwNjc3OTIxYjg0MjgzOGI3NzViNTE4OTA5MDhiMDQ1YWNhZDcxNzYwODAxMWJlMTA0MTU0NjdhMGVkNzZjOTc4ZTJmZTFiYjhiYWIzOTI3In0.eyJhdWQiOiIxNTM5MCIsImp0aSI6IjMwNjc3OTIxYjg0MjgzOGI3NzViNTE4OTA5MDhiMDQ1YWNhZDcxNzYwODAxMWJlMTA0MTU0NjdhMGVkNzZjOTc4ZTJmZTFiYjhiYWIzOTI3IiwiaWF0IjoxNjMwOTIxMDYwLCJuYmYiOjE2MzA5MjEwNjAsImV4cCI6MTYzMzYwMzA2MCwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.IrPh0DNvg-ZNkC-k0N4P3Tz33aNaSHk8XEdBrWS0rZsnN6Dg-NPdQuYNsXWnuWqr9M-7mNsQMibZtr93QMzUQw94S1j8pwwuvJRHF1w8qXsAUpiT_pdmPxIVxSNh09GbLmoKPIUTlps2tVfrScOSdDbkJBjRV0IO1aB5zeexN0-a0MEsPJsmMOr5LP99K-xPSU1H-AlVpljLSiUotbc5v1SwRQSRzKh-z7F1hbQkskebDGICHzPHriFZylRGforkHvTHZ2qBSYoFdRnW2TcjpebmpX001wL36M9CrWNFOk8KpqT5_DfxzGsU7fxCjN50cUp6IgV4FKsxUaRTiiRkMA";

const MapTest = Mapir.setToken({
  transformRequest: (url) => {
    return {
      url: url,
      headers: {
        "x-api-key": api,
        "Mapir-SDK": "reactjs",
      },
    };
  },
});

const Map = ({
  servantLocation,
  clientLocation,
  onLocationChange,
  className = "",
  disabled,
  center,
  userLocation,
  canDelete,
}) => {
  const [markerArray, setMarkerArray] = useState([]);
  const [isDeleted, setIsDeleted] = useState();

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!userLocation) return;
    checkGPS();
  }, [userLocation]);

  useEffect(() => {
    if (clientLocation) {
      setIsDeleted(false);
    } else {
      setIsDeleted(true);
    }
  }, [clientLocation]);

  function reverseFunction(map, e) {
    let date = new Date().toISOString();
    setIsDeleted(false);
    if (disabled) return;
    var url = `https://map.ir/reverse/no?lat=${e.lngLat.lat}&lon=${e.lngLat.lng}`;
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": api,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let selectRegion = {
          state: data.province,
          city: data.city,
          region: data.neighbourhood.includes("محله ")
            ? data.neighbourhood.split("محله ")[1]
            : data.neighbourhood,
        };

        onLocationChange({
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng,
          name: data.postal_address,
          date: date,
          selectRegion: selectRegion,
        });
      });
    const array = [];
    array.push(
      <Mapir.Marker
        coordinates={[e.lngLat.lng, e.lngLat.lat]}
        anchor="bottom"
        Image={clientMarker}
      />
    );
    setMarkerArray(array);
  }

  const checkGPS = async () => {
    var timeout1 = setTimeout(function () {
      navigator.geolocation.clearWatch(watchID);
    }, 500);

    if (navigator.geolocation) {
      var watchID = await navigator.geolocation.watchPosition(
        (position) => {},
        (e) => {
          toast.info("موقعیت مکانی شما غیر فعال است.");
        },
        { timeout: 1000 }
      );
    }
    var timeout = setTimeout(function () {
      navigator.geolocation.clearWatch(watchID);
    }, 2000);
  };

  const fullscreenBtnClsName = userLocation
    ? "coupled-fullscreen-btn"
    : "single-fullscreen-btn";

  return (
    <div className={`${isFullscreen && "fullscreen"}`}>
      <div id="map-wrapper">
        {canDelete && !isDeleted && (
          <button
            onClick={() => {
              onLocationChange(null);
              setIsDeleted(true);
            }}
            className="map-coords-remove-btn"
          >
            حذف مختصات نقشه
          </button>
        )}
        {isFullscreen ? (
          <button
            onClick={() => setIsFullscreen(false)}
            className={fullscreenBtnClsName}
          >
            <FontAwesomeIcon icon={faCompress} />
          </button>
        ) : (
          <button
            onClick={() => setIsFullscreen(true)}
            className={fullscreenBtnClsName}
          >
            <FontAwesomeIcon icon={faExpand} />
          </button>
        )}
        <div id="map">
          <Mapir
            userLocation={userLocation}
            containerStyle={{ width: "100%", height: "100%" }}
            zoom={[14]}
            center={
              center && center[0] && center[1]
                ? [center[0], center[1]]
                : [51.40923422644019, 35.73531010373475]
            }
            Map={MapTest}
            onClick={reverseFunction}
            key={isFullscreen}
          >
            {/* tracking and start */}
            {servantLocation && (
              <Mapir.Marker
                coordinates={[
                  servantLocation.longitude,
                  servantLocation.latitude,
                ]}
                anchor="bottom"
                Image={servantMarker}
              />
            )}
            {!isDeleted && (
              <>
                {/* end */}
                {clientLocation && (
                  <Mapir.Marker
                    className="marker"
                    coordinates={[
                      clientLocation.longitude,
                      clientLocation.latitude,
                    ]}
                    anchor="bottom"
                    Image={clientMarker}
                  />
                )}
              </>
            )}
          </Mapir>
        </div>
      </div>
    </div>
  );
};

export default Map;
