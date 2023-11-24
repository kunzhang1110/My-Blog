const account = {
  login: (username, password) =>
    fetch(`/api/account/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
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

  getArticles: async (categoryName, pageNumber = 1, orderBy = "dateAsc") => {
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
};

export const api = {
  account,
  articles,
};
