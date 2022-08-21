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
        tickets: "",
        museum: "",
        email: "",
        phone: "",
    };
    const [formValues, setFormValues] = useState(defaultValues);
    const [dateOrMuseumClicked, setDateOrMuseumClicked] = useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [numPasses, setNumPasses] = useState("");
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
                // date: event.format('MM-DD-YYYY'),
                date: event.format('YYYY-MM-DD'),
            });
            setDateOrMuseumClicked(!dateOrMuseumClicked)
            console.log("dateOrMuseumClicked: ", dateOrMuseumClicked)
        } else if (!isMoment(event)) {
            setFormValues({
                ...formValues,
                [event.target.name]: event.target.value,
            });
            if(event.target.name === "museum") {
                setDateOrMuseumClicked(!dateOrMuseumClicked)
                console.log("dateOrMuseumClicked: ", dateOrMuseumClicked)
                console.log("Museum changed to: " + event.target.value)
                console.log("Date of Visit: " + formValues.date)
                // console.log(props.museumObj[event.target.value.toString()][formValues.date])
                setNumPasses(props.museumObj[event.target.value.toString()][formValues.date])
            }
        }
    };
    const handleExpandClick = () => {
        setExpanded(!expanded);
    }
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
        style={{ border: "1px solid black" }}
        component="form"
        onSubmit={handleSubmit}
      >
        <Card
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{ maxWidth: 450, minHeight: 350 }}
        >
          <CardHeader
            title="Boston Public Library"
            subheader="Museum Pass Notifier"
          />
          <CardMedia
            // style={{masx: "300px"}}
            // className={styles.cardMediaStyle}
            // style={styles.media}
            // media=""
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
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                        label="Date of Visit"
                        maxDate={setMaxDate(59)}
                        name="date"
                        renderInput={(params) => (
                            <TextField {...params} style={{ width: 380 }} />
                        )}
                        value={formValues.date}
                        disablePast
                        onChange={handleInputChange}
                        onOpen={() => {console.log("DatePicker open")}}
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
            {/*<div>*/}
            <CardActions disableSpacing>
                <ExpandMore
                    exapnded={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                <ExpandMoreIcon
                />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography>
                        Total Number of Passes Available: {
                        numPasses > 0 ? numPasses : "0"
                            // props.museumObj[formValues.museum][formValues.date]
                        // props.museumObj[formValues.museum][formValues.date] !== undefined ? props.museumObj[formValues.museum][formValues.date] : "No Passes Available"
                    }
                    </Typography>
                </CardContent>
                <CardContent>
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
                    {/*<Typography paragraph>Method:</Typography>*/}
                    {/*<Typography paragraph>*/}
                    {/*    Heat 1/2 cup of the broth in a pot until simmering, add saffron and set*/}
                    {/*    aside for 10 minutes.*/}
                    {/*</Typography>*/}
                    {/*<Typography paragraph>*/}
                    {/*    Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over*/}
                    {/*    medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring*/}
                    {/*    occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a*/}
                    {/*    large plate and set aside, leaving chicken and chorizo in the pan. Add*/}
                    {/*    pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,*/}
                    {/*    stirring often until thickened and fragrant, about 10 minutes. Add*/}
                    {/*    saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.*/}
                    {/*</Typography>*/}
                </CardContent>
            </Collapse>
          {/*    <Box*/}
          {/*        component="form"*/}
          {/*        padding="10%"*/}
          {/*        onSubmit={handleSubmit}*/}
          {/*        style={{border: "1px solid black"}}*/}
          {/*    >*/}
          {/*<div>*/}
          {/*  <LocalizationProvider dateAdapter={AdapterMoment}>*/}
          {/*    <DatePicker*/}
          {/*      label="Date of Visit"*/}
          {/*      maxDate={setMaxDate(59)}*/}
          {/*      name="date"*/}
          {/*      renderInput={(params) => (*/}
          {/*        <TextField {...params} style={{ width: 380 }} />*/}
          {/*      )}*/}
          {/*      value={formValues.date}*/}
          {/*      disablePast*/}
          {/*      onChange={handleInputChange}*/}
          {/*    />*/}
          {/*  </LocalizationProvider>*/}
          {/*</div>*/}
          {/*<div>*/}
          {/*  <FormControl variant="standard">*/}
          {/*    <InputLabel id="museum-select">Museum</InputLabel>*/}
          {/*    <Select*/}
          {/*      id="standard-select-currency"*/}
          {/*      label="Museum"*/}
          {/*      labelId="museum-select"*/}
          {/*      name="museum"*/}
          {/*      style={{ width: 380, textAlign: "left" }}*/}
          {/*      value={formValues.museum}*/}
          {/*      variant="standard"*/}
          {/*      onChange={handleInputChange}*/}
          {/*    >*/}
          {/*      {props.museumNamesForSelectField.map((option) => (*/}
          {/*        <MenuItem key={option} value={option}>*/}
          {/*          {option}*/}
          {/*        </MenuItem>*/}
          {/*      ))}*/}
          {/*    </Select>*/}
          {/*  </FormControl>*/}
          {/*</div>*/}
          {/*<div>*/}
          {/*  <Accordion style={{ width: 380, alignContent: "center" }}>*/}
          {/*    <AccordionSummary*/}
          {/*      expandIcon={<ExpandMoreIcon />}*/}
          {/*      aria-controls="panel1a-content"*/}
          {/*      id="panel1a-header"*/}
          {/*      style={{}}*/}
          {/*    >*/}
          {/*      /!*<Typography>Select Date of Visit and Museum</Typography>*!/*/}
          {/*    </AccordionSummary>*/}
          {/*    <AccordionDetails style={{}}>*/}
          {/*      /!*<div>*!/*/}
          {/*      /!*  <TextField*!/*/}
          {/*      /!*    id="email"*!/*/}
          {/*      /!*    label="Email"*!/*/}
          {/*      /!*    name="email"*!/*/}
          {/*      /!*    style={{ width: 300 }}*!/*/}
          {/*      /!*    type="email"*!/*/}
          {/*      /!*    value={formValues.email}*!/*/}
          {/*      /!*    variant="standard"*!/*/}
          {/*      /!*    onChange={handleInputChange}*!/*/}
          {/*      /!*  />*!/*/}
          {/*      /!*  <FormControl variant="standard">*!/*/}
          {/*      /!*    <InputLabel htmlFor="formatted-phone-input">*!/*/}
          {/*      /!*      Phone*!/*/}
          {/*      /!*    </InputLabel>*!/*/}
          {/*      /!*    <Input*!/*/}
          {/*      /!*      id="formatted-phone-input"*!/*/}
          {/*      /!*      inputComponent={TextMaskCustom}*!/*/}
          {/*      /!*      name="phone"*!/*/}
          {/*      /!*      style={{ width: 300 }}*!/*/}
          {/*      /!*      value={formValues.phone}*!/*/}
          {/*      /!*      onChange={handleInputChange}*!/*/}
          {/*      /!*    />*!/*/}
          {/*      /!*  </FormControl>*!/*/}
          {/*      /!*</div>*!/*/}
          {/*    </AccordionDetails>*/}
          {/*  </Accordion>*/}
          {/*</div>*/}
          {/*/!*<div>*!/*/}
          {/*/!*    <TextField*!/*/}
          {/*/!*        id="email"*!/*/}
          {/*/!*        label="Email"*!/*/}
          {/*/!*        name="email"*!/*/}
          {/*/!*        style={{width: 380}}*!/*/}
          {/*/!*        type="email"*!/*/}
          {/*/!*        value={formValues.email}*!/*/}
          {/*/!*        variant="standard"*!/*/}
          {/*/!*        onChange={handleInputChange}*!/*/}
          {/*/!*    />*!/*/}
          {/*/!*</div>*!/*/}
          {/*/!*<FormControl variant="standard">*!/*/}
          {/*/!*    <InputLabel htmlFor="formatted-phone-input">Phone</InputLabel>*!/*/}
          {/*/!*    <Input*!/*/}
          {/*/!*        id="formatted-phone-input"*!/*/}
          {/*/!*        inputComponent={TextMaskCustom}*!/*/}
          {/*/!*        name="phone"*!/*/}
          {/*/!*        style={{width: 380}}*!/*/}
          {/*/!*        value={formValues.phone}*!/*/}
          {/*/!*        onChange={handleInputChange}*!/*/}
          {/*/!*    />*!/*/}
          {/*/!*</FormControl>*!/*/}
          <br />
          <br />
          <Button color="primary" type="submit" variant="contained">
            Submit
          </Button>
          <br />
          <br />
          <div>Last scraped: {props.lastScraped}</div>
          {/*    </Box>*/}
        </Card>
      </Box>
    );

};

export default Form;
