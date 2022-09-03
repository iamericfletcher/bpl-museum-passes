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
import moment, {isMoment} from "moment";
import {ButtonGroup, Card, CardContent, CardHeader, CardMedia, Collapse, Tooltip, tooltipClasses} from "@mui/material";
// import notificationImage from "/notification-image.png";
import Typography from "@mui/material/Typography";
import {styled} from "@mui/material/styles";
// import classes from "*.module.css";
// import {} from "../../../public/notification-image.png"
// import { prisma } from '/Users/ericfletcher/WebstormProjects/bpl-museum-passes/lib/prisma.js'
//
// console.log(prisma)


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
        initialNumPasses: 0,
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

    const CustomWidthTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))({
        [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: 150,
            textAlign: "center",
        },
    });

    const toolTipText = () => {
        if (formValues.museum === "" || formValues.date === null) {
            return "Please select museum name and date of visit"
        } else if (formValues.museum !== "" && formValues.date !== null && formValues.initialNumPasses === 0) {
            return "Disabled if no passes available"
        } else if (formValues.initialNumPasses > 0) {
            return "Click to reserve a pass via Boston Public Library"
        }
    };

    const toolTipTextSubmit = () => {
        if (formValues.email === "" && formValues.phone === "") {
            return "Please enter your email and/or phone number"
        } else if (formValues.email === "" && formValues.phone.length !== 14) {
            return "Phone number must be 10 digits"
        } else {
            return ""
        }
    };

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
                formValues.initialNumPasses = 0;
            } else {
                formValues.date = event.format('YYYY-MM-DD');
                formValues.initialNumPasses = props.museumObj[formValues.museum][event.format('YYYY-MM-DD')];
            }
            setDateForURL(event.format('MM/DD/YYYY'))
        } else if (!isMoment(event) && event !== null && event.target.name !== "email" && event.target.name !== "phone") {
            console.log("is not moment && event !== null")
            formValues.museum = event.target.value;
            if (event.target.name === "museum") {
                console.log("event.target.name === museum")
                if (props.museumObj[event.target.value.toString()][formValues.date] === undefined) {
                    formValues.initialNumPasses = 0;
                } else {
                    formValues.initialNumPasses = props.museumObj[event.target.value.toString()][formValues.date];
                }
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

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            console.log(formValues);
            const body = {
                museum: formValues.museum,
                dateOfVisit: formValues.date,
                initialNumPasses: formValues.initialNumPasses,
                email: formValues.email,
                phone: formValues.phone
            };
            console.log(body);
            await fetch(`/api/requests`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            })
            // await Router.push('/')
        } catch (error) {
            console.error(error)
        }
    }

    console.log("Phone length: " + formValues.phone.length)

    return (
        <Box
            alignItems="center"
            display="flex"
            height="100%"
            justifyContent="center"
            component="form"
            onSubmit={handleSubmit}
        >
            <Card
                display="flex"
                alignItems="center"
                justifyContent="center"
                style={{padding: 10, backgroundColor: "#FFFFFF"}}
                variant="outlined"
            >
                <CardHeader
                    title="Boston Public Library"
                    subheader={<Typography sx={{color: 'black',}}>Museum Pass Notifier</Typography>}
                />
                <CardMedia
                    height="5"
                    component="img"
                    image="/futuristic-ga407d83ce_640.png"
                />
                {/*<CardContent>*/}
                {/*<Typography variant="body2" color="black" fontSize={15}>*/}
                {/*    Select the museum name and date of visit*/}
                {/*    <br/>*/}
                {/*    <br/>*/}
                {/*    <b>If passes are available:</b>*/}
                {/*    <br/>*/}
                {/*    Click <b>Reserve Pass</b> to reserve a pass*/}
                {/*    <br/>*/}
                {/*    -or-*/}
                {/*    <br/>*/}
                {/*    Click <b>Notify Me</b> to receive a notification when the next pass is available*/}
                {/*    <br/>*/}
                {/*    <br/>*/}
                {/*    <b>If no passes are available:</b>*/}
                {/*    <br/>*/}
                {/*    Click <b>Notify Me</b> to receive a notification when the next pass is available*/}
                {/*</Typography>*/}
                {/*</CardContent>*/}
                <div>
                    <br/>
                    <Typography
                        style={{textAlign: 'center'}}
                        hidden={formValues.date !== null && formValues.date !== "" && formValues.museum !== ""}

                    >
                        Select Museum Name Then Date of Visit
                    </Typography>
                    <br/>
                    <FormControl variant="standard">
                        <InputLabel id="museum-select">Museum Name</InputLabel>
                        <Select
                            id="standard-select-currency"
                            label="Museum"
                            labelId="museum-select"
                            name="museum"
                            style={{width: 320, textAlign: "left"}}
                            value={formValues.museum}
                            variant="standard"
                            onChange={handleInputChange}
                            onOpen={() => {
                                console.log("Museum Select open")
                            }}
                        >
                            {props.museumNamesForSelectField.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <br/>
                <div>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                            label="Date of Visit"
                            maxDate={setMaxDate(59)}
                            name="date"
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    style={{width: 320}}
                                    // Prevent user from typing in a date
                                    // Helps with initial prompt to user to select a date and museum
                                    onKeyDown={e => {
                                        if (e.key !== "Tab" && e.key !== "Enter") {
                                            e.preventDefault()
                                        }
                                    }}
                                />
                            )}
                            value={formValues.date}
                            disablePast
                            onChange={handleInputChange}
                            disabled={formValues.museum === ""}

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
                    }
                    </Typography>
                </CardContent>
                {/*<br/>*/}
                <ButtonGroup
                    // variant={"contained"}
                    // aria-label="outlined primary button group"
                    size={"medium"}
                >
                    <CustomWidthTooltip
                        enterTouchDelay={50}
                        // disableHoverListener={formValues.initialNumPasses > 0}
                        title={toolTipText()}
                        >
                        <span>
                        <Button
                            color="primary"
                            type="button"
                            href={"https://www.eventkeeper.com/mars/tkflex.cfm?curOrg=BOSTON&curNumDays=60&curKey2=AVA&curKey1=" + nameForURL + "&curPassStartDate=" + dateForURL}
                            target="_blank"
                            variant="contained"
                            sx={{width: 150, marginRight: 0.5, height: "100%"}}
                            disabled={formValues.initialNumPasses === 0 || formValues.initialNumPasses === ""}
                        >
                            Reserve Pass
                        </Button>
                            </span>
                    </CustomWidthTooltip>
                    <br/><br/>
                    <CustomWidthTooltip
                        enterTouchDelay={50}
                        title={
                        formValues.museum === "" || formValues.date === null ? "Please select museum name and date of visit" : "Get notified when next pass becomes available"
                    }
                    >
                        <span>
                    <Button
                        color="primary"
                        type="button"
                        variant="contained"
                        onClick={handleExpandClick}
                        sx={{width: 150, height: "100%"}}
                        disabled={formValues.date === null || formValues.date === "" || formValues.museum === ""}
                    >
                        Notify Me
                    </Button>
                            </span>
                    </CustomWidthTooltip>

                </ButtonGroup>
                {/*<CardActions disableSpacing>*/}
                {/*</CardActions>*/}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <CardContent
                            style={{
                                // display:'flex',
                                // width: 398,
                                padding: 10
                                // alignItems: "center",
                                // justifyContent: "center"
                            }}
                        >
                            <br/>
                            <Typography>
                                Enter Email and/or Mobile Phone
                            </Typography>
                            <br/>
                            <div style={{justifyContent: 'center'}}>
                                <TextField
                                    id="email"
                                    label="Email"
                                    name="email"
                                    style={{width: 300}}
                                    type="email"
                                    value={formValues.email}
                                    variant="standard"
                                    onChange={handleInputChange}
                                />
                                <br/><br/>
                                <FormControl variant="standard">
                                    <InputLabel htmlFor="formatted-phone-input">
                                        Phone
                                    </InputLabel>
                                    <Input
                                        id="formatted-phone-input"
                                        inputComponent={TextMaskCustom}
                                        name="phone"
                                        style={{width: 300}}
                                        value={formValues.phone}
                                        onChange={handleInputChange}
                                    />
                                </FormControl>
                            </div>
                            <br/>
                            <CustomWidthTooltip
                            title={toolTipTextSubmit()}
                            sx={{padding: 1.5}}
                            >
                                <span>
                            <Button
                                sx={{width: 150, height: 48}}
                                // size={"medium"}
                                color="primary"
                                type="submit"
                                variant="contained"
                                disabled={(formValues.email === "" && formValues.phone === "") || formValues.email === "" && formValues.phone.length !== 14}
                            >
                                Submit
                            </Button>
                                    </span>
                            </CustomWidthTooltip>
                        </CardContent>
                    </div>
                </Collapse>


                <div>
                    <Typography fontSize={12}>
                        <br/>
                        Last scraped: {props.lastScraped}
                    </Typography>
                </div>
            </Card>
        </Box>
    );
};

export default Form;
