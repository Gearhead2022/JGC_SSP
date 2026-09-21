import { seedPermissions, seedUsers, seedRoles } from "./seeders";
import { factoryUser, factoryPensioner } from "./factories";

async function main() {
    console.log("🌱 Starting database seed...");

    // Seed required/default data
    await seedPermissions();
    await seedRoles();
    await seedUsers();

    // Development/test data
    // await factoryUser();
    await factoryPensioner();

    console.log("✅ Database seed completed");
}

main()
    .catch((error) => {
        console.error("❌ Database seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        // If your prisma instance exports $disconnect,
        // you can disconnect here.
    });