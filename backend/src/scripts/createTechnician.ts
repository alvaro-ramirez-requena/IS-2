import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";

async function main() {
    const hashedPassword = await bcrypt.hash(
        "Tecnico123",
        10
    );

    const technician = await prisma.user.create({
        data: {
            email: "tecnico@municipalidad.com",
            firstName: "Juan",
            lastName: "Tecnico",
            password: hashedPassword,
            role: "TECHNICIAN",
            availability: true,
            specialty: "Infraestructura",
            zone: "Norte",
            crew: "Cuadrilla Norte",
        },
    });

    console.log(
        "Técnico creado:",
        technician.email
    );

}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });