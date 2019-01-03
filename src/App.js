import React, { Component } from "react";
import { connect } from "react-redux";
import SplitPane from "react-split-pane";
import ReactMarkdown from "react-markdown";
import Editor from "./editor";
import { SetElectronListeners, PingMainProcess } from "./electronEvents";

import focusedDocumentActions from "./actions/focusedDocumentActions";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markdownSrc: "# Hello World"
    };

    this.onMarkdownChange = this.onMarkdownChange.bind(this);
  }

  componentDidMount() {
    console.log("app mounted");
    SetElectronListeners();
    this.connectToMain();
  }

  connectToMain() {
    console.log("connect");
    while (!this.props.main || !this.props.main.connected) {
      console.log("in while loop");
      (() => {
        console.log("trying to contact main...");
        setTimeout(() => {
          PingMainProcess();
        }, 1000);
      })();
    }
  }

  onMarkdownChange(md) {
    this.props.updateDocument(md);
  }

  simpleAction = e => {
    this.props.simpleAction();
  };

  getFocusedText() {
    if (this.props && this.UNSAFE_componentWillMount.props.focused) {
      return this.props.focused.text;
    }
    return "loading...";
  }

  render() {
    const text = this.props.focused.text;
    return (
      <div className="App">
        <pre>{JSON.stringify(this.props)}</pre>
        <SplitPane split="vertical" defaultSize="50%">
          <div className="editor-pane">
            <Editor
              className="editor"
              value={this.state.markdownSrc}
              onChange={this.onMarkdownChange}
            />
          </div>
          <div className="view-pane">
            <ReactMarkdown className="view" source={this.props.focused.text} />
          </div>
        </SplitPane>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  updateDocument: text => dispatch(focusedDocumentActions.update(text))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
