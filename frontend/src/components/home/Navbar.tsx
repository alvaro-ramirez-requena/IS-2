import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { NotificationService } from "../../services/notification.service";

import { ReportFollowService } from "../../services/reportFollow.service";

import { statusLabels } from "../../utils/reportLabels";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const firstName = localStorage.getItem("firstName");

  const role = localStorage.getItem("role");

  const isLoggedIn = Boolean(token);

  const initial = isLoggedIn ? firstName?.charAt(0).toUpperCase() || "U" : "?";

  const [searchQuery, setSearchQuery] = useState("");

  const [showMenu, setShowMenu] = useState(false);

  const [notifications, setNotifications] = useState<any[]>([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [followedReports, setFollowedReports] = useState<any[]>([]);

  const handleUserClick = () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para acceder a tu cuenta.");
      return;
    }

    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("userId");

    localStorage.removeItem("role");

    localStorage.removeItem("firstName");

    setShowMenu(false);

    navigate("/");
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = searchQuery.trim();

    setShowMenu(false);

    if (query.length > 0) {
      navigate(`/reports/map?search=${encodeURIComponent(query)}`);
      return;
    }

    navigate("/reports/map");
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId || !isLoggedIn) {
      return;
    }

    const fetchUserPanelData = async () => {
      try {
        const notificationData = await NotificationService.getByUser(userId);

        setNotifications(notificationData.notifications || []);

        setUnreadCount(notificationData.unreadCount || 0);

        const followedData = await ReportFollowService.getFollowedReports(userId);

        setFollowedReports(followedData || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserPanelData();
  }, [isLoggedIn]);

  const handleNotificationClick = async (notification: any) => {
    try {
      await NotificationService.markAsRead(notification.id);

      setNotifications((prev) => prev.filter((item) => item.id !== notification.id));

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error(error);
    } finally {
      setShowMenu(false);

      const currentUserId = localStorage.getItem("userId");

      const reportOwnerId = notification.report?.userId;

      const problemType = notification.report?.problemType;

      if (reportOwnerId && currentUserId && reportOwnerId === currentUserId) {
        navigate(`/my-reports?highlight=${notification.reportId}`);

        return;
      }

      if (problemType) {
        navigate(
          `/reports/problem/${encodeURIComponent(problemType)}?highlight=${notification.reportId}`
        );

        return;
      }

      navigate("/home");
    }
  };

  return (
    <header
      className="
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
        "
    >
      <div
        className="
                flex
                flex-col
                lg:flex-row
                items-center
                gap-6
                lg:gap-10
            "
      >
        <h1
          className="
                    text-3xl
                    lg:text-4xl
                    font-bold
                    text-white
                "
        >
          reporta
          <span className="text-yellow-400">Ya</span>
        </h1>
      </div>

      {isLoggedIn && role !== "OPERATOR" && role !== "TECHNICIAN" && (
        <form
          onSubmit={handleSearchSubmit}
          className="
                        w-full
                        max-w-2xl
                        hidden
                        lg:flex
                        items-center
                        bg-white
                        rounded-full
                        overflow-hidden
                        border
                        border-white/20
                        shadow-sm
                    "
        >
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Buscar reportes por zona, distrito o dirección..."
            className="
                            flex-1
                            px-5
                            py-3
                            text-[#03152E]
                            outline-none
                            text-sm
                        "
          />

          <button
            type="submit"
            className="
                            px-5
                            py-3
                            bg-yellow-400
                            text-[#03152E]
                            font-semibold
                            hover:bg-yellow-300
                            transition
                        "
          >
            Ver mapa
          </button>
        </form>
      )}

      <div
        className="
                w-full
                lg:w-auto
                flex
                items-center
                justify-center
                lg:justify-end
                gap-6
            "
      >
        <div className="relative">
          <button
            onClick={handleUserClick}
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

          {isLoggedIn && showMenu && (
            <div
              className="
            absolute
            right-0
            mt-3
            w-80
            bg-white
            rounded-2xl
            shadow-xl
            border
            overflow-hidden
            z-50
        "
            >
              <div
                className="
                    px-5
                    py-4
                    border-b
                "
              >
                <p
                  className="
                        font-bold
                        text-[#03152E]
                        text-lg
                    "
                >
                  {firstName || "Usuario"}
                </p>

                <p
                  className="
                        text-sm
                        text-gray-500
                        mt-1
                    "
                >
                  {role === "OPERATOR"
                    ? "Operador municipal"
                    : role === "TECHNICIAN"
                      ? "Técnico de campo"
                      : "Ciudadano"}
                </p>
              </div>

              <div
                className="
            w-full
            text-left
            px-5
            py-4
            border-b
        "
              >
                <div
                  className="
            flex
            items-center
            justify-between
            gap-4
        "
                >
                  <span
                    className="
                font-semibold
                text-[#03152E]
            "
                  >
                    🔔 Notificaciones
                  </span>

                  <span
                    className="
                bg-red-600
                text-white
                text-xs
                px-2
                py-1
                rounded-full
            "
                  >
                    {unreadCount}
                  </span>
                </div>

                {notifications.filter((notification) => !notification.read).length === 0 ? (
                  <p
                    className="
                mt-3
                text-sm
                text-gray-500
            "
                  >
                    No tienes notificaciones nuevas.
                  </p>
                ) : (
                  <div
                    className="
                mt-3
                space-y-2
                max-h-52
                overflow-y-auto
            "
                  >
                    {notifications
                      .filter((notification) => !notification.read)
                      .slice(0, 3)
                      .map((notification) => {
                        const reportTitle =
                          notification.report?.title ||
                          notification.report?.problemType ||
                          "Reporte";

                        const notificationMessage = notification.message
                          ? notification.message.replace(/"[^"]+"/, `"${reportTitle}"`)
                          : notification.title;

                        return (
                          <button
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className="
                                w-full
                                text-left
                                p-3
                                rounded-xl
                                bg-gray-50
                                hover:bg-gray-100
                                transition
                            "
                          >
                            <p
                              className="
                                font-semibold
                                text-sm
                                text-[#03152E]
                            "
                            >
                              {reportTitle}
                            </p>

                            <p
                              className="
                                text-xs
                                text-gray-500
                                mt-1
                            "
                            >
                              {notification.title}
                            </p>

                            <p
                              className="
                                text-sm
                                text-gray-600
                                mt-1
                                leading-relaxed
                            "
                            >
                              {notificationMessage}
                            </p>
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>

              <div
                className="
                px-5
                py-4
                border-b
            "
              >
                <p
                  className="
        font-semibold
        text-[#03152E]
        text-lg
    "
                >
                  📌 Reportes seguidos
                </p>

                <p
                  className="
        text-sm
        text-gray-500
        mt-1
    "
                >
                  Reportes que estás monitoreando
                </p>

                {followedReports.length === 0 ? (
                  <p
                    className="
            mt-3
            text-sm
            text-gray-500
        "
                  >
                    No sigues ningún reporte todavía.
                  </p>
                ) : (
                  <div
                    className="
            mt-3
            space-y-2
            max-h-48
            overflow-y-auto
        "
                  >
                    {followedReports.slice(0, 3).map((follow) => (
                      <button
                        key={follow.id}
                        onClick={() => {
                          setShowMenu(false);

                          navigate(
                            `/reports/problem/${encodeURIComponent(
                              follow.report.problemType
                            )}?highlight=${follow.report.id}`
                          );
                        }}
                        className="
                            w-full
                            text-left
                            p-3
                            rounded-xl
                            bg-gray-50
                            hover:bg-gray-100
                            transition
                        "
                      >
                        <p
                          className="
                            font-semibold
                            text-sm
                            text-[#03152E]
                        "
                        >
                          {follow.report.title || follow.report.problemType}
                        </p>

                        <p
                          className="
                            text-xs
                            text-gray-500
                            mt-1
                        "
                        >
                          Tipo: {follow.report.problemType}
                        </p>

                        <p
                          className="
                            text-xs
                            text-gray-500
                            mt-1
                        "
                        >
                          Estado actual:{" "}
                          {statusLabels[follow.report.status] || follow.report.status}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="
                    w-full
                    text-left
                    px-5
                    py-4
                    hover:bg-red-50
                    text-red-600
                    font-semibold
                    transition
                "
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
