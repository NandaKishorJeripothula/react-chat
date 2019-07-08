import React from "react";
import { Button } from "@material-ui/core";

export default function RenderVideo(props) {
  const [loadData, setLoadData] = React.useState(false);
  if (!loadData)
    return (
      <Button variant="outlined" onClick={() => setLoadData(true)}>
        Load Video
      </Button>
    );
  else return <video src={props.src} style={{ maxWidth: 200 }} controls />;
}
