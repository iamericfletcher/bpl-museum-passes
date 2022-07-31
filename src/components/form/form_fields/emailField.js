import React, {Component} from 'react';
import {TextField} from "@material-ui/core";

class EmailField extends Component {
    render() {
        return (
            <div>
                <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="standard"
                    type="email"
                    error={false}
                    style={{width: 250}}
                />
            </div>
        );
    }
}

export default EmailField;