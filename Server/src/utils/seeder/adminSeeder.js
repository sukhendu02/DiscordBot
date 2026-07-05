import { BadRequestError } from "../../middleware/ErrorHandler.js";
import Admin from "../../models/admin.js"
import bcrypt from "bcrypt";

export const seedAdmin = async () => {

    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if(!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD){
        throw BadRequestError("Admin details are required")
        console.error("Admin seeder failed: Missing required environment variables.");
        return;
    }

    const existingAdmin = await Admin.findOne({
        where:{
            email:ADMIN_EMAIL.toLowerCase().trim()
        }
    });
    if(existingAdmin){
        // console.log("Admin present")
        return;
    }
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD.trim(), 10);
    // console.log(ADMIN_NAME,ADMIN_EMAIL,hashedPassword)

    await Admin.create({
        username:ADMIN_NAME,
        email:ADMIN_EMAIL.toLowerCase().trim(),
        password:hashedPassword
    })

    // console.log("Admin seeded successfully");

}
