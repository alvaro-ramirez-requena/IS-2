import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("tecnico123", 10);

    const technician = await prisma.user.create({
        data: {
            email: "tecnico2@test.com",
            firstName: "Técnico",
            lastName: "Campo",
            password: hashedPassword,
            role: Role.TECHNICIAN,
        },
    });

    console.log("Técnico creado:");
    console.log("Email:", technician.email);
    console.log("Password: tecnico123");
}

main()
    .catch((error) => {
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });