import * as React from "react";
import Form from "../src/components/form/Form";
import Container from "@mui/material/Container";
// import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
// import Button from "@mui/material/Button";
// import BuyMeACoffeeButton from "../src/components/BuyMeACoffeeButton";
// import InstructionsButton from "../src/components/InstructionsButton";

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
	const res = await fetch("http://localhost:3001")
		.then(res => res.json())
		.catch(res => res)

	return {
		props: res
	}
}
