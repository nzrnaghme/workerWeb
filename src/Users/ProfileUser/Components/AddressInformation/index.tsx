import { useEffect, useState } from "react";
import Popup from "../../../../Components/Popup";
import OurButton from "../../../../Components/Button";
import InsertAddress from "./component/insertAddress";
import { ILocation, IRegion } from "../../../../Components/Maps/Entities";
import "./index.scss";
import { address, IAdressDetail, IAdressInsertDetail } from "./Entites";
import ShowAllAddress from "./component/showAllAddress";
import { Divider, useMediaQuery } from "@material-ui/core";
import { showLocalStorage } from "../../../../Routers/localStorage";
import * as services from "../../IService";
import { toast } from "react-toastify";

type Props = {
  open: boolean;
  onClose: () => void;
};

function AddressInformation({ open, onClose }: Props) {
  const storageUser = showLocalStorage("user");
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const [addressesComponent, setAddressesComponent] =
    useState<IAdressDetail[]>(address);
  const [addAddress, setAddAddress] = useState(false);

  useEffect(() => {
    addressesComponent.forEach((element) => {
      if (Object.keys(element).length === 0) {
        let newaddress = addressesComponent.filter((data) => data === element);
        setAddressesComponent(newaddress);
      }
    });
  }, [open]);

  const InsertNewAddress = async (
    titleAddress: string,
    addressText: string,
    tempRegion: string[] | null,
    codeAdress: string | null,
    location: ILocation | null,
    area: IRegion | null,
    currentAddress: boolean
  ) => {
    if (location) delete location.selectRegion;

    const newAddress: IAdressInsertDetail = {
      userId: storageUser!.Id,
      title: titleAddress,
      region: tempRegion,
      location: location,
      address: addressText,
      postalCode: codeAdress ? codeAdress : null,
      isDefault: currentAddress,
    };
    const res = await services.postInsertUserAddress(newAddress);
    debugger;
    if (res.Data) {
      toast.success("آدرس اضافه شد.");
      setAddAddress(false);
    }
    console.log(area);

    console.log(newAddress);

    // setAddressesComponent((Prev) => Prev.concat(newAddress));
    //
  };

  return (
    <Popup {...{ open, onClose }} className="anotherAddress-set">
      {addAddress && (
        <Popup
          open={addAddress}
          onClose={() => {
            if (addAddress) setAddAddress(false);
            else setAddAddress(true);
          }}
          className="anotherAddress-set"
        >
          <InsertAddress InsertNewAddress={InsertNewAddress} />
        </Popup>
      )}

      {addressesComponent.length === 0 && (
        <div className="non-address">آدرسی ثبت نشده</div>
      )}
      {addressesComponent != null && (
        <div className="show-all-address">
          <div className="header-show-address">
            <span className="default">پیش فرض</span>{" "}
            <span className="addressText">آدرس</span>{" "}
            <span className="codeAddress">کد پستی</span>
          </div>
          <Divider className="div-bet-header-show-address" />
          {addressesComponent.map((c) => (
            <div className="container-show-address">
              <ShowAllAddress item={c} countitems={addressesComponent.length} />
            </div>
          ))}
        </div>
      )}

      <OurButton
        label="افزودن آدرس"
        size={matchesSm ? "sm" : "lg"}
        onClick={() => {
          setAddAddress(true);
        }}
      />
    </Popup>
  );
}
export default AddressInformation;
