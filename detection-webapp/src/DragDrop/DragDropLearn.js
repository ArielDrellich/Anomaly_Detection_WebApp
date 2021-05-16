import React from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';
import '../App.css';

/*const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));

function Accept(props) {
    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps
    } = useDropzone({
        accept: 'text/csv'
    });

    function uploadFiles() {

    }


    const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
            <ul>
                {errors.map(e => (
                    <li key={e.code}>{e.message}</li>
                ))}
            </ul>
        </li>
    ));
    const classes = useStyles();
    return (
        <div>
            {console.log(acceptedFiles[0])}
            <div>First, please enter your Learn csv file.</div>
            <section className="container dragDropLearn">
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                    <em>(Only *.jpeg and *.png images will be accepted)</em>
                </div>
                <aside>
                    <h4>Accepted files</h4>
                    <ul>{acceptedFileItems}</ul>
                    <h4>Rejected files</h4>
                    <ul>{fileRejectionItems}</ul>
                </aside>
                <Button onClick={uploadFiles}
                    variant="contained"
                    color="default"
                    className={classes.button}
                    startIcon={<CloudUploadIcon />}
                >
                    Upload
                </Button>
            </section>
        </div>
    );
}

<Accept />

export default Accept;*/
import axios from "axios"
import { useEffect, useState } from 'react';
import Radio from '@material-ui/core/Radio';


function Basic({ addNewLearn }) {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    useEffect(() => {
        console.log(acceptedFiles)
    }, [acceptedFiles])

    const [learnType, setlearnType] = useState("regression")


    //const [selectedValue, setSelectedValue] = React.useState(learnType);

    //upload files to server
    async function uploadFiles() {
        console.log(acceptedFiles[0])
        if (acceptedFiles[0]) {
            const data = new FormData()
            data.append("file", acceptedFiles[0])
            data.append("type", learnType);
            await axios.post("http://localhost:1234/uploadLearn", data)
            // axios.post("http://localhost:1234/uploadDetect", data)
            // axios.get("http://localhost:1234/api/model")
            addNewLearn()
        }
        else {
            alert("No file selected")
        }

    }

    function handleChooseType(learnType) {
        setlearnType(learnType)
        //setSelectedValue(learnType);
        console.log(learnType)
    }

    return (
        <div>
            <div>First, please enter your Learn csv file.</div>
            <section className="container dragDropLearn">
                <Radio
                    checked={learnType === "regression"}
                    onChange={() => handleChooseType("regression")}
                    value="regression"
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': 'A' }}
                /> Regression <Radio
                    checked={learnType === "hybrid"}
                    onChange={() => handleChooseType("hybrid")}
                    value="hybrid"
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': 'A' }}
                /> Hybrid
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p className="DragDropErea">Drag 'n' drop some files here, or click to select files</p>
                </div>
                <aside>
                    <h4>Files</h4>
                    <ul>{files}</ul>
                </aside>
                <Button onClick={uploadFiles}
                    variant="contained"
                    color="default"
                    startIcon={<CloudUploadIcon />}
                >
                    Upload
                </Button>
            </section>
        </div>
    );
}

<Basic />

export default Basic;