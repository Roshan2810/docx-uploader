import { Button, Grid, TextField, Typography } from '@material-ui/core';
import { useState } from 'react';

const style = {
    marginTop: '10vh',
    textAlign: 'center',
}

const btnStyle = {
    marginTop: '1%'
}

const textFieldStyle = {
    margin: '1%'
}


const App = () => {

    const [textFieldValue, setTextFieldValue] = useState({
        fname: "",
        jobId: "",
        authToken: ""
    });

    const makeDownloadDocxAPICall = () => {
        fetch('http://localhost:3001/download-docx', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fname: textFieldValue.fname,
                jobId: textFieldValue.jobId,
                authToken: textFieldValue.authToken
            })
        })
            .then(async res => {
                if (res.ok) {
                    res.blob().then(data => {
                        let url = URL.createObjectURL(data);
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute(
                            'download',
                            textFieldValue.fname,
                        );

                        // Append to html link element page
                        document.body.appendChild(link);

                        // Start download
                        link.click();

                        // Clean up and remove the link
                        link.parentNode.removeChild(link);
                    })
                }
            })
    }
    return (
        <div style={style}>
            <Typography variant="h2">Download DOCX</Typography>
            <Grid container>
                <Grid item xs={12} sm={12} xl={12} lg={12}>
                    <TextField
                        style={textFieldStyle}
                        placeholder="FileName"
                        variant="outlined"
                        value={textFieldValue.fname}
                        onChange={e => {
                            setTextFieldValue(prevState => ({ ...prevState, fname: e.target.value }))
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} xl={12} lg={12}>
                    <TextField
                        style={textFieldStyle}
                        placeholder="JobId"
                        variant="outlined"
                        value={textFieldValue.jobId}
                        onChange={e => {
                            setTextFieldValue(prevState => ({ ...prevState, jobId: e.target.value }))
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} xl={12} lg={12}>
                    <TextField
                        style={textFieldStyle}
                        placeholder="auth-token"
                        variant="outlined"
                        value={textFieldValue.authToken}
                        onChange={e => {
                            setTextFieldValue(prevState => ({ ...prevState, authToken: e.target.value }))
                        }}
                    />
                </Grid>
            </Grid>
            <div style={btnStyle}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={makeDownloadDocxAPICall}
                >
                    Download DOCX
                </Button>
            </div>
        </div >
    );
}

export default App;