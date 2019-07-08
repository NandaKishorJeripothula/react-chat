import React from 'react';
import {Button} from '@material-ui/core';

export default function RenderImage(props) {
    const [loadData,setLoadData]=React.useState(false);
    if(loadData){
        return (
            <Button  variant="outlined" onClick={setLoadData(true)}>
                Load Image
            </Button>
        )
    }
    else{
        return (
            <img src={props.src} alt={props.src} style={{maxWidth:200}}/>
        )
    }
   
}
