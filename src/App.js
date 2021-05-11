import React from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import { Button, Typography } from '@material-ui/core';
import mammoth from 'mammoth';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: []
        }
    }

    handleUpload = () => {
        const jsonFile = new XMLHttpRequest();
        const blobUrl = URL.createObjectURL(this.state.files);

        jsonFile.open('GET', blobUrl, true);
        jsonFile.send();
        jsonFile.responseType = 'arraybuffer';
        jsonFile.onreadystatechange = () => {
            if (jsonFile.readyState === 4 && jsonFile.status === 200) {
                mammoth.convertToHtml(
                    { arrayBuffer: jsonFile.response },
                    { includeDefaultStyleMap: true },
                )
                    .then((result) => {
                        fetch('http://localhost:8080/uploadHtml', {
                            method: 'post',
                            body: JSON.stringify({ data: result.value }),
                            headers: { "Content-type": "applicatio/json" }
                        })
                    })
                    .catch((a) => {
                        console.log('alexei: something went wrong', a);
                    })
                    .done();
            }
        };
    }

    setFileState = (file) => {
        this.setState({ files: file[0] })
    }

    render() {
        const divStyle = {
            width: '50%',
            position: 'absolute',
            top: '25%',
            left: "25%",
            textAlign: 'center'
        }
        return (
            <div style={divStyle}>
                <Typography variant="h2">DOCX Uploader POC</Typography>
                <DropzoneArea
                    onChange={this.setFileState}
                    acceptedFiles={[".docx"]}
                    showFileNames
                    maxFileSize={20000000}
                />
                <Button onClick={this.handleUpload} style={{ marginTop: '1%' }} fullWidth variant="contained" color="secondary">Upload</Button>
            </div>
        )
    }
}

export default App;