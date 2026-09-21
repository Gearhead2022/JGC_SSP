import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../src/lib/database/prisma";

export async function factoryPensioner() {
    console.log("Seeding database...");

    await prisma.pensioner.createMany({
        data: [
            {
                legacyPensionerId: 234,
                lastName: "DELA CRUZ",
                firstName: "JUAN",
                middleName: "ANIMA",
                birthDate: new Date("1955-03-15"),
                bankName: "BDO",
                actualPension: new Prisma.Decimal("2500.00"),
                contingencyDate: new Date("2026-06-01"),
            },
            {
                legacyPensionerId: 24,
                lastName: "SANTOS",
                firstName: "MARIA",
                middleName: "BERNARDO",
                birthDate: new Date("1958-07-21"),
                bankName: "LANDBANK",
                actualPension: new Prisma.Decimal("5800.00"),
                contingencyDate: new Date("2026-07-01"),
            },
            {
                legacyPensionerId: 56,
                lastName: "GARCIA",
                firstName: "PEDRO",
                middleName: "COLONER",
                birthDate: new Date("1960-11-08"),
                bankName: "PNB",
                actualPension: new Prisma.Decimal("8250.50"),
                contingencyDate: new Date("2026-08-01"),
            },
            {
                legacyPensionerId: 152,
                lastName: "REYES",
                firstName: "ANA",
                middleName: "DEMARANA",
                birthDate: new Date("1957-01-30"),
                bankName: "RCBC",
                actualPension: new Prisma.Decimal("2000.00"),
                contingencyDate: new Date("2026-09-01"),
            },
            {
                legacyPensionerId: 4621,
                lastName: "MENDOZA",
                firstName: "ROBERTO",
                middleName: "ELISTO",
                birthDate: new Date("1954-09-12"),
                bankName: "CHINA BANK",
                actualPension: new Prisma.Decimal("3500.75"),
                contingencyDate: new Date("2026-10-01"),
            },
        ],
    });

    console.log("Pensioners seeded successfully.");
}