import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'

// const prisma =
//
const prisma = new PrismaClient();

export default async (req, res) => {
    // Google Recaptcha check
    const human = validateHuman(req.body.token);
    const recaptchaSuccess = await human;
    // console.log("TOKEN IS: ", req.body.token);

    async function validateHuman(token) {
        const secret = process.env.RECAPTCHA_SECRET_KEY;
        const response = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
            {
                method: "POST",
            }
        );
        const data = await response.json();
        console.log("DATA IS: ", data);
        return data.success;
    }

    // Do this if not passing recaptcha check
    if (!recaptchaSuccess) {
        // alert("Unable to submit data. You have failed reCAPTCHA check.");
        res.status(400).json({error: "Unauthorized - failed recaptcha"});
        return;
    }

    if (req.method !== "POST") {
        return res.status(405).json({
            message: "Method not allowed"
        });
    }
    // const requestData = JSON.parse(req.body);
    const requestData = req.body.body;


    const savedRequest = await prisma.request.create({
        data: requestData
    })
    res.json(savedRequest);
}