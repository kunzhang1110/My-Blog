const account = {
  login: (userName, password) =>
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
    }),
  register: (user) =>
    fetch(`/api/account/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      cache: "default",
    }).then((resp) => resp.json()),
};

const articles = {
  getArticle: (id) => fetch(`/api/articles/${id}`).then((res) => res.json()),

  getArticles: async (categoryName, pageNumber = 1, orderBy = "dateDesc") => {
    let params = {
      orderBy,
      pageNumber,
    };
    if (categoryName) params.categoryName = categoryName;

    const response = await fetch(
      `/api/articles?` + new URLSearchParams(params)
    );
    return response;
  },

  createArticle: (formData, headers) =>
    fetch(`/api/articles`, {
      method: "POST",
      body: formData,
      headers,
      cache: "default",
    }),

  updateArticle: (formData, id, headers) =>
    fetch(` /api/articles/${id}`, {
      method: "PUT",
      body: formData,
      headers,
      cache: "default",
    }),

  deleteArticle: (id, headers) =>
    fetch(`/api/articles/${id}`, {
      method: "DELETE",
      headers,
    }),

  getCategories: (n = 3) =>
    fetch(`/api/articles/categories/${n}`, {
      method: "GET",
    }).then((res) => res.json()),
};

const comments = {
  getComment: (id) => fetch(`/api/comments/${id}`).then((res) => res.json()),

  getCommentsByArticleId: (articleId, pageNumber = 1, orderBy = "dateDesc") => {
    let params = {
      orderBy,
      pageNumber,
    };
    return fetch(
      `/api/comments/getCommentsByArticleId/${articleId}?` +
        new URLSearchParams(params)
    );
  },

  getCommentsByUserId: (userId) =>
    fetch(`/api/comments/getCommentsByUserId/${userId}`).then((res) =>
      res.json()
    ),

  createComment: (comment, headers) =>
    fetch(`/api/comments`, {
      method: "POST",
      body: JSON.stringify(comment),
      headers: { ...headers, "Content-Type": "application/json" },
      cache: "default",
    }),

  updateComment: (comment, headers) =>
    fetch(`/api/comments`, {
      method: "PUT",
      body: JSON.stringify(comment),
      headers: { ...headers, "Content-Type": "application/json" },
      cache: "default",
    }),

  deleteComment: (id, headers) =>
    fetch(`/api/comments/${id}`, {
      method: "DELETE",
      headers,
    }),
};

export const api = {
  account,
  articles,
  comments,
};
