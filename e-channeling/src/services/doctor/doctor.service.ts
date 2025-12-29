import prisma from "@/lib/db/prisma";

export default async function getDoctorById(id: string) {
    return await prisma.doctors.findUnique({
        where: {
            id,
        },
    });
}
