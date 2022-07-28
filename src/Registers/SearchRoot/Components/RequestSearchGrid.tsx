import RequestSearchPaper from "./RequestSearchPaper";
import "./index.scss";
import { IRequestInSearch } from "../Entites";

type Props = {
  items: IRequestInSearch[] | [];
  callBackAddRequest: (requestRegistrationId: string, userId: string) => void;
};

function ReqsGrid({ items, callBackAddRequest }: Props) {
  return (
    <div className="reqs-filterless-grid-container">
      {items.map((i) => (
        <RequestSearchPaper
          item={i}
          callBackAddRequest={() => {
            callBackAddRequest(i.requestRegistrationId, i.userId);
          }}
        />
      ))}
    </div>
  );
}

export default ReqsGrid;
