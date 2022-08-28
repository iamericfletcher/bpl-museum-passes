import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'

// const prisma =
//
const prisma = new PrismaClient();

export default async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({
            message: "Method not allowed"
        });
    }
    // const requestData = JSON.parse(req.body);
    const requestData = req.body;

    const savedRequest = await prisma.request.create({
        data: requestData
    })
    res.json(savedRequest);
}