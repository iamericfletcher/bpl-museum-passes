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
// import {env} from "../.env"
// import {env} from "eslint-config-next";

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

  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  const mailgun = require("mailgun-js");
  const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
  const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
  const mg = mailgun({apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN});
  const data2 = {
    // from: 'Excited User <me@samples.mailgun.org>',
    from: `bpl-pass-notification@${MAILGUN_DOMAIN}`,
    to: 'EricFletcher3@gmail.com',
    // to: 'bar@example.com, YOU@YOUR_DOMAIN_NAME',
    subject: 'Museum Pass Notification',
    text: 'Greetings! This is a notification that a museum pass has become available.\n\n' +
        'Please visit the link below to reserve this pass.\n\n' +
        'Note that this is first come first serve, so the quicker you visit the link, the better chances you have of securing the pass!\n\n' +
        'Sincerely,\n\n' +
        'Eric Fletcher\n' +
        'BPL Pass Notification Developer'
  };

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
        for (let j = 0; j < Object.keys(museumObj).length; j++) {
            // if museumObj key matches dataFromPrisma key, update dataFromPrisma value with museumObj value
            if (Object.keys(museumObj)[j] === dataFromPrisma[i].museum) {
              // If the current date is +1 over the users date of visit, update the database and remove the row of data
              if (!moment().endOf('day').isSameOrBefore(moment(dataFromPrisma[i].dateOfVisit).endOf('day'))) {
                const deleteRequest = await prisma.request.delete({
                  where: {
                    id: dataFromPrisma[i].id
                  }
                });
              } else {
                // Send email and/or mobile phone notification if the current number of passes available is greater
                // than the initial number of passes available from the database
                if (museumObj[Object.keys(museumObj)[j]][dataFromPrisma[i].dateOfVisit] !== undefined && dataFromPrisma[i].initialNumPasses < museumObj[Object.keys(museumObj)[j]][dataFromPrisma[i].dateOfVisit]) {
                  mg.messages().send(data2, function (error, body) {
                    console.log(body);
                  });
                  client.messages
                      .create({
                        body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
                        from: '+18145606408',
                        to: '+1' + dataFromPrisma[i].phone.trim().replace(/[^0-9]/g, '')
                      })
                      .then(message => console.log(message.sid));
                  const deleteRequest = await prisma.request.delete({
                    where: {
                      id: dataFromPrisma[i].id
                    }
                  });
                }
              }
            }
        }
    }
  return {
    props: {
      lastScraped: lastScraped,
      museumNamesForSelectField: museumNamesForSelectField,
      museumNamesForScraping: museumNamesForScraping,
      museumObj: museumObj,
    },
    revalidate: 600,
  };
}
