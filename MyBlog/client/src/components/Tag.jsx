import React, { useState } from "react";
import { Button } from "reactstrap";

export function Tag({ tag, edit, deleteFunc, className }) {
  const [hover, setHover] = useState(false);
  return (
    <div className={"d-inline-block " + className}>
      {edit ? (
        <Button
          key={tag.name}
          tag="span"
          outline
          className="position-relative"
          size="sm"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {tag.name}
          <span
            className="delete-cross-btn"
            style={{
              transform: "scale(0.8)",
              display: hover ? "inline" : "none",
            }}
            href="#"
            onClick={(e) => deleteFunc(e, tag.name)}
          >
            &#215;
          </span>
        </Button>
      ) : (
        <Button
          href={`articles/categories/${tag.name}`}
          key={tag.name}
          tag="a"
          outline
          size="sm"
        >
          {tag.name}
        </Button>
      )}
    </div>
  );
}
