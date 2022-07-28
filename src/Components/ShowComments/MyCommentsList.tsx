import { MyComments } from "./Entities";
import MyCommentPaper from "./MyCommentPaper";

type props = {
  styles?: object;
  items: MyComments[] | undefined;
  isClient?: boolean;
};

function MyCommentsList({ items, isClient }: props) {
  return (
    <div>
      {items != null &&
        items.map((c) => <MyCommentPaper item={c} isClient={isClient} />)}
    </div>
  );
}
export default MyCommentsList;
