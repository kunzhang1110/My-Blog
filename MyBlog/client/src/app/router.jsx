import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import { ArticleSinglePage } from "../pages/ArticleSinglePage.jsx";
import { ArticleEditPage } from "../pages/ArticleEditPage.jsx";
import { ArticlesListPage } from "../pages/ArticlesListPage.jsx";
import { AboutPage } from "../pages/AboutPage.jsx";
import { ProfilePage } from "../pages/ProfilePage.jsx";
import { RegisterPage } from "../pages/RegisterPage.jsx";
import { Authorization, AuthorizationAdmin } from "./Authorization.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";
import { useAppContext } from "./appContext.jsx";

export const Router = () => {
  const { api } = useAppContext();

  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      handle: {
        crumb: (_, isLast) => <>{isLast ? "Home" : <a href="/">Home</a>}</>,
      },

      children: [
        {
          //authenticated admin routes
          element: <AuthorizationAdmin />,
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
          //authenticated all users routes
          element: <Authorization />,
          children: [
            {
              path: "/user/profile",
              element: <ProfilePage />,
              handle: {
                crumb: () => "Profile",
              },
            },
          ],
        },
        {
          path: "/",
          element: <ArticlesListPage />,
        },
        {
          path: "/articles",
          element: <ArticlesListPage />,
        },
        {
          path: "/articles/categories/:category",
          element: <ArticlesListPage />,
          loader: ({ params }) => {
            return params.category;
          },
          handle: {
            crumb: (loaderData, isLast) => (
              <>{isLast ? loaderData : <a href="/">loaderData</a>}</>
            ),
          },
        },
        {
          path: "/articles/:articleUrlId",
          element: <ArticleSinglePage />,
          loader: async ({ params }) => {
            return await api.articles.getArticle(params.articleUrlId); //id in path
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

  return <RouterProvider router={browserRouter} />;
};
