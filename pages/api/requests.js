import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'

// const prisma =
//
const prisma = new PrismaClient();

export default async (req, res) => {
    console.log(req.body.token, "token")
    const human = validateHuman(req.body.token);

    if (!human) {
        res.status(401).json({error: "Unauthorized"});
        res.json({error: "Unauthorized, Google reCAPTCHA failed"});
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

    async function validateHuman(token) {
        const secret = process.env.RECAPTCHA_SECRET_KEY;
        const response = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
            {
                method: "POST",
            }
        );
        const data = await response.json();

        console.log(data, "recaptcha data");

        return false;
        // return data.success;
    }
}