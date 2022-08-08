import * as React from "react";
import {useState} from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@material-ui/core/TextField";

import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import {IMaskInput} from "react-imask";
import PropTypes from "prop-types";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {isMoment} from "moment";
import { getPlaces } from "../../../utils/Utils";


const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
    const {onChange, ...other} = props;
    return (
        <IMaskInput
            {...other}
            definitions={{
                "#": /[1-9]/,
            }}
            mask="(#00) 000-0000"
            overwrite
            onAccept={(value) => onChange({target: {name: props.name, value}})}
        />
    );
});

TextMaskCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

const Form = (props) => {

    const museums = [];

    const defaultValues = {
        date: null,
        tickets: "",
        museum: "",
        email: "",
        phone: "",
    };

    const [formValues, setFormValues] = useState(defaultValues);

    const handleInputChange = (event) => {
        if (isMoment(event)) {
            setFormValues({
                ...formValues,
                date: event.format('YYYY-MM-DD'),
            });

            getPlaces(props);

        } else if (!isMoment(event)) {
            setFormValues({
                ...formValues,
                [event.target.name]: event.target.value,
            });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formValues);
    };


    return (
        <Box
            alignItems="center"
            display="flex"
            height="100%"
            justifyContent="center"
        >
            <Box
                component="form"
                padding="10%"
                onSubmit={handleSubmit}
            >
                <div>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                            label="Date of Visit"
                            name="date"
                            renderInput={(params) =>
                                <TextField {...params} style={{width: 250}}/>
                            }
                            value={formValues.date}
                            onChange={handleInputChange}
                        />
                    </LocalizationProvider>
                </div>
                <div>
                    <FormControl sx={{width: 250}} variant="standard">
                        <InputLabel id="number-of-tickets-select">Number of Tickets</InputLabel>
                        <Select
                            id="number-of-tickets-select"
                            label="Tickets"
                            labelId="number-of-tickets-select"
                            name="tickets"
                            sx={{textAlign: 'left'}}
                            value={formValues.tickets}
                            onChange={handleInputChange}
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <FormControl variant="standard">
                        <InputLabel id="museum-select">Museum</InputLabel>
                        <Select
                            id="standard-select-currency"
                            label="Museum"
                            labelId="museum-select"
                            name="museum"
                            style={{width: 250, textAlign: 'left'}}
                            value={formValues.museum}
                            variant="standard"
                            onChange={handleInputChange}
                        >
                            {props.museumNames.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <TextField
                        id="email"
                        label="Email"
                        name="email"
                        style={{width: 250}}
                        type="email"
                        value={formValues.email}
                        variant="standard"
                        onChange={handleInputChange}
                    />
                </div>
                <FormControl variant="standard">
                    <InputLabel htmlFor="formatted-phone-input">Phone</InputLabel>
                    <Input
                        id="formatted-phone-input"
                        inputComponent={TextMaskCustom}
                        name="phone"
                        style={{width: 250}}
                        value={formValues.phone}
                        onChange={handleInputChange}
                    />
                </FormControl>
                <br/><br/>
                <Button color="primary" type="submit" variant="contained">
                    Submit
                </Button>
                <br/><br/>
                <div>Last scraped: {props.lastScraped}</div>
            </Box>
        </Box>
    );
};

export default Form;
