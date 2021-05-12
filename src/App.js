import React from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import { Button, Typography } from '@material-ui/core';
import mammoth from 'mammoth';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            statusCode: 0
        }
    }

    componentDidUpdate(prevProps) {

        if (this.state.statusCode === 200) {
            fetch('http://localhost:8080/getDocx', {
                method: 'get'
            })
                .then(res => {
                    this.setState({ statusCode: 0 })
                    res.blob().then(blob => this.downloadConvertedDocx(blob))
                })
                .catch(err => {
                    this.setState({ statusCode: 0 })
                    console.log(err)
                })
        }
    }

    downloadConvertedDocx = (blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url
        a.download = "Test.docx"
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
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
                            headers: { "Content-type": "application/json" }
                        })
                            .then(res => {
                                if (res.ok) {
                                    this.setState({ statusCode: res.status })
                                    alert("Uploaded Successfully")
                                }
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

    handleDelete = () => {
        this.setState({ files: [] })
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
                    onDelete={this.handleDelete}
                />
                <Button onClick={this.handleUpload} style={{ marginTop: '1%' }} fullWidth variant="contained" color="secondary">Upload</Button>
            </div>
        )
    }
}

export default App;