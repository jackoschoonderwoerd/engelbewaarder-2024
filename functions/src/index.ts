import { onCall, HttpsError } from "firebase-functions/v2/https";
import nodemailer from "nodemailer";

export const sendContactForm = onCall(
    {
        region: "europe-west1",
        secrets: ["SMTP_PASSWORD"],
        cors: true,
        invoker: "public",
    },
    async (request) => {
        console.log(request)
        const {
            city,
            email,
            motivation,
            name,
            street_number,
            street,
            zipcode,
            phone,
            date_of_birth,
            kitchen,
            bar,
            catering_industry_experience,
            other_activities,
            for_how_long,
            hours_per_week,
            holliday_festival_plans
        } = request.data;

        if (
            !city ||
            !email ||
            !motivation ||
            !name ||
            !street ||
            !street_number ||
            !zipcode ||
            !phone ||
            !date_of_birth ||
            kitchen === undefined ||
            bar === undefined ||
            !catering_industry_experience ||
            !other_activities ||
            !for_how_long ||
            !hours_per_week ||
            !holliday_festival_plans
        ) {
            throw new HttpsError("invalid-argument", "Missing required fields");
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.strato.com",
            port: 465,
            secure: true,
            auth: {
                user: "info@cafedeengelbewaarder.nl",
                pass: process.env.SMTP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: '"Website Contact Form" <info@cafedeengelbewaarder.nl>',
            to: ["cafedeengelbewaarder@gmail.com", "jackoboes@gmail.com"],
            bcc: "jackoboes@gmail.com",
            replyTo: email,
            subject: `Contact form from ${name}`,
            text: `
            Naam: ${name}
            Straat: ${street} Nummer: ${street_number}
            Postcode: ${zipcode} Plaats: ${city}
            Telefoon: ${phone}
            Date of birth: ${date_of_birth}
            Email: ${email}
            Motivatie: ${motivation}
            Keuken: ${kitchen}
            Bar: ${bar}
            Horeca ervaring: ${catering_industry_experience}
            Andere activiteiten: ${other_activities}
            Hoe lang : ${for_how_long}
            Uren per week: ${hours_per_week}
            Vakantie - festival plannen: ${holliday_festival_plans}
            `,
        });

        return {
            success: true,
            message: "Email sent successfully",
        };
    }
);
