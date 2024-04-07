import React from "react";
import { useMatches } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";

export const AppBreadCrumb = () => {
  const matches = useMatches(); //mathces portions of the paths

  const filteredMatches = matches.filter((match) =>
    Boolean(match.handle?.crumb)
  );

  const crumbs = filteredMatches.map((match, index) => {
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
