import gravatarUrl from "gravatar-url";
import moment from "moment";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetConversationsQuery } from "../../features/conversation/conversationsApi";
import getPartnerInfo from "./../../utils/getPartnerInfo";
import Error from "./../ui/Error";
import ChatItem from "./ChatItem";

export default function ChatItems() {
  const { user } = useSelector((state) => state.auth) || {};
  const { email } = user || {};
  const {
    data: conversations,
    isLoading,
    isError,
    error,
  } = useGetConversationsQuery(email);

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
    content = conversations.map((conversation) => {
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
    });
  }

  return <ul>{content}</ul>;
}
