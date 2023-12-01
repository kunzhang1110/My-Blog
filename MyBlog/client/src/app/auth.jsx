import React, { createContext, useContext, useState, useEffect } from "react";
import ErrorPage from "../pages/ErrorPage";
import { Outlet } from "react-router-dom";
import { api } from "./api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    userName: "",
    permissions: [],
    token: "",
    isAdmin: false,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("storedUser"));
    if (storedUser) {
      if (new Date(storedUser.expiration) - new Date() > 0) {
        //if stored token has not expired
        setUser(storedUser);
      } else {
        localStorage.removeItem("storedUser");
      }
    }
  }, []);

  const login = (
    userName,
    password,
    isRemembered,
    setIsLoading,
    toggleLoginModal
  ) => {
    api.account
      .login(userName, password)
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json();
        } else {
          let errorMessage = " Please try again.";
          if (resp.status === 400) {
            errorMessage = "Bad Request." + errorMessage;
          }
          if (resp.status === 401) {
            errorMessage = "Username and password do not match." + errorMessage;
          }
          setMessage(errorMessage);
          setIsLoading(false);
          throw new Error(errorMessage);
        }
      })
      .then((data) => {
        if (data) {
          data["isAdmin"] = data.roles.includes("Admin");
          data["authorizationHeader"] = {
            Authorization: `Bearer ${data.token}`,
          };
          setUser(data);
          if (isRemembered) {
            //if "Rembmer Me" radio box is ticked
            localStorage.setItem("storedUser", JSON.stringify(data));
          }
        }
      })
      .then(() => {
        setIsLoading(false);
        toggleLoginModal();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const logout = () => {
    setUser({ userName: "", permissions: [] });
    localStorage.removeItem("storedUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, message, setMessage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const Authorization = () => {
  const { user } = useAuth();
  return user.isAdmin ? (
    <Outlet />
  ) : (
    <ErrorPage message="Unauthorized. Please Login as admin." />
  );
};
