import React, { useContext } from "react";
import { AppContext } from "./index";
import { Container } from "reactstrap";
import { Route, Routes } from "react-router";
import { ArticleSinglePage } from "./pages/ArticleSinglePage";
import { ArticleEditPage } from "./pages/ArticleEditPage";
import { ArticlesListPage } from "./pages/ArticlesListPage";
import { AboutPage } from "./pages/AboutPage";
import { RegisterPage } from "./pages/RegisterPage";
import { NavMenu } from "./components/NavMenu";
import { Authorization } from "./Auth";

export default function App() {
  return (
    <>
      <NavMenu />
      <Container fluid>
        <Routes>
          <Route path="/" element={<ArticlesListPage />} />
          <Route path="/articles" element={<ArticlesListPage />} />
          <Route
            path="/articles/categories/:category"
            element={<ArticlesListPage />}
          />
          <Route path="/articles/:id" element={<ArticleSinglePage />} />
          <Route
            path="/create"
            element={
              <Authorization>
                <ArticleEditPage />
              </Authorization>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <Authorization>
                <ArticleEditPage />
              </Authorization>
            }
          />
          <Route path="/Register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Container>
    </>
  );
}
