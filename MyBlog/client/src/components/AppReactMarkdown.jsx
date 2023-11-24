import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import { Table } from "reactstrap";

export const AppReactMarkdown = ({ children, imgFunc, className }) =>
  useMemo(
    () => (
      <ReactMarkdown
        children={children}
        className={className}
        remarkPlugins={[gfm, [remarkMath, { singleDollarTextMath: false }]]}
        remarkRehypeOptions={{ allowDangerousHtml: true }}
        rehypePlugins={[rehypeHighlight, rehypeKatex, rehypeRaw]}
        components={{
          h2: ({ node, ...props }) => (
            <>
              <h2 className="mt-4" {...props}>
                {node.children[0].value}
              </h2>
              <hr />
            </>
          ),
          h3: ({ node, ...props }) => (
            <h3 className="mt-3" {...props}>
              {node.children[0].value}
            </h3>
          ),
          h4: ({ node, ...props }) => (
            <h4 className="mt-3" {...props}>
              {node.children[0].value}
            </h4>
          ),
          table: ({ node, ...props }) => (
            <Table bordered hover className="m-2" {...props}></Table>
          ),
          ul: ({ node, ordered, ...props }) => (
            <ul className="ms-2 mt-1" {...props}></ul>
          ),
          ol: ({ node, ordered, ...props }) => (
            <ol className="ms-2 mt-1" {...props}></ol>
          ),
          p: ({ node, ...props }) => <p className="mt-1 mb-0" {...props}></p>,
          img: imgFunc,
        }}
      />
    ),
    [children, className, imgFunc]
  );
