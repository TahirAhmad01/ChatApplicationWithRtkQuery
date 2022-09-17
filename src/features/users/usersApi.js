import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //conversation endpoints
    getUsers: builder.query({ query: (email) => `/users?email=${email}` }),
  }),
});

export const { useGetUsersQuery } = userApi;
