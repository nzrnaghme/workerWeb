import InfiniteScroll from "react-infinite-scroll-component";
import EmptyData from "./EmptyData";

type Props = {
  items: any[];
  fetchMoreData: () => void;
  children: any;
};

function YootaabDataGrid({ items, fetchMoreData, children }: Props) {
  return (
    <>
      {items && items.length > 0 && (
        <InfiniteScroll
          dataLength={items.length}
          next={fetchMoreData}
          hasMore={true}
          loader={<div className="load-more-reqs-btn"></div>}
        >
          {children}
        </InfiniteScroll>
      )}
    </>
  );
}

export default YootaabDataGrid;
