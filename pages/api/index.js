import prisma from '/lib/prisma.js';

// POST /api/post
// Required fields in body: title, authorEmail
// Optional fields in body: content
export default async function handle(req, res) {
    const { museum, date, email, phone } = req.body
    const result = await prisma.post.create({
        data: {
            museum: museum,
            date: date,
            email: email,
            phone: phone,
        },
    })
    res.json(result)
}