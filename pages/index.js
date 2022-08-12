import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../ProTip';
import Link from '../src/components/Link';
import Copyright from '../src/components/Copyright';
import Form from '../src/components/form/Form';
import axios from "axios";
import * as cheerio from "cheerio";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {styled} from "@mui/material/styles";
import Nav from "../src/components/Nav";
import {error} from "next/dist/build/output/log";

const Item = styled(Paper)(({theme}) => ({
    backgroundColor: 'pink',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    // color: 'pink'
}));
export default function Index(props) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                    <Item sx={{height: "9vh"}}>
                        <Nav />
                    </Item>
                </Grid>
                {/*<Grid item xs={12} sm={6} md={6}>*/}
                {/*    <Item sx={{height: "79vh"}}>About</Item>*/}
                {/*</Grid>*/}
                <Grid item xs={12} sm={12} md={12}>
                    <Item sx={{height: "79vh"}}>
                        <Form {...props}/>
                    </Item>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Item sx={{height: "9vh"}}>Footer Bottom</Item>
                </Grid>
            </Grid>
        </Box>

    );
}
export async function getStaticProps() {
    // Scrape the HTML museum pass page
    console.log("getStaticProps initialized");
    const museumNamesForSelectField = [];
    const museumNamesForScraping = [];
    const museumsWithPasses = [];
    const lastScraped = new Date().toISOString();

    const {data} = await axios.get('https://www.eventkeeper.com/mars/tkflex.cfm?curOrg=BOSTON&curNumDays=1');
    var $ = cheerio.load(data);

    // Query HTML for names of the museums to use in the select menu
    const names = $('#sel1\\ curKey1').find('option');
    names.each((i, option) => {
        if ($(option).text() !== "All Passes") {
            // Format the name of the museum to be used in the select menu
            museumNamesForSelectField.push($(option).text().toString().split('(')[0]);
            // Format the name to use to scrape data for each museum
            museumNamesForScraping.push($(option).text().toString());
        }
    });
    let count = 0;
    const delay = (ms = 5000) => new Promise(r => setTimeout(r, ms));
    const scrapeSequentially = async () => {
    for (let i = 0; i < museumNamesForScraping.length; i++) {
            const res = await (fetch("https://www.eventkeeper.com/mars/tkflex.cfm?curOrg=BOSTON&curNumDays=1&curKey2=AVA&curKey1=" + museumNamesForScraping[i])).then(await delay())
                .then(res => res.text())
                .then(text => {
                    $ = cheerio.load(text);
                });
            console.log("Current museum being scraped: " + museumNamesForScraping[i]);
            const foo = $('.pr_container_left').filter((i, el) => {
                // Find instances of the class "pr_container_left" that have a button with date included in onClick URL
                // that matches the date of visit provided by user in form
                var button = $(el).find('button');
                // Check if that button has Request Pass text indicating that there is a pass available
                if (/\s*Request\s*Pass\s*/gi.test(button.text())) {
                    count = count + 1;
                    const nameButton = $(el).find('input[type="button"]');
                    museumsWithPasses[count] = {
                        name: nameButton
                            .val()
                            .substring(0, nameButton.val().indexOf("("))
                            .trim(),
                        date: button
                            .attr("onclick")
                            .match(/(?<=Date=).+?(?=&cham)/g)
                            .toString(),
                    };
                }
            });
    }
        return museumsWithPasses;
    }
    console.log(await scrapeSequentially());
    return {
        props: {
            // axiosScrapeData: data,
            // importantInfo: importantInfo,
            lastScraped: lastScraped,
            museumNamesForSelectField: museumNamesForSelectField,
            // museumNames: museumNames,
            museumsWithPasses: museumsWithPasses
        },
        revalidate: 40,
    }
}

