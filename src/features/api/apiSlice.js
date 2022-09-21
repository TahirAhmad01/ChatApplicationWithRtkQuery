import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedOut } from "../auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
  prepareHeaders: async (headers, { getState, endpoint }) => {
    const authToken = getState()?.auth?.accessToken;

    if (authToken) {
      headers.set("authorization", `Bearer ${authToken}`);
    }
    headers.set("content-Type", "application/json");

    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
      api.dispatch(userLoggedOut());
      localStorage.removeItem("auth");
    }

    return result;
  },
  tagType: [],
  endpoints: (builder) => ({}),
});
