import React from "react";

import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import "./documentBar.css";

const { Menu } = window.remote;

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  // dense: {
  //   marginTop: 19
  // },
  // menu: {
  //   width: 200
  // }
});

class DocumentTitle extends React.Component {
  componentDidMount() {
    this.turnOnTitleEdit = this.turnOnTitleEdit.bind(this);
    this.turnOffTitleEdit = this.turnOffTitleEdit.bind(this);
    const turnOnEdit = this.turnOnTitleEdit;
    this.myContextMenu = Menu.buildFromTemplate([
      {
        label: "Rename",
        click() {
          (() => {
            turnOnEdit();
          })();
        }
      }
    ]);
    this.handleContextMenu = this.handleContextMenu.bind(this);

    this.state = {
      editingTitle: false
    };
  }

  turnOnTitleEdit() {
    if (this.props.document.isDefault) return;
    this.setState({
      editingTitle: true
    });
  }

  turnOffTitleEdit() {
    if (this.props.document.name.length > 0) {
      this.setState({
        editingTitle: false
      });
    }
  }

  handleChange = event => {
    if (event.target) {
      this.props.onTitleChange(event.target.value);
    }
  };

  handleContextMenu(event) {
    if (this.props.document.isDefault) return;
    event.preventDefault();
    this.myContextMenu.popup();
  }

  renderTitle(name, classes) {
    if (this.state && this.state.editingTitle) {
      return (
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            id="standard-name"
            label="Document Name"
            className={classes.textField}
            value={name}
            onChange={this.handleChange}
            margin="normal"
            autoFocus={true}
            error={name.length < 1}
            onBlur={this.turnOffTitleEdit}
            variant="outlined"
          />
        </form>
      );
    }
    return (
      <div
        onContextMenu={this.handleContextMenu}
        onClick={this.turnOnTitleEdit}
      >
        {name}
      </div>
    );
  }

  render() {
    const { classes } = this.props;

    if (!this.props.document.uid) {
      return (
        <div>
          <h3>loading ...</h3>
        </div>
      );
    }
    const { name } = this.props.document;
    return (
      <div className="document-title">{this.renderTitle(name, classes)}</div>
    );
  }
}

export default withStyles(styles)(DocumentTitle);
