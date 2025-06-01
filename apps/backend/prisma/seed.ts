import { PrismaClient, AuthType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { injectEnvToService } from '../src/config/config.service';

// Load configuration first
const config = injectEnvToService();

// Set DATABASE_URL environment variable from config
process.env.DATABASE_URL = config.values.mongoURL;

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Get super admin credentials from config
    const superAdminEmail = config.values.superAdmin.email;
    const superAdminPassword = config.values.superAdmin.password;

    console.log(`Checking for existing super admin with email: ${superAdminEmail}`);

    // Check if super admin already exists (by email and auth type)
    const existingSuperAdmin = await prisma.user.findFirst({
        where: {
            OR: [
                { authType: AuthType.SUPER_ADMIN },
                { email: superAdminEmail }
            ]
        }
    });

    if (existingSuperAdmin) {
        console.log('✅ Super admin already exists. Skipping seed.');
        console.log(`📧 Email: ${existingSuperAdmin.email}`);
        console.log(`🆔 User ID: ${existingSuperAdmin.id}`);
        return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(superAdminPassword, saltRounds);

    console.log('Creating super admin user...');

    // Create super admin user
    const superAdmin = await prisma.user.create({
        data: {
            authType: AuthType.SUPER_ADMIN,
            email: superAdminEmail,
            mobileNumber: undefined, // Explicitly set to undefined
            password: hashedPassword,
            isVerified: true,
            isActive: true
        }
    });

    console.log('✅ Super admin user created successfully!');
    console.log(`📧 Email: ${superAdminEmail}`);
    console.log(`🔑 Password: ${superAdminPassword}`);
    console.log(`🆔 User ID: ${superAdmin.id}`);
    console.log('⚠️  Please change the default password after first login!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('🔌 Database connection closed.');
    }); 