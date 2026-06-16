import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
const hashedPassword =
await bcrypt.hash("operator123", 10);

const operator =
await prisma.user.create({
data: {
email: "operador@test.com",
firstName: "Operador",
lastName: "Municipal",
password: hashedPassword,
role: Role.OPERATOR,
},
});

console.log("Operador creado:");
console.log("Email:", operator.email);
console.log("Password: operator123");
}

main()
.catch((error) => {
console.error(error);
})
.finally(async () => {
await prisma.$disconnect();
});