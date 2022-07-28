import { useState, useEffect } from "react";
import "./index.scss";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { IRegisterSave } from "../../MyRequestList/Entities";
import { TextField } from "@material-ui/core";
import Paper from "../../../Components/Paper";
import MapContainer from "../../../Components/Maps/MapContainer";
import { ILocation } from "../../../Components/Maps/Entities";
import { toPersianNumber } from "../../../Components/hooks/persianHelper";

type props = {
  item: IRegisterSave;
};

function LocationDetail({ item }: props) {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const [map, setMap] = useState<ILocation | null>();

  useEffect(() => {
    LocationMap();
  }, [item]);

  const LocationMap = () => {
    if (item.location && item.location != null) {
      const Location: ILocation = {
        latitude: item.location.latitude,
        longitude: item.location.longitude,
        name: item.location.name,
        date: item.location.date,
      };
      setMap(Location);
      return;
    }
    setMap(null);
  };

  return (
    <Paper className="req-details-paper">
      <div className="details-location-grid-container">
        <div className="details-location-grid-item1">
          <TextField
            fullWidth
            label="استان"
            disabled
            variant="standard"
            size="small"
            value={toPersianNumber(item?.stateName ?? "")}
            className="disable-textfield"
          />
        </div>
        <div className="details-location-grid-item2">
          <TextField
            fullWidth
            label="شهر"
            disabled
            variant="standard"
            size="small"
            value={toPersianNumber(item?.cityName ?? "")}
            className="disable-textfield"
          />
        </div>
        <div className="details-location-grid-item3">
          <TextField
            fullWidth
            label="محله"
            disabled
            variant="standard"
            size="small"
            value={toPersianNumber(item?.regionName ?? "")}
            className="disable-textfield"
          />
        </div>
      </div>
      <div className="req-details-map-wrapper">
        {map ? (
          <MapContainer
            canDelete={false}
            userLocation={false}
            disabled
            center={[map?.longitude, map?.latitude]}
            clientLocation={map}
            servantLocation={null}
            onLocationChange={(c: ILocation) => {}}
          />
        ) : (
          <p>موقعیت مکانی تعیین نشده است</p>
        )}
      </div>
    </Paper>
  );
}
export default LocationDetail;
