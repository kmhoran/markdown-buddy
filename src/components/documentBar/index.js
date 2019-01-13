import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
import DocumentTitle from "./documentTitle";
import "./documentBar.css";

const maxPathLength = 50;

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

// class DocumentBar extends React.Component {
//   renderAbsPath() {
//     const { document } = this.props;
//     const { name, parentDirectoryPath, ext, isDefault } = document;
//     if (isDefault) return;
//     let absPath = `${parentDirectoryPath}/${name}.${ext}`;
//     const strLength = absPath.length;
//     if (strLength > maxPathLength) absPath = this.getAbbreviatedPath(absPath);
//     return <div className="document-path-modest">{absPath}</div>;
//   }
//   render() {
//     const { document } = this.props;

//     return <div className="document-bar">{this.renderAbsPath()}</div>;
//   }
// }

function DocumentBar(props) {
  const { classes, document } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton> */}
          {/* <Typography variant="h6" color="inherit" className={classes.grow}>
            News
          </Typography>
          <Button color="inherit">Login</Button> */}
          <DocumentTitle
            document={document}
            onTitleChange={props.onTitleChange}
          />
        </Toolbar>
      </AppBar>
    </div>
  );
}

DocumentBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DocumentBar);
