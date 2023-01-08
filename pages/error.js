import React, {Component} from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {styled} from "@mui/material/styles";
import Paper from "@material-ui/core/Paper";

class Error extends Component {
    render() {
        const Item = styled(Paper)(({theme}) => ({
            backgroundColor: theme.palette.mode === 'dark' ? 'pink' : 'pink',
            ...theme.typography.body2,
            padding: theme.spacing(1),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            maxWidth: '70%'
        }));
        return (
            <div>
                <Box sx={{flexGrow: 1}}>
                    <Grid
                        container
                        spacing={2}
                        height={'100vh'}
                    >
                        <Grid
                            md={12}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                        >
                            <Item>
                                <Typography variant={"h3"} color={'deeppink'}>
                                    Oh dear,<br/> something went wrong.
                                </Typography>
                                <hr/>
                                <Typography variant={"h6"} color={'deeppink'}>
                                    Things should be back to normal soon!
                                </Typography>
                                <br/>
                                <Typography variant={"subtitle1"}>
                                    Please reload the page again in a few minutes.
                                </Typography>
                                <br/>
                                <Typography variant={"body1"}>
                                    If the problem persists, please send us an email.
                                </Typography>
                                <br/>
                                <Typography variant={"body1"}>
                                    <a href="mailto:EricFletcher3@gmail.com">EricFletcher3@gmail.com</a>
                                </Typography>
                            </Item>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        );
    }
}

export async function getServerSideProps() {
    console.log("getServerSideProps() from error.js");
    // Upon reload of page, check the cache to see if anything is there
    const res = await fetch(process.env.SERVER_URL)
        .then(res => res.json())
        .catch(res => res)
    if (!res.message) {
        // redirect user to index page if cache is included from server
        console.log("Cache is no longer null from error.js");
        return {
            props: {},
            redirect: {
                destination: '/',
                permanent: true,
            },
        }
    }
    console.log("Cache is null from error.js");
    return {
        props: {},
    }
}

export default Error;