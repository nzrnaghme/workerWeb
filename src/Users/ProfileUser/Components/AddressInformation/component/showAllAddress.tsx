import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { IAdressDetail } from "../Entites";
import { toPersianNumber } from "../../../../../Components/hooks/persianHelper";
import "./index.scss";

type Props = {
  item: IAdressDetail;
  countitems: number;
};

function ShowAllAddress({ item, countitems }: Props) {
  const [checkedPicture, setCheckedPicture] = useState<boolean>(
    countitems === 1 ? true : false
  );
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedPicture(event.target.checked);
  };
  return (
    <>
      <div className="default">
        <Checkbox
          checked={checkedPicture}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
        />
      </div>
      <span className="addressText">{toPersianNumber(item.textAdress)}</span>
      <span className="codeAddress">{toPersianNumber(item.codeAddress)}</span>
      <span className="edit">ویرایش</span>
      <span className="delete">حذف</span>
    </>
  );
}
export default ShowAllAddress;
