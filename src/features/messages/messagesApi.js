import { io } from "socket.io-client";
import { apiSlice } from "../api/apiSlice";

export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //conversation endpoints
    getMessages: builder.query({
      query: (id) =>
        `/messages?conversationId=${id}&_short=timestamp&_order=desc&_page=1&_limit=${process.env.REACT_APP_MESSAGES_PER_PAGE}`,
      async onCacheEntryAdded(
        args,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const socket = io(`${process.env.REACT_APP_API_URL}`, {
          reconnectionDelay: 1000,
          reconnection: true,
          reconnectionAttempts: 10,
          transports: ["websocket"],
          agent: false,
          upgrade: false,
          rejectUnauthorized: false,
        });

        try {
          await cacheDataLoaded;
          socket.on("message", (data) => {
            updateCachedData((draft) => {
              draft.push(data.data);
            });

            console.log(data);
          });
        } catch (error) {
          console.log(error);
        }

        await cacheEntryRemoved;
        socket.close();
      },
    }),

    addMessage: builder.mutation({
      query: (data) => ({
        url: "/messages",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetMessagesQuery, useAddMessageMutation } = messagesApi;
