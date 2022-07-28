import React from "react";
import { MyComments } from "./Entities";
import MyCommentsList from "./MyCommentsList";
import SimpleBar from "simplebar-react";
import "./index.scss";

type Props = {
  items?: MyComments[];
  isClient?: boolean;
};

function ShowComments({ items, isClient }: Props) {
  return (
    <SimpleBar autoHide={false} className="comments-section">
      <MyCommentsList items={items} isClient={isClient} />
    </SimpleBar>
  );
}
export default ShowComments;
