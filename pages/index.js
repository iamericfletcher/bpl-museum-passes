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
import {TextField} from "@material-ui/core";
import MenuItem from "@mui/material/MenuItem";

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
    // Scrape the names of museums from the museum pass page
    console.log('Museum name scraping from https://www.eventkeeper.com/mars/tkflex.cfm?curOrg=BOSTON&curNumDays=1');
    const museumNames = [];
    const {data} = await axios.get('https://www.eventkeeper.com/mars/tkflex.cfm?curOrg=BOSTON&curNumDays=1');
    const $ = cheerio.load(data);
    const foo = $('.pr_container_left').filter((i, el) => {
        var button = $(el).find('button[onClick*="8/7/2022"]');
        if (/\s*Request\s*Pass\s*/gi.test(button.text())) {
            var nameButton = $(el).find('input[type="button"]');
            console.log(nameButton.val().substring(0, nameButton.val().indexOf('(')));
        }
    });
    // const foo = $('.pr_container_left:contains("Request Pass")').find('button[onClick*="8/7/2022"]').closest('.bs-example');
    // const bar = foo.find('button');
    console.log(foo.length);
    const names = $('#sel1\\ curKey1').find('option');
    const lastScraped = new Date().toISOString();
    names.each((i, option) => {
        if ($(option).text() !== "All Passes") {
            museumNames.push($(option).text().toString().split('(')[0]);
        }
    });
    console.log('Museum name scraping complete');
    return {
        props: {
            museumNames: museumNames,
            lastScraped: lastScraped
        },
        revalidate: 40,
    }
}

