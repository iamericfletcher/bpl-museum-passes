import * as React from "react";
import Box from "@mui/material/Box";
import Form from "../src/components/form/Form";
import axios from "axios";
import * as cheerio from "cheerio";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Nav from "../src/components/Nav";
import moment from "moment";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "pink",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  // color: 'pink'
}));
export default function Index(props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Item sx={{ height: "9vh" }}>
            <Nav />
          </Item>
        </Grid>
        {/*<Grid item xs={12} sm={6} md={6}>*/}
        {/*    <Item sx={{height: "79vh"}}>About</Item>*/}
        {/*</Grid>*/}
        <Grid item xs={12} sm={12} md={12}>
          <Item sx={{ minHeight: "79vh" }}>
            <Form {...props} />
          </Item>
        </Grid>
        <Grid item xs={12} md={12}>
          <Item sx={{ height: "9vh" }}>Footer Bottom</Item>
        </Grid>
      </Grid>
    </Box>
  );
}

export async function getStaticProps() {
  console.log("getStaticProps initialized");
  const museumNamesForSelectField = [];
  const museumNamesForScraping = [];
  // NEED TO INSERT OBJECT FOR STORING THE SCRAPED DATA
  const museumObj = {};

  const { data } = await axios.get(
    "https://www.eventkeeper.com/mars/tkflex.cfm?curOrg=BOSTON&curNumDays=1"
  );
  var $ = cheerio.load(data);
  const lastScraped = new Date().toISOString();

  // Query HTML for names of the museums to use in the select menu
  const names = $("#sel1\\ curKey1").find("option");
  names.each((i, option) => {
    if ($(option).text() !== "All Passes" && $(option).text() !== "Old Sturbridge Village") {
      // Format the names of the museum to be used in the select menu in the browser
      museumNamesForSelectField.push($(option).text().toString().split("(")[0]);
      // Add the names of the museums to be iterated over in below loops
      museumNamesForScraping.push($(option).text().toString());
    }
  });
  // Need to create a delay, otherwise the site's server will error out with a 500 status error
  const delay = (ms = 5000) => new Promise((r) => setTimeout(r, ms));
  const scrapeSequentially = async () => {
    for (let i = 0; i < museumNamesForScraping.length; i++) {
      const res = await fetch(
        "https://www.eventkeeper.com/mars/tkflex.cfm?curOrg=BOSTON&curNumDays=30&curKey2=AVA&curKey1=" +
          museumNamesForScraping[i]
      )
        .then(await delay())
        .then((res) => res.text())
        .then((text) => {
          $ = cheerio.load(text);
        });
      // console.log("Current museum being scraped: " + museumNamesForScraping[i]);
      museumObj[museumNamesForSelectField[i]] = {};
      let tempDate = "";
      let nextDate = "";
      let numberPassesAvailCount = 0;
      let hidePassCount = true;



      const foo = $(".pr_container_left").filter((j, el) => {
        // Find instances of the class "pr_container_left" that have a button with date included in onClick URL
        // from this URL extract the date
        var button = $(el).find("button");
        // Check if that button has Request Pass text indicating that there is a pass available
        for (let k = 0; k < button.length; k++) {
          if ($(button[k]).text().includes("Request Pass")) {
            nextDate = button
              .attr("onclick")
              .match(/(?<=Date=).+?(?=&cham)/g)
              .toString();
            if (nextDate !== tempDate) {
              tempDate = nextDate;
              if (!hidePassCount) {
                // console.log("Number of passes available: " + numberPassesAvailCount);
                museumObj[museumNamesForSelectField[i]][moment(tempDate).format("YYYY-MM-DD")] =
                  numberPassesAvailCount;
              }
              // console.log("Date: " + tempDate);
              museumObj[museumNamesForSelectField[i]][moment(tempDate).format("YYYY-MM-DD")] =
                  numberPassesAvailCount;
              numberPassesAvailCount = 0;
              hidePassCount = false;
            }
            numberPassesAvailCount = numberPassesAvailCount + 1;
          }
          museumObj[museumNamesForSelectField[i]][moment(tempDate).format("YYYY-MM-DD")] = numberPassesAvailCount;
        }
      });
      // console.log("Number of passes available: " + numberPassesAvailCount);
      if(numberPassesAvailCount === 0) {
        museumObj[museumNamesForSelectField[i]][moment(tempDate).format("YYYY-MM-DD")] = numberPassesAvailCount;
      }
    }
  };
  await scrapeSequentially();
  return {
    props: {
      lastScraped: lastScraped,
      museumNamesForSelectField: museumNamesForSelectField,
      museumObj: museumObj,
    },
    revalidate: 40,
  };
}
