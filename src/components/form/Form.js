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
import moment from "moment";
import dayjs from "dayjs";
import * as cheerio from "cheerio";
import str from "assert";


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
    const dayjs = require('dayjs')
    console.log(props.museumsWithPasses);
    const defaultValues = {
        date: null,
        tickets: "",
        museum: "",
        email: "",
        phone: "",
    };
    const [formValues, setFormValues] = useState(defaultValues);
    // function for setting the maxDate for DatePicker
    const setMaxDate = (daysToAdd) => {
        const now = new Date()
        const nowPlusDays = now.setDate(now.getDate() + daysToAdd)
        return moment(dayjs(nowPlusDays).format('YYYY-MM-DD'))
    }
    const handleInputChange = (event) => {
        // Used for the date picker
        if (isMoment(event)) {
            setFormValues({
                ...formValues,
                date: event.format('YYYY-MM-DD'),
            });
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
                            maxDate={setMaxDate(59)}
                            name="date"
                            renderInput={(params) =>
                                <TextField {...params} style={{width: 380}}/>
                            }
                            value={formValues.date}
                            disablePast
                            onChange={handleInputChange}
                        />
                    </LocalizationProvider>
                </div>
                <div>
                    <FormControl variant="standard">
                        <InputLabel id="museum-select">Museum</InputLabel>
                        <Select
                            id="standard-select-currency"
                            label="Museum"
                            labelId="museum-select"
                            name="museum"
                            style={{width: 380, textAlign: 'left'}}
                            value={formValues.museum}
                            variant="standard"
                            onChange={handleInputChange}
                        >
                            {props.museumNamesForSelectField.map((option) => (
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
                        style={{width: 380}}
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
                        style={{width: 380}}
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
