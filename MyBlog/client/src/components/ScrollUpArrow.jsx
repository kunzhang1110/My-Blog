import React from "react";
import { Button } from "reactstrap";

export const ScrollUpArrow = () => {
  return (
    <Button
      className="scroll-up-arrow"
      onClick={() => window.scrollTo(0, 0)}
      outline
      size="sm"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="currentColor"
      >
        <path d="M13.204 3.107a1.75 1.75 0 0 0-2.408 0L3.806 9.73c-1.148 1.088-.378 3.02 1.204 3.02h2.24V20c0 .966.784 1.75 1.75 1.75h6A1.75 1.75 0 0 0 16.75 20v-7.25h2.24c1.582 0 2.353-1.932 1.204-3.02l-6.99-6.623Z"></path>
      </svg>
    </Button>
  );
};
