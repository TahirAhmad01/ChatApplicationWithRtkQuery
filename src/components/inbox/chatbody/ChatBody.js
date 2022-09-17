// import Blank from "./Blank";
import { useParams } from "react-router-dom";
import { useGetMessagesQuery } from "../../../features/messages/messagesApi";
import Error from "./../../ui/Error";
import ChatHead from "./ChatHead";
import Messages from "./Messages";
import Options from "./Options";

export default function ChatBody() {
  const { id } = useParams();
  console.log(id);
  const { data: messages, isLoading, isError, error } = useGetMessagesQuery(id);

  let content;

  if (isLoading) {
    content = (
      <div className="m-2 text-center">
        <div className="bg-green-200 text-green-600 rounded-md py-3">
          Loading
        </div>
      </div>
    );
  } else if (!isLoading && isError) {
    content = (
      <div className="m-2 text-center">
        <Error message={error?.data} />
      </div>
    );
  } else if (!isLoading && !error && messages?.length === 0) {
    content = (
      <div className="m-2 text-center">
        {" "}
        <Error message={"No Messages found"} />
      </div>
    );
  } else if (!isLoading && !error && messages?.length > 0) {
    content = (
      <>
        <ChatHead message={messages[0]} />
        <Messages messages={messages} />
        <Options />
      </>
    );
  }

  return (
    <div className="w-full lg:col-span-2 lg:block">
      <div className="w-full grid conversation-row-grid">
        {content}

        {/* <Blank /> */}
      </div>
    </div>
  );
}
