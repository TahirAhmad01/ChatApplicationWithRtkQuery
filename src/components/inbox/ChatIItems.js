import gravatarUrl from "gravatar-url";
import moment from "moment";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetConversationsQuery } from "../../features/conversation/conversationsApi";
import { conversationsApi } from "./../../features/conversation/conversationsApi";
import getPartnerInfo from "./../../utils/getPartnerInfo";
import Error from "./../ui/Error";
import ChatItem from "./ChatItem";

export default function ChatItems() {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useSelector((state) => state.auth) || {};
  const { email } = user || {};
  const { data, isLoading, isError, error } =
    useGetConversationsQuery(email) || {};
  const dispatch = useDispatch();

  const { data: conversations, pageCount } = data || {};

  const fetchMore = () => {
    setPage((prevState) => prevState + 1);
  };

  useEffect(() => {
    if (page > 1) {
      dispatch(
        conversationsApi.endpoints.getMoreConversations.initiate({
          email,
          page,
        })
      );
    }
  }, [dispatch, email, page]);

  useEffect(() => {
    if (pageCount > 0) {
      const more = Math.ceil(
        pageCount / Number(process.env.REACT_APP_CONVERSATIONS_PER_PAGE) > page
      );

      setHasMore(more);
    }
  }, [pageCount, page]);

  let content;

  if (isLoading) {
    content = (
      <li className="m-2 text-center">
        <div className="bg-green-200 text-green-600 rounded-md py-3">
          Loading
        </div>
      </li>
    );
  } else if (!isLoading && isError) {
    content = (
      <li className="m-2 text-center">
        <Error message={error?.data} />
      </li>
    );
  } else if (!isLoading && !error && conversations?.length === 0) {
    content = (
      <li className="m-2 text-center">
        <Error message={"No conversation found"} />
      </li>
    );
  } else if (!isLoading && !error && conversations?.length > 0) {
    content = (
      <InfiniteScroll
        dataLength={conversations.length} //This is important field to render the next data
        next={fetchMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        height={window.innerHeight - 129}
      >
        {conversations
          .slice()
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((conversation) => {
            const { id, message, timestamp } = conversation;
            const { email } = user || {};
            const { name, email: partnerEmail } = getPartnerInfo(
              conversation?.users,
              email
            );

            return (
              <li key={id}>
                <Link to={`/inbox/${id}`}>
                  <ChatItem
                    avatar={gravatarUrl(partnerEmail, {
                      size: 80,
                    })}
                    name={name}
                    lastMessage={message}
                    lastTime={moment(timestamp).fromNow()}
                  />
                </Link>
              </li>
            );
          })}
      </InfiniteScroll>
    );
  }

  return <ul>{content}</ul>;
}
