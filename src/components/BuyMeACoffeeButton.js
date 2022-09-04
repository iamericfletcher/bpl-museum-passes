import React, {Component} from 'react';
import Button from "@mui/material/Button";
import {createTheme, styled, ThemeProvider} from "@mui/material/styles";
import Link from "@mui/material/Link";

class BuyMeACoffeeButton extends Component {

    render() {
        const theme = createTheme({
            components: {
                MuiButton: {
                    styleOverrides: {
                        root: {
                            padding: '0px',
                        },
                    },
                },
            },
        });

        const MyButton = styled(Button)({
                width: "150px",
                height: "48px",
                backgroundImage: `url(${"/yellow-button-final.png"})`,
            borderRadius: "10px",
            href: "https://www.buymeacoffee.com/iamericfletcher",
            target: "_blank",
        });
        return (
            <div>
                <Link href={"https://www.buymeacoffee.com/iamericfletcher"} target={"_blank"}>
                    <ThemeProvider theme={theme}>
                <MyButton/>
                    </ThemeProvider>
                </Link>
            </div>
        );
    }
}

export default BuyMeACoffeeButton;