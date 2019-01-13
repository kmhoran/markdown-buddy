import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

const drawerWidth = 200;
const maxPathLength = 20;

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  }
});

const drawerCardPrimary = {
  variant: "subtitle2"
};

function getAbbreviatedPath(absPath) {
  const directorySplit = absPath
    .substring(absPath.length - maxPathLength)
    .split("/");
  directorySplit.shift();
  return `.../${directorySplit.join("/")}/`;
}

function renderDrawerCards(
  drawerDocs,
  focudesDoc,
  onSelectDrawerDocument,
  returnDefaultDocs = false
) {
  const cards = [];
  for (let id in drawerDocs) {
    const doc = drawerDocs[id];
    const name =
      !doc.isDefault && doc.unsavedChanges ? `${doc.name}*` : doc.name;
    const secondaryText = !doc.isDefault
      ? getAbbreviatedPath(doc.parentDirectoryPath)
      : null;
    if (doc.isDefault === returnDefaultDocs) {
      cards.push(
        <ListItem
          button
          key={doc.docId}
          dense={true}
          onClick={() => {
            onSelectDrawerDocument(doc.docId);
          }}
          selected={doc.docId === focudesDoc.docId}
        >
          {/* <ListItemIcon>
            {index % 2 === 0 ? <h5>XXX</h5> : <h5>YYY</h5>}
          </ListItemIcon> */}
          <ListItemText
            primary={name}
            primaryTypographyProps={drawerCardPrimary}
            secondary={secondaryText}
          />
        </ListItem>
      );
    }
  }
  return cards;
}

function DocumentDrawer(props) {
  const { classes, drawerDocs, focudesDoc } = props;
  const { onSelectDrawerDocument } = props;

  console.log(drawerDocs);

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <List>
          {renderDrawerCards(
            drawerDocs,
            focudesDoc,
            onSelectDrawerDocument,
            true
          )}
        </List>
        <Divider />
        <List>
          {renderDrawerCards(drawerDocs, focudesDoc, onSelectDrawerDocument)}
        </List>
      </Drawer>
    </div>
  );
}

export default withStyles(styles)(DocumentDrawer);
