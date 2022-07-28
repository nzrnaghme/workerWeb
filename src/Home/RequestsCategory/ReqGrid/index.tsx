import RequestPaper from "../../../Components/DailyRequestPaper";
import "./index.scss";
import { IPresentableRequest } from "../../../Registers/DailyRequestContainList/Entities";

type Props = {
  items: IPresentableRequest[] | [];
  callBackAddRequest: (id: string, userId: string) => void;
};

function ReqsGrid({ items, callBackAddRequest }: Props) {
  return (
    <div className="reqs-filterless-grid-container">
      {items != null &&
        items.length > 0 &&
        items.map((i) => (
          <RequestPaper
            key={i.id}
            item={i}
            callBackAddRequest={() => {
              callBackAddRequest(i.id, i.userId);
            }}
          />
        ))}
    </div>
  );
}

export default ReqsGrid;
