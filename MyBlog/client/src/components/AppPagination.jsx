import { Button, Pagination, PaginationItem, PaginationLink } from "reactstrap";

export const AppPagination = ({ paginationData, updateArticlesList }) => {
  const { pageSize, currentPage, totalCount, totalPages } = paginationData;

  const handleOnClick = (pageNumber) => {
    updateArticlesList(pageNumber);
  };

  return (
    <div style={{ marginLeft: "8px" }}>
      <Pagination>
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink tag={Button} first onClick={() => handleOnClick(1)} />
        </PaginationItem>
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink
            tag={Button}
            previous
            onClick={() => handleOnClick(currentPage > 1 ? currentPage - 1 : 1)}
          />
        </PaginationItem>
        {Array.from(Array(totalPages), (_, index) => index + 1).map((n) => (
          <PaginationItem key={n} disabled={n === currentPage}>
            <PaginationLink tag={Button} onClick={() => handleOnClick(n)}>
              {n}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink
            tag={Button}
            next
            onClick={() =>
              handleOnClick(
                currentPage < totalPages ? currentPage + 1 : totalPages
              )
            }
          />
        </PaginationItem>
        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink
            tag={Button}
            last
            onClick={() => handleOnClick(totalPages)}
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
