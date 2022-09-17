import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUsersQuery } from "../../features/users/usersApi";
import isEmailValid from "../../utils/isValidEmail";
import { conversationsApi } from "./../../features/conversation/conversationsApi";
import Error from "./../ui/Error";

export default function Modal({ open, control }) {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [userCheck, setUserCheck] = useState(false);
  const [responseError, setResponseError] = useState("");
  const [conversation, setConversation] = useState(undefined);

  const { user } = useSelector((state) => state.auth) || {};
  const dispatch = useDispatch();

  const {
    data: participant,
    // isLoading,
    // isError,
    // error,
  } = useGetUsersQuery(to, {
    skip: !userCheck,
  });

  //   const { email: participantEmail } = participant || {};
  const { email: userEmail } = user || {};

  console.log(participant);

  const debounceHandler = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  useEffect(() => {
    return () => {
      if (participant?.length > 0 && participant[0]?.email !== userEmail) {
        dispatch(
          conversationsApi.endpoints.getConversation
            .initiate({
              userEmail,
              participantEmail: to,
            })
            .unWrap()
            .then((data) => {
              setConversation(data);
            })
            .catch((err) => {
              setResponseError("there was an error occurred");
              console.log(err);
            })
        );
      }
    };
  }, [participant, userEmail, to, dispatch]);

  const doSearch = (value) => {
    if (isEmailValid(value)) {
      //console.log(value);
      // check user API
      setTo(value);
      setUserCheck(true);
    }
  };

  const handleSearch = debounceHandler(doSearch, 500);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("form submit");
  };

  return (
    open && (
      <>
        <div
          onClick={control}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
        ></div>
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Send message
          </h2>
          <form
            className="mt-8 space-y-6"
            action="#"
            method="POST"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="to" className="sr-only">
                  To
                </label>
                <input
                  id="to"
                  name="to"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Send to"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  type="message"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                disabled={
                  conversation === undefined ||
                  (participant?.length > 0 &&
                    participant[0]?.email === userEmail)
                }
              >
                Send Message
              </button>
            </div>

            {participant?.length === 0 && (
              <Error message="This user does not exist" />
            )}

            {participant?.length > 0 && participant[0]?.email === userEmail && (
              <Error message="You can not sent message yourself" />
            )}

            {responseError !== "" && <Error message={responseError} />}
          </form>
        </div>
      </>
    )
  );
}
