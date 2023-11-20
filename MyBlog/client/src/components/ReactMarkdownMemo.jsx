import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import { Table } from "reactstrap";

export const ReactMarkdownMemo = ({ children, imgFunc, className, deps }) =>
  useMemo(
    () => (
      <ReactMarkdown
        children={children}
        className={className}
        remarkPlugins={[gfm, [remarkMath, { singleDollarTextMath: false }]]}
        remarkRehypeOptions={{ allowDangerousHtml: true }}
        rehypePlugins={[rehypeHighlight, rehypeKatex, rehypeRaw]}
        components={{
          h1: ({ node, ...props }) => (
            <>
              <h1 className="mt-4" {...props}></h1>
              <hr />
            </>
          ),
          h2: ({ node, ...props }) => <h2 className="mt-3" {...props}></h2>,
          h3: ({ node, ...props }) => <h3 className="mt-3" {...props}></h3>,
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
    deps
  );
