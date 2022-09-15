import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: async (headers, { getState, endpoint }) => {
      const authToken = getState()?.auth?.accessToken;

      if (authToken) {
        headers.set("authorization", `Bearer ${authToken}`);
      }

      return headers;
    },
  }),
  tagType: [],
  endpoints: (builder) => ({}),
});
