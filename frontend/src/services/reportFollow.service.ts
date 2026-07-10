const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

export class ReportFollowService {

  static async followReport(
    userId: string,
    reportId: string
  ) {

    const response =
      await fetch(
        `${API_URL}/api/report-follows/follow`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId,
            reportId,
          }),
        }
      );

    if (!response.ok) {
      throw new Error(
        "No se pudo seguir el reporte"
      );
    }

    return response.json();
  }

  static async unfollowReport(
    userId: string,
    reportId: string
  ) {

    const response =
      await fetch(
        `${API_URL}/api/report-follows/unfollow`,
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId,
            reportId,
          }),
        }
      );

    if (!response.ok) {
      throw new Error(
        "No se pudo dejar de seguir el reporte"
      );
    }

    return response.json();
  }

  static async isFollowing(
    userId: string,
    reportId: string
  ) {

    const response =
      await fetch(
        `${API_URL}/api/report-follows/is-following/${userId}/${reportId}`
      );

    if (!response.ok) {
      throw new Error(
        "No se pudo verificar si sigues este reporte"
      );
    }

    return response.json();
  }

  static async getFollowedReports(
    userId: string
  ) {

    const response =
      await fetch(
        `${API_URL}/api/report-follows/user/${userId}`
      );

    if (!response.ok) {
      throw new Error(
        "No se pudieron obtener los reportes seguidos"
      );
    }

    return response.json();
  }
}