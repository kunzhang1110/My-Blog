import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { ArticleSinglePage } from "../pages/ArticleSinglePage";
import { ArticleEditPage } from "../pages/ArticleEditPage";
import { ArticlesListPage } from "../pages/ArticlesListPage";
import { AboutPage } from "../pages/AboutPage";
import { RegisterPage } from "../pages/RegisterPage";
import { Authorization } from "../app/auth.jsx";
import ErrorPage from "../pages/ErrorPage";
import { api } from "./api.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    handle: {
      crumb: (_, isLast) => <>{isLast ? "Home" : <a href="/">Home</a>}</>,
    },

    children: [
      {
        //authenticated routes
        element: <Authorization />,
        children: [
          {
            path: "create",
            element: <ArticleEditPage />,
            handle: {
              crumb: () => "New Article",
            },
          },
          {
            path: "/edit/:id",
            element: <ArticleEditPage />,
            handle: {
              crumb: () => "Edit",
            },
          },
        ],
      },
      {
        path: "/",
        element: <ArticlesListPage />,
      },
      {
        path: "/articles/categories/:category",
        element: <ArticlesListPage />,
        loader: async ({ params }) => {
          return params.category;
        },
        handle: {
          crumb: (loaderData, isLast) => (
            <>{isLast ? loaderData : <a href="/">loaderData</a>}</>
          ),
        },
      },
      {
        path: "/articles/:id",
        element: <ArticleSinglePage />,
        loader: async ({ params }) => {
          return await api.articles.getArticle(params.id); //id in path
        },
        handle: {
          crumb: (loaderData) => loaderData.title, //loaderData returned from loader
        },
      },

      {
        path: "/register",
        element: <RegisterPage />,
        handle: {
          crumb: () => "Register",
        },
      },
      {
        path: "/about",
        element: <AboutPage />,
        handle: {
          crumb: () => "About",
        },
      },
      {
        path: "*",
        element: <ErrorPage message="Page not found" />,
        handle: {
          crumb: () => "Error",
        },
      }, //other routes
    ],
  },
]);
