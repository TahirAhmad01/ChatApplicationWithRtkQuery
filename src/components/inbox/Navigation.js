import gravatarUrl from "gravatar-url";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logoImage from "../../assets/images/lws-logo-dark.svg";
import { userLoggedOut } from "../../features/auth/authSlice";

export default function Navigation() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth) || {};
  const { email, name } = user || {};

  const handleLogout = () => {
    dispatch(userLoggedOut());
    localStorage.removeItem("auth");
  };
  return (
    <nav className="border-general sticky top-0 z-40 border-b bg-violet-700 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-16 items-center">
          <Link to="/">
            <img className="h-10" src={logoImage} alt="Learn with Sumit" />
          </Link>
          <div className="flex align-middle items-center">
            <div className="text-end text-white pr-3 ">
              <h2 className="text-lg m-0 p-0">{name}</h2>
              <div>{email}</div>
            </div>
            <div>
              <img
                className="object-cover w-12 h-12 rounded-full"
                src={gravatarUrl(email, {
                  size: 120,
                })}
                alt={name}
              />
            </div>
            <div>
              <ul>
                <li className="text-white">
                  <span onClick={handleLogout} className="cursor-pointer pl-3">
                    {/* <i class="bx bx-log-out-circle text-3xl rotate-180"></i> */}
                    <i class="fa-solid fa-right-from-bracket text-3xl"></i>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
