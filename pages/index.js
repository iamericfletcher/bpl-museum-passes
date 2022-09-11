import * as React from "react";
import Form from "../src/components/form/Form";
import Container from "@mui/material/Container";

export default function Index(props) {
    return (
        <Container
            sx={{
                backgroundColor: "#f8edeb",
                padding: 1,
                textAlign: "center",
                minHeight: "100vh",
                minWidth: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
                <Form {...props} />
        </Container>
    );
}

export async function getServerSideProps() {
	const res = await fetch(process.env.SERVER_URL)
		.then(res => res.json())
		.catch(res => res)

	if (res.message) {
		// redirect to error page here.
	}

	return {
		props: res
	}
}
