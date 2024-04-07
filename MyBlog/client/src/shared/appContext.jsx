import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const DEFAULT_USER = {
  userName: "",
  permissions: [],
  token: "",
  isAdmin: false,
};

export const appContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const jwtHeader = user?.token
    ? {
        Authorization: `Bearer ${user.token}`,
      }
    : {};

  const validateToken = useCallback((_user, validHandler = null) => {
    if (_user && new Date(_user.expiration) - new Date() > 0) {
      if (validHandler) validHandler(_user);
      setIsLoading(false);
      return true;
    } else {
      setUser(DEFAULT_USER);
      localStorage.removeItem("storedUser");
      setIsLoading(false);
      return false;
    }
  }, []);

  const fetchWrapper = (...params) => {
    validateToken(user);
    return fetch(...params);
  };

  const account = {
    login: (userName, password, isRemembered) =>
      fetch(`/api/account/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          password,
        }),
        cache: "default",
      })
        .then((resp) => {
          if (resp.status === 200) {
            return resp.json();
          } else {
            let errorMessage = " Please try again.";
            if (resp.status === 400) {
              errorMessage = "Bad Request." + errorMessage;
            }
            if (resp.status === 401) {
              errorMessage =
                "Username and password do not match." + errorMessage;
            }
            setMessage(errorMessage);
            throw new Error(errorMessage);
          }
        })
        .then((data) => {
          if (data) {
            data["isAdmin"] = data.roles.includes("Admin");
            if (isRemembered) {
              //if "Rembmer Me" radio box is ticked
              localStorage.setItem("storedUser", JSON.stringify(data));
            }
            return data;
          }
        }),

    register: (user) =>
      fetchWrapper(`/api/account/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        cache: "default",
      }).then((resp) => resp.json()),

    logout: () => {
      setUser(DEFAULT_USER);
      localStorage.removeItem("storedUser");
    },
  };

  const articles = {
    getArticle: (id) => {
      return fetch(`/api/articles/${id}`).then((res) => res.json());
    },

    getArticles: (pageNumber = 1, orderBy = "dateAsc", categoryName) => {
      let params = {
        orderBy,
        pageNumber,
      };
      if (categoryName) params.categoryName = categoryName;

      return fetch(`/api/articles?` + new URLSearchParams(params), {
        headers: { ...jwtHeader },
      });
    },

    createArticle: (formData) =>
      fetchWrapper(`/api/articles`, {
        method: "POST",
        body: formData,
        cache: "default",
        headers: { ...jwtHeader },
      }),

    updateArticle: (formData, id) =>
      fetchWrapper(` /api/articles/${id}`, {
        method: "PUT",
        body: formData,
        headers: { ...jwtHeader },
        cache: "default",
      }),

    deleteArticle: (id) =>
      fetchWrapper(`/api/articles/${id}`, {
        method: "DELETE",
        headers: { ...jwtHeader },
      }),

    getCategories: () =>
      fetch(`/api/articles/categories`, {
        method: "GET",
      }).then((res) => res.json()),

    toggleLike: (articleId) =>
      fetchWrapper(`/api/articles/toggleLike/${articleId}`, {
        method: "POST",
        headers: { ...jwtHeader },
      }),

    GetArticlesByUserCommentedOrLiked: async (
      userId,
      pageNumber = 1,
      orderBy = "dateAsc"
    ) => {
      let params = {
        orderBy,
        pageNumber,
      };

      return fetchWrapper(
        `/api/articles/GetArticlesByUserCommentedOrLiked/${userId}?` +
          new URLSearchParams(params)
      );
    },
  };

  const comments = {
    getComment: (id) =>
      fetchWrapper(`/api/comments/${id}`).then((res) => res.json()),

    getCommentsByArticleId: (
      articleId,
      pageNumber = 1,
      orderBy = "dateDesc"
    ) => {
      let params = {
        orderBy,
        pageNumber,
      };
      return fetchWrapper(
        `/api/comments/getCommentsByArticleId/${articleId}?` +
          new URLSearchParams(params)
      );
    },

    getCommentsByUserId: (userId) =>
      fetchWrapper(`/api/comments/getCommentsByUserId/${userId}`).then((res) =>
        res.json()
      ),

    createComment: (comment) =>
      fetchWrapper(`/api/comments`, {
        method: "POST",
        body: JSON.stringify(comment),
        headers: { ...jwtHeader, "Content-Type": "application/json" },
        cache: "default",
      }),

    updateComment: (comment) =>
      fetchWrapper(`/api/comments`, {
        method: "PUT",
        body: JSON.stringify(comment),
        headers: { ...jwtHeader, "Content-Type": "application/json" },
        cache: "default",
      }),

    deleteComment: (id) =>
      fetchWrapper(`/api/comments/${id}`, {
        method: "DELETE",
        headers: { ...jwtHeader },
      }),
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("storedUser"));

    validateToken(storedUser, (_user) => {
      setUser(_user);
    });
  }, [validateToken]);

  if (isLoading) return <></>;

  return (
    <appContext.Provider
      value={{
        api: {
          account,
          articles,
          comments,
        },
        user,
        setUser,
        message,
        setMessage,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(appContext);
};
