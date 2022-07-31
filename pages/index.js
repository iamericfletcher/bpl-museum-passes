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
import {Grid, Paper} from "@mui/material";
import {styled} from "@mui/material/styles";
import Nav from "../src/components/Nav";
import {TextField} from "@material-ui/core";
import MenuItem from "@mui/material/MenuItem";

const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#a3a3a3',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
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
                        <Box
                            height="100%"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Box
                                backgroundColor='#f7f7f8'
                                padding="10%"
                            >
                        <Form {...props}/>
                            </Box>
                        </Box>
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
    console.log('Museum name scraping from https://www.eventkeeper.com/mars/tkflex.cfm?curOrg=BOSTON');
    const museumNames = [];
    const {data} = await axios.get('https://www.eventkeeper.com/mars/tkflex.cfm?curOrg=BOSTON');
    const $ = cheerio.load(data);
    const foo = $('#sel1\\ curKey1').find('option');
    const lastScraped = new Date().toISOString();
    foo.each((i, option) => {
        if ($(option).text() !== "All Passes") {
            museumNames.push($(option).text());
            console.log($(option).text());
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

