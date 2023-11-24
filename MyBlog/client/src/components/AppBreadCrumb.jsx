import React from "react";
import { useMatches } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";

export const AppBreadCrumb = () => {
  let matches = useMatches();

  let filteredMatches = matches.filter((match) => Boolean(match.handle?.crumb));

  let crumbs = filteredMatches.map((match, index) => {
    return match.handle.crumb(match.data, index === filteredMatches.length - 1);
  });

  return (
    <div className="page-breadbrumb">
      <Breadcrumb>
        {crumbs.map((crumb, index) => {
          return <BreadcrumbItem key={index}>{crumb}</BreadcrumbItem>;
        })}
      </Breadcrumb>
    </div>
  );
};
