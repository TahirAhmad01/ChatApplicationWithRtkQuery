import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import Message from "./Message";

export default function Messages({ messages = [] }) {
  const { user } = useSelector((state) => state.auth) || {};
  const { email } = user || {};

  const fetchMore = () => {
    console.log("more data");
  };

  const hasMore = () => {
    return true;
  };

  return (
    <div className="relative w-full overflow-hidden flex flex-col-reverse">
      <InfiniteScroll
        dataLength={messages.length} //This is important field to render the next data
        next={fetchMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        height={window.innerHeight - 200}
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          minHeight: "100%",
          overflow: "auto",
        }}
        className="p-6"
      >
        <ul>
          {messages
            .slice()
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((message) => {
              const { message: LastMessage, id, sender } = message || {};
              const { email: senderEmail } = sender || {};

              const justify = email !== senderEmail ? "start" : "end";

              return (
                <Message
                  key={id}
                  justify={`${justify}`}
                  message={LastMessage}
                />
              );
            })}
        </ul>
      </InfiniteScroll>
    </div>
  );
}
