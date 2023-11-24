import { useState } from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

export const AppPagination = ({ paginationData, handlePageChange }) => {
  const { pageSize, currentPage, totalCount, totalPages } = paginationData;
  const [pageNumber, setPageNumber] = useState(currentPage);

  const handleClick = (e) => {
    let buttonValue = e.target.value ?? 1;
    setPageNumber(buttonValue);
    handlePageChange(buttonValue);
  };

  return (
    <div style={{ marginLeft: "8px" }}>
      <Pagination>
        <PaginationItem disabled={pageNumber === 1}>
          <PaginationLink
            tag="button"
            value={1}
            first
            onClick={(e) => {
              handleClick(e);
            }}
          />
        </PaginationItem>
        <PaginationItem disabled={pageNumber === 1}>
          <PaginationLink
            tag="button"
            value={pageNumber > 1 ? pageNumber - 1 : 1}
            previous
            onClick={(e) => {
              handleClick(e);
            }}
          />
        </PaginationItem>
        {Array.from(Array(totalPages), (_, index) => index + 1).map((n) => (
          <PaginationItem key={n} disabled={n === currentPage}>
            <PaginationLink
              tag="button"
              value={n}
              onClick={(e) => {
                handleClick(e);
              }}
            >
              {n}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem disabled={pageNumber === totalPages}>
          <PaginationLink
            tag="button"
            value={pageNumber < totalPages ? pageNumber + 1 : totalPages}
            next
            onClick={(e) => {
              handleClick(e);
            }}
          />
        </PaginationItem>
        <PaginationItem disabled={pageNumber === totalPages}>
          <PaginationLink
            tag="button"
            value={totalPages}
            last
            onClick={(e) => {
              console.log(e.target.value);
              handleClick(e);
            }}
          />
        </PaginationItem>
      </Pagination>
      <p>
        Displaying {(currentPage - 1) * pageSize + 1}-
        {currentPage * pageSize > totalCount
          ? totalCount
          : currentPage * pageSize}{" "}
        of {totalCount} results
      </p>
    </div>
  );
};
