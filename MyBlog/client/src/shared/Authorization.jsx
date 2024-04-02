import React from "react";
import ErrorPage from "../pages/ErrorPage";
import { Outlet } from "react-router-dom";
import { useAppContext } from "./appContext";

export const AuthorizationAdmin = () => {
  const { user } = useAppContext();

  return user.isAdmin ? (
    <Outlet />
  ) : (
    <ErrorPage message="Unauthorized. Please Login as admin." />
  );
};

export const Authorization = () => {
  const { user } = useAppContext();

  return user?.userName !== "" ? (
    <Outlet />
  ) : (
    <ErrorPage message="Unauthorized. Please Login." />
  );
};
