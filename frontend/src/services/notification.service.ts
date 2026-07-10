const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

export class NotificationService {

    static async getByUser(
        userId: string
    ) {

        const response =
            await fetch(
                `${API_URL}/api/notifications/user/${userId}`
            );

        if (!response.ok) {
            throw new Error(
                "No se pudieron obtener las notificaciones"
            );
        }

        return response.json();
    }

    static async markAsRead(
        notificationId: string
    ) {

        const response =
            await fetch(
                `${API_URL}/api/notifications/${notificationId}/read`,
                {
                    method: "PATCH",
                }
            );

        if (!response.ok) {
            throw new Error(
                "No se pudo marcar la notificación como leída"
            );
        }

        return response.json();
    }
}