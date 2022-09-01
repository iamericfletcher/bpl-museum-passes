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
import 'moment-timezone';
import Container from "@mui/material/Container";
// import prisma from '/lib/prisma.js';
import {PrismaClient} from "@prisma/client";

// import { PrismaClient } from "@prisma/client";

// import prisma from "../lib/prisma.js";

// console.log(prisma)


// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: "pink",
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: "center",
//   height: "100%"
//   // color: 'pink'
// }));
export default function Index(props) {
  return (
    <Container
        sx={{
          backgroundColor:"#f8edeb",
          // ...theme.typography.body2,
          // padding: theme.spacing(1),
          padding: 1,
          textAlign: "center",
          minHeight: "100vh",
          minWidth: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
          // flexGrow: 1
    }}
    >
          {/*<Item>*/}
            <Form {...props} />
          {/*</Item>*/}
    </Container>
  );
}

export async function getStaticProps() {
  console.log("getStaticProps initialized");
  var moment = require('moment-timezone');
  const prisma = new PrismaClient();
  const museumNamesForSelectField = [];
  const museumNamesForScraping = [];
  const museumObj = {};
  // const todaysDate = moment(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }).split(",")[0]).format("YYYY-MM-DD");
  const todaysDate = moment().format("YYYY-MM-DD");
  console.log("Today's Date up top: " + todaysDate);
  // todaysDate = moment(todaysDate).format("YYYY-MM-DD");
  // todaysDate.getTime();
  const { data } = await axios.get(
    "https://www.eventkeeper.com/mars/tkflex.cfm?curOrg=BOSTON&curNumDays=1"
  );
  var $ = cheerio.load(data);
  const lastScraped = new Date().toISOString();

  // Query HTML for names of the museums to use in the select menu
  const names = $("#sel1\\ curKey1").find("option");
  names.each((i, option) => {
    // if ($(option).text() !== "All Passes") {
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
        "https://www.eventkeeper.com/mars/tkflex.cfm?curOrg=BOSTON&curNumDays=60&curKey2=AVA&curKey1=" +
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

  // get data from prisma database
    const dataFromPrisma = await prisma.request.findMany();
  console.log(dataFromPrisma)
    // iterate over data from prisma database
    for (let i = 0; i < dataFromPrisma.length; i++) {
      // iterate over museumObj
      // console.log("Museum: " + dataFromPrisma[i].museum);
        for (let j = 0; j < Object.keys(museumObj).length; j++) {
            // if museumObj key matches dataFromPrisma key, update dataFromPrisma value with museumObj value
          // console.log("Object Key: " + Object.keys(museumObj)[j])
          // console.log("museumObj count: " + museumObj[Object.keys(museumObj)[j]][dataFromPrisma[i].date])
            if (Object.keys(museumObj)[j] === dataFromPrisma[i].museum) {
              // console log the values of the museumObj
              // console.log("todaysDate: " + moment(todaysDate.split(",")[0]).format("YYYY-MM-DD"));
              // moment(todaysDate).isSameOrBefore(moment(dataFromPrisma[i].date).format("YYYY-MM-DD"));
              // console.log("todaysDate: " + todaysDate);
              // console.log(moment(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })))
                // console.log("Moment dataFromPrisma[i].date: " + moment(dataFromPrisma[i].dateOfVisit, "YYYY-MM-DD"));
              // console.log("Date() dataFromPrisma[i].date: " + new Date(dataFromPrisma[i].dateOfVisit));
                // console.log(moment(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })))
              console.log(moment().endOf('day'))
              console.log(moment(dataFromPrisma[i].dateOfVisit).endOf('day'))
              // console.log(moment.tz(dataFromPrisma[i].dateOfVisit, "America/New_York"))
                moment().endOf('day').isSameOrBefore(moment(dataFromPrisma[i].dateOfVisit).endOf('day')) ? console.log("current date is same or before Prisma date") : console.log("current date is not same or before Prisma date");
              console.log()
              console.log()
              // If the current date is +1 over the users date of visit, update the database and remove the row of data
              if (!moment().endOf('day').isSameOrBefore(moment(dataFromPrisma[i].dateOfVisit).endOf('day'))) {
                const deleteRequest = await prisma.request.delete({
                  where: {
                    id: dataFromPrisma[i].id
                  }
                });
              }

              // moment(todaysDate.split(",")[0]).format("YYYY-MM-DD")
              // console.log("Pass number in museumObj: " + museumObj[Object.keys(museumObj)[j]][dataFromPrisma[i].dateOfVisit]);
              // console.log("Pass number in dataFromPrisma: " + dataFromPrisma[i].dateOfVisit);
              // console.log("Pass number in dataFromPrisma: " + dataFromPrisma[i].initialNumPasses);

              // for ( var key in museumObj[Object.keys(museumObj)[j]]) {
              //   if (key === dataFromPrisma[i].date) {
              //     dataFromPrisma[i].count = museumObj[Object.keys(museumObj)[j]][key];
              //     console.log("Count: " + dataFromPrisma[i].count);
              //   }
              // }
              // console.log("Museum name: " + dataFromPrisma[i].museum);
              // console.log("Date: " + dataFromPrisma[i].dateOfVisit);
            // dataFromPrisma[i].data = museumObj[Object.keys(museumObj)[j]];
            }
        }
      // console.log("Museum name from DB: " + dataFromPrisma[i].museum);
      //   console.log("Date from DB: " + dataFromPrisma[i].dateOfVisit);
      // if the date in the prisma database is not in the museumObj, add it to the museumObj
      // if (!museumObj[dataFromPrisma[i].museum].hasOwnProperty(dataFromPrisma[i].date)) {
      //   museumObj[dataFromPrisma[i].museum][dataFromPrisma[i].date] = 0;
      // }
    }


  return {
    props: {
      lastScraped: lastScraped,
      museumNamesForSelectField: museumNamesForSelectField,
      museumNamesForScraping: museumNamesForScraping,
      museumObj: museumObj,
    },
    revalidate: 40,
  };
}
