export default async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({
            message: "Method not allowed"
        });
    }

	console.log(req.body)

	const response = await fetch(process.env.SERVER_URL, {
		method: "POST",
		headers: {
			'Content-type': 'application/json'
		},
		body: JSON.stringify(req.body)
	})

	if (response.status === 400) {
        res.status(400).json({error: "Unauthorized - failed recaptcha"});
        return;
	}

	const data = await response.json()
	res.json(data)
}
