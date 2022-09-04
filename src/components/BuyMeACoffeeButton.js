import React, {Component} from 'react';
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import Link from "@mui/material/Link";

class BuyMeACoffeeButton extends Component {

    render() {
        const MyButton = styled(Button)({
                width: "217px",
                height: "60px",
                backgroundImage: `url(${"/yellow-button-copy.png"})`,
            borderRadius: "10px",
            href: "https://www.buymeacoffee.com/iamericfletcher",
            target: "_blank",
        });
        return (
            <div>
                <Link href={"https://www.buymeacoffee.com/iamericfletcher"} target={"_blank"}>
                <MyButton/>
                </Link>
            </div>
        );
    }
}

export default BuyMeACoffeeButton;