import {
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

export default function Navbar() {

    const firstName =
        localStorage.getItem("firstName")
        || "U";

    const initial =
        firstName.charAt(0).toUpperCase();

    const navigate =
        useNavigate();

    const [showMenu, setShowMenu] =
        useState(false);

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("userId");

        localStorage.removeItem("role");

        localStorage.removeItem("firstName");

        navigate("/login");
    };

    return (

        <header className="
  bg-[#03152E]
  px-4
  lg:px-10
  py-5
  flex
  flex-col
  lg:flex-row
  gap-6
  lg:gap-0
  items-center
  justify-between
  shadow-lg
">

            <div className="
  flex
  flex-col
  lg:flex-row
  items-center
  gap-6
  lg:gap-10
">

                <h1 className="
  text-3xl
  lg:text-4xl
          font-bold
          text-white
        ">
                    reporta
                    <span className="text-yellow-400">
                        Ya
                    </span>
                </h1>



            </div>

            <div className="
  w-full
  lg:w-auto
  flex
  items-center
  justify-center
  lg:justify-end
  gap-6
">



                <div className="relative">

                    <button
                        onClick={() =>
                            setShowMenu(!showMenu)
                        }
                        className="
      w-14
      h-14
      rounded-full
      bg-yellow-400
      flex
      items-center
      justify-center
      text-xl
      font-bold
    "
                    >
                        {initial}
                    </button>

                    {
                        showMenu && (

                            <div className="
        absolute
        right-0
        mt-3
        w-52
        bg-white
        rounded-2xl
        shadow-xl
        border
        overflow-hidden
        z-50
      ">

                                <button
                                    onClick={handleLogout}
                                    className="
          w-full
          text-left
          px-5
          py-4
          hover:bg-gray-100
          font-medium
        "
                                >
                                    Cerrar sesión
                                </button>

                            </div>
                        )
                    }

                </div>

            </div>

        </header>
    );
}