import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


import Box from "@mui/material/Box";
import {useState} from "react";
import {FormGroup, FormHelperText, Grid, Input, TextField} from "@material-ui/core";
import Button from "@mui/material/Button";
import EmailField from "./form_fields/emailField";
import PhoneField from "./form_fields/phoneField";
import MuseumField from "./form_fields/museumField";


const defaultValues = {
    email: '',
    phone: '',
    museum: '',
};

const Form = (props) => {
    const [formValues, setFormValues] = useState(defaultValues);
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const [museum, setMuseum] = React.useState('');

    const handleChange2 = (event) => {
        setMuseum(event.target.value);
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formValues);
    };
    return (
        <form onSubmit={handleSubmit}>
            <EmailField />
            <PhoneField />
            <MuseumField {...props}/>
            <div>Last scraped: {props.lastScraped}</div>
        </form>
    );
};

export default Form;
