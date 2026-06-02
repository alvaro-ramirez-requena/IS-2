import bcrypt from "bcryptjs";

import { prisma }
from "../config/prisma";

async function main() {

    const hashedPassword =
        await bcrypt.hash(
            "Operador123",
            10
        );

    const operator =
        await prisma.user.create({

            data: {

                email:
                    "operador@municipalidad.com",

                firstName:
                    "Operador",

                lastName:
                    "Municipal",

                password:
                    hashedPassword,

                role:
                    "OPERATOR",
            },
        });

    console.log(
        "Operador creado:",
        operator.email
    );
}

main()
    .catch(console.error)
    .finally(async () => {

        await prisma.$disconnect();
    });