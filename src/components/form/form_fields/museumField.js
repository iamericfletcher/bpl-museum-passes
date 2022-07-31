import React, {Component} from 'react';
import {TextField} from "@material-ui/core";
import axios from "axios";
import * as cheerio from "cheerio";
import MenuItem from "@mui/material/MenuItem";

const MuseumField = (props) => {
    const [museum, setMuseum] = React.useState('');

    const handleChange = (event) => {
        setMuseum(event.target.value);
    };
        return (
            <div>
                <TextField
                    id="standard-select-currency"
                    select
                    label="Museum"
                    helperText="Please select a museum"
                    variant="standard"
                    value={museum}
                    onChange={handleChange}
                    style={{width: 250}}
                >
                    {props.museumNames.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
        );
    }


export default MuseumField;