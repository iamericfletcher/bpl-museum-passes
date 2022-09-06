import * as React from "react";
import {useRef, useState} from "react";
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
import {
    ButtonGroup,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Collapse,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Tooltip,
    tooltipClasses
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {styled} from "@mui/material/styles";
import BuyMeACoffeeButton from "../BuyMeACoffeeButton";
import ReCAPTCHA from "react-google-recaptcha";


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
    const defaultValues = {
        date: null,
        initialNumPasses: 0,
        museum: "",
        email: "",
        phone: "",
        nameForURL: "",
        dateForURL: "",
        url: "",
    };
    const [formValues, setFormValues] = useState(defaultValues);
    const [expanded, setExpanded] = React.useState(false);
    const [nameForURL, setNameForURL] = useState("");
    const [dateForURL, setDateForURL] = useState("");
    const reRef = useRef();

    const CustomWidthTooltip = styled(({className, ...props}) => (
        <Tooltip {...props} classes={{popper: className}}/>
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
        } else if (formValues.email === "" && formValues.phone !== "" && formValues.phone.length !== 14) {
            return "Phone number must be 10 digits"
        } else if (formValues.email !== "" && formValues.phone !== "" && formValues.phone.length !== 14) {
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
            if (props.museumObj[formValues.museum][event.format('YYYY-MM-DD')] === undefined) {
                formValues.date = event.format('YYYY-MM-DD');
                formValues.initialNumPasses = 0;
            } else {
                formValues.date = event.format('YYYY-MM-DD');
                formValues.initialNumPasses = props.museumObj[formValues.museum][event.format('YYYY-MM-DD')];
            }
            setDateForURL(event.format('MM/DD/YYYY'))
            formValues.dateForURL = event.format('MM/DD/YYYY')
        } else if (!isMoment(event) && event !== null && event.target.name !== "email" && event.target.name !== "phone") {
            formValues.museum = event.target.value;
            if (event.target.name === "museum") {
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
                    if (props.museumNamesForScraping[i].toString().split("(")[0] === event.target.value) {
                        setNameForURL(props.museumNamesForScraping[i].toString())
                        formValues.nameForURL = props.museumNamesForScraping[i].toString()
                    }
                }
                formValues.url = "https://www.eventkeeper.com/mars/tkflex.cfm?curOrg=BOSTON&curNumDays=60&curKey2=AVA&curKey1=" + nameForURL + "&curPassStartDate=" + dateForURL
            }
        } else {
            setFormValues({
                ...formValues,
                [event.target.name]: event.target.value
            });
        }
    };
    const handleExpandClick = () => {
        setExpanded(!expanded);
        // Phone number label doesn't hold when notify me button is clicked and then no longer expanded then reopened
        //TODO fix this
        if (!expanded) {
            setFormValues({
                ...formValues,
                // email: "",
                phone: "",
            });
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const token = await reRef.current.executeAsync();
            reRef.current.reset();
            const body = {
                museum: formValues.museum,
                dateOfVisit: formValues.date,
                initialNumPasses: formValues.initialNumPasses,
                email: formValues.email,
                phone: formValues.phone,
                url: formValues.url,
            };
            await fetch(`/api/requests`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({body: body, token: token}),
            })
            setFormValues({
                ...formValues,
                museum: "",
                date: null,
                email: "",
                phone: "",
                initialNumPasses: 0
            });
            setExpanded(!expanded);
            // await Router.push('/')
        } catch (error) {
            console.error(error)
        }
    }

    const [open, setOpen] = React.useState(true);
    const handleClose = () => {
        setOpen(!open);
    };

    return (

        <Box
            alignItems="center"
            height="100%"
            justifyContent="center"
            component="form"
            onSubmit={handleSubmit}
        >
            <div>
                {/*<Button onClick={handleClickOpen('paper')}>scroll=paper</Button>*/}
                {/*<Button onClick={handleClickOpen('body')}>scroll=body</Button>*/}
                <Dialog
                    open={open}
                    onClose={handleClose}
                    scroll={'paper'}
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                >
                    <DialogTitle id="scroll-dialog-title">Instructions</DialogTitle>
                    <DialogContent dividers>
                        <DialogContentText
                            id="scroll-dialog-description"
                            // ref={descriptionElementRef}
                            tabIndex={-1}
                        >
                            <b>Step 1:</b> <br/>Select the museum name from the dropdown menu. <br/> <br/>
                            <b>Step 2:</b> <br/>Select the date you want to visit the museum. <br/> <br/>
                            Note that data is provided for the next 60 days only. <br/> <br/>
                            <b>Step 3:</b> <br/>
                            <mark><u>If <b>TOTAL NUMBER OF PASSES AVAILABLE</b> is 0</u></mark><br/> <br/>
                            Click the <b>NOTIFY ME</b> button to receive an email notification when the next pass becomes available (due to cancellations, etc.)
                            <br/> <br/>
                            <mark><u>If <b>TOTAL NUMBER OF PASSES AVAILABLE</b> is greater than 0</u></mark><br/> <br/>
                            Click the <b>RESERVE PASS</b> button to reserve a pass via the <a href="https://www.bpl.org/reserve-a-museum-pass/" target={'_blank'}>Boston Public Library Museum Passes website</a>.
                            <br/>
                            <br/>
                            OR
                            <br/>
                            <br/>
                            Click the <b>NOTIFY ME</b> button to receive an email notification when the next pass becomes available (due to cancellations, etc.)
                            <br/>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                size={"invisible"}
                ref={reRef}
            />
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
                <ButtonGroup
                    size={"medium"}
                >
                    <CustomWidthTooltip
                        enterTouchDelay={100}
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
                        enterTouchDelay={100}
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
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <CardContent
                            style={{
                                padding: 10
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
                                enterTouchDelay={100}
                            >
                                <span>
                            <Button
                                sx={{width: 150, height: 48}}
                                color="primary"
                                type="submit"
                                variant="contained"
                                disabled={(formValues.email === "" && formValues.phone === "") || formValues.email === "" && formValues.phone.length !== 14 || formValues.email !== "" && formValues.phone !== "" && formValues.phone.length !== 14}
                            >
                                Submit
                            </Button>
                                    </span>
                            </CustomWidthTooltip>
                        </CardContent>
                    </div>
                </Collapse>
                <br/> <br/>
                <span>
                <Button
                    color={"warning"}
                    type="button"
                    variant="contained"
                    sx={{width: 150, marginRight: 0.5, height: "100%"}}
                    onClick={handleClose}
                >
                    Instructions
                </Button>
                </span>
            </Card>
            <br/>
            <BuyMeACoffeeButton/>
            <div>
                <Typography fontSize={12}>
                    <br/>
                    Last scraped: {props.lastScraped}
                </Typography>
            </div>
        </Box>

    );
};

export default Form;
