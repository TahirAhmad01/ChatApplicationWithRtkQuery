import { useSelector } from "react-redux";
import { useGetConversationQuery } from "../../features/conversation/conversationsApi";
import Error from "./../ui/Error";
import ChatItem from "./ChatItem";

export default function ChatItems() {
  const { user } = useSelector((state) => state.auth);
  const { email } = user || {};
  const {
    data: conversations,
    isLoading,
    isError,
    error,
  } = useGetConversationQuery(email);

  let content;

  if (isLoading) {
    content = (
      <li>
        <div className="m-2 text-center bg-green-300 text-green-600 py-3 rounded-md">
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
        <div>error</div>
      </li>
    );
  } else if (!isLoading && !error && conversations?.length > 0) {
    // eslint-disable-next-line array-callback-return
    content = conversations.map((conversation) => {
      const { message } = conversations;
      <>
        <li>
          <ChatItem
            avatar="https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010__340.jpg"
            name="Saad Hasan"
            lastMessage={message}
            lastTime="25 minutes"
          />
        </li>
      </>;
    });
  }

  return <ul>{content}</ul>;
}
