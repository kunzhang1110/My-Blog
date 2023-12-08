import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { Link } from "react-router-dom";

export const AppPagination = ({ paginationData, category }) => {
  const { pageSize, currentPage, totalCount, totalPages } = paginationData;

  const getToURL = (pageNumber) =>
    "/articles" +
    (category ? `/categories/${category}` : "") +
    `?pageNumber=${pageNumber}`;

  return (
    <div style={{ marginLeft: "8px" }}>
      <Pagination>
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink tag={Link} first to={getToURL(1)} />
        </PaginationItem>
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink
            tag={Link}
            previous
            to={getToURL(currentPage > 1 ? currentPage - 1 : 1)}
          />
        </PaginationItem>
        {Array.from(Array(totalPages), (_, index) => index + 1).map((n) => (
          <PaginationItem key={n} disabled={n === currentPage}>
            <PaginationLink tag={Link} to={getToURL(n)}>
              {n}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink
            tag={Link}
            to={getToURL(
              currentPage < totalPages ? currentPage + 1 : totalPages
            )}
            next
          />
        </PaginationItem>
        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink tag={Link} last to={getToURL(totalPages)} />
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
