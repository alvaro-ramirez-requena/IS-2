export default function Navbar() {

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

                <div className="
          bg-white/10
          px-5
          py-3
          rounded-2xl
          text-white
          flex
          items-center
          gap-3
        ">

                    <span className="text-xl">
                        📍
                    </span>

                    <span className="text-lg">
                        Miraflores
                    </span>

                </div>

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

                    <input
                        placeholder="Buscar reportes..."
                        className="
    w-full
    lg:w-80
              bg-white
              rounded-2xl
              px-6
              py-3
              outline-none
            "
                    />

                </div>

                <button className="
          text-white
          text-3xl
        ">
                    🔔
                </button>

                <div className="
          w-14
          h-14
          rounded-full
          bg-yellow-400
          flex
          items-center
          justify-center
          text-xl
          font-bold
        ">
                    A
                </div>

            </div>

        </header>
    );
}