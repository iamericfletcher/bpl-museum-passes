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
import PropTypes, {number} from "prop-types";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {isMoment} from "moment";
import moment from "moment";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia, Collapse
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import notificationImage from "/notification-image.png";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import {makeStyles} from "@mui/styles";
import {ExpandMore} from "@mui/icons-material";
// import classes from "*.module.css";
// import {} from "../../../public/notification-image.png"



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
    console.log(props.museumObj)
    const defaultValues = {
        date: null,
        initialNumPasses: "",
        museum: "",
        email: "",
        phone: "",
    };
    const [formValues, setFormValues] = useState(defaultValues);
    const [dateOrMuseumClicked, setDateOrMuseumClicked] = useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [numPasses, setNumPasses] = useState("");
    const [nameForURL, setNameForURL] = useState("");
    const [dateForURL, setDateForURL] = useState("");
    // function for setting the maxDate for DatePicker
    const setMaxDate = (daysToAdd) => {
        const now = new Date()
        const nowPlusDays = now.setDate(now.getDate() + daysToAdd)
        return moment(dayjs(nowPlusDays).format('YYYY-MM-DD'))
    }
    const handleInputChange = (event) => {
        // Used for the date picker
        if (isMoment(event)) {
            console.log("isMoment")
            if (props.museumObj[formValues.museum][event.format('YYYY-MM-DD')] === undefined) {
                formValues.date = event.format('YYYY-MM-DD');
                formValues.initialNumPasses = "0";
            } else {
                formValues.date = event.format('YYYY-MM-DD');
                formValues.initialNumPasses = props.museumObj[formValues.museum][event.format('YYYY-MM-DD')];
            }
            //     console.log("isMoment and museum is not empty")
            //     setNumPasses(props.museumObj[formValues.museum][event.format('YYYY-MM-DD')])
            //     // formValues.initialNumPasses = numPasses;
            //     if (numPasses === undefined || numPasses === "") {
            //         console.log("numPasses is undefined or empty")
            //         setFormValues({
            //             ...formValues,
            //             initialNumPasses: "0",
            //         });
            //     }
            //     if (numPasses !== undefined)
            //     setFormValues({
            //         ...formValues,
            //         initialNumPasses: props.museumObj[formValues.museum][event.format('YYYY-MM-DD')],
            //     });
            // }
            // if (formValues.initialNumPasses !== "0") {
            //     setFormValues({
            //         ...formValues,
            //         date: event.format('YYYY-MM-DD'),
            //         initialNumPasses: props.museumObj[formValues.museum][event.format('YYYY-MM-DD')]
            //     });
            // }
            // setFormValues({
            //     ...formValues,
            //     date: event.format('YYYY-MM-DD'),
            //     initialNumPasses: 0,
            //     // initialNumPasses: props.museumObj[formValues.museum][event.format('YYYY-MM-DD')]
            // });
            console.log("formValue.initalNumPasses: " + formValues.initialNumPasses)
            // console.log(props.museumObj[formValues.museum][event.format('YYYY-MM-DD')])
            setDateForURL(event.format('MM/DD/YYYY'))
        } else if (!isMoment(event) && event !== null && event.target.name !== "email" && event.target.name !== "phone") {
            console.log("is not moment && event !== null")
            formValues.museum = event.target.value;
            if(event.target.name === "museum") {
                console.log("event.target.name === museum")
                // setNumPasses(props.museumObj[event.target.value.toString()][formValues.date])
                // if (numPasses === undefined || numPasses === "") {
                // if (props.museumObj[event.target.value.toString()][formValues.date] === undefined || props.museumObj[event.target.value.toString()][formValues.date] === "") {
                // if (formValues.date !== null) {
                //
                // }
                if (props.museumObj[event.target.value.toString()][formValues.date] === undefined) {
                    formValues.initialNumPasses = "0";
                    // formValues.museum = event.target.value;
                    // setFormValues({
                    //     ...formValues,
                    //     initialNumPasses: "0",
                    //     // museum: event.target.value,
                    // });
                } else {
                    formValues.initialNumPasses = props.museumObj[event.target.value.toString()][formValues.date];
                    // setFormValues({
                    //     ...formValues,
                    //     initialNumPasses: props.museumObj[event.target.value.toString()][formValues.date],
                    //     // museum: event.target.value,
                    // });
                }
                console.log("formValue.initalNumPasses: " + formValues.initialNumPasses)
                // formValues.initialNumPasses = numPasses;
                // Museum names for select drop down have had additional information after the name removed
                // For the URL to work, we need to add back the information after the name
                // e.g. Boston Children's Museum -> Boston Children's Museum (e-ticket)
                // e.g. Museum of Fine Arts -> Museum of Fine Arts (e-voucher)
                for (let i = 0; i < props.museumNamesForScraping.length; i++) {
                    console.log("entered for loop")
                    if (props.museumNamesForScraping[i].toString().split("(")[0] === event.target.value) {
                        setNameForURL(props.museumNamesForScraping[i].toString())
                    }
                }
            }
        } else {
            setFormValues({
                ...formValues,
                [event.target.name]: event.target.value,
                // email: event.target.value,
                // phone: event.target.value,
            });
        }
    };
    const handleExpandClick = () => {
        setExpanded(!expanded);
        if (!expanded) {
            setFormValues({
                ...formValues,
                email: "",
                phone: "",
            });
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formValues);
        // setFormValues({
        //     ...formValues,
        //     initialNumPasses: props.museumObj[formValues.museum][formValues.date],
        //     // museum: event.target.value,
        // });
    };
    return (
        <Box
            alignItems="center"
            display="flex"
            height="100%"
            justifyContent="center"
            // style={{ heigh:z}}
            // style={{backgroundColor: 'black'}}
            component="form"
            onSubmit={handleSubmit}
        >
            <Card
                display="flex"
                alignItems="center"
                justifyContent="center"
                style={{ maxWidth: 450, minHeight: 350, backgroundColor: "#FCF6BD"}}
                // variant="outlined"
            >
                <CardHeader
                    title="Boston Public Library"
                    subheader="Museum Pass Notifier"
                />
                <CardMedia
                    height="200"
                    component="img"
                    image="/futuristic-ga407d83ce_640.png"
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        Select the date of your visit and the museum.
                        Then you will see how many current tickets are available for that museum.
                        If you would like to be notified when the next pass becomes available,
                        simply enter your email address and/or phone number.
                    </Typography>
                </CardContent>
                <div>
                    <FormControl variant="standard">
                        <InputLabel id="museum-select">Museum</InputLabel>
                        <Select
                            id="standard-select-currency"
                            label="Museum"
                            labelId="museum-select"
                            name="museum"
                            style={{ width: 380, textAlign: "left" }}
                            value={formValues.museum}
                            variant="standard"
                            onChange={handleInputChange}
                            onOpen={() => {console.log("Museum Select open")}}
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
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                            label="Date of Visit"
                            maxDate={setMaxDate(59)}
                            name="date"
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    // inputProps={{style: { textAlign: 'center' }}}
                                    style={{ width: 380 }}
                                    // Prevent user from typing in a date
                                    // Helps with initial prompt to user to select a date and museum
                                    onKeyDown={e => e.preventDefault()}/>
                            )}
                            value={formValues.date}
                            disablePast
                            onChange={handleInputChange}
                            disabled={formValues.museum === ""}
                            // inputProps={{style: { textAlign: 'center' }}}

                        />
                    </LocalizationProvider>
                </div>
                <CardContent>
                    <Typography
                        style={{textAlign: 'center'}}
                        hidden={formValues.date === null || formValues.date === "" || formValues.museum === ""}
                    >
                        Total Number of Passes Available: {
                        formValues.initialNumPasses
                        // numPasses !== undefined ? numPasses : "0"
                    }
                    </Typography>
                    <Typography
                        style={{textAlign: 'center'}}
                        hidden={formValues.date !== null && formValues.date !== "" && formValues.museum !== ""}

                    >
                        Please select a date of visit and museum.
                    </Typography>
                </CardContent>
                <Button
                    color="primary"
                    type="button"
                    href={"https://www.eventkeeper.com/mars/tkflex.cfm?curOrg=BOSTON&curNumDays=60&curKey2=AVA&curKey1=" + nameForURL + "&curPassStartDate=" + dateForURL}
                    target="_blank"
                    variant="contained"
                    disabled={formValues.initialNumPasses === "0" || formValues.initialNumPasses === ""}
                >
                    Reserve Pass
                </Button>
                <br/><br/>
                <Button
                    color="primary"
                    type="button"
                    variant="contained"
                    onClick={handleExpandClick}
                    disabled={formValues.date === null || formValues.date === "" || formValues.museum === ""}
                >
                    Notify Me
                </Button>
                <CardActions disableSpacing>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography>
                            Enter your email address and/or phone number to be notified when the next pass becomes available.
                        </Typography>
                        <div>
                            <TextField
                                id="email"
                                label="Email"
                                name="email"
                                style={{ width: 300 }}
                                type="email"
                                value={formValues.email}
                                variant="standard"
                                onChange={handleInputChange}
                            />
                            <FormControl variant="standard">
                                <InputLabel htmlFor="formatted-phone-input">
                                    Phone
                                </InputLabel>
                                <Input
                                    id="formatted-phone-input"
                                    inputComponent={TextMaskCustom}
                                    name="phone"
                                    style={{ width: 300 }}
                                    value={formValues.phone}
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                        </div>
                        <br/><br/>
                        <Button
                            color="primary"
                            type="submit"
                            variant="contained"
                            disabled={formValues.email === "" && formValues.phone === ""}
                        >
                            Submit
                        </Button>
                    </CardContent>
                </Collapse>
                <div>Last scraped: {props.lastScraped}</div>
            </Card>
        </Box>
    );
};

export default Form;
