import React, { Component } from "react";
import { connect } from "react-redux";
import SplitPane from "react-split-pane";
import ReactMarkdown from "react-markdown";
import Editor from "./editor";
import DocumentBar from "./components/documentBar";
import DocumentDrawer from "./components/documentDrawer";
import {
  SetElectronListeners,
  PingMainProcess,
  LoadDefaultDocument
} from "./electronEvents";

import {
  MAIN_HANDSHAKE_ACK,
  MAIN_OPEN_NEW_DOCUMENT,
  INTERNAL_ERROR
} from "./constants/actionTypes";
import { APP_RENDER_RETURN_FOCUSED_DOCUMENT } from "./constants/electronEventTypes";
import focusedDocumentActions from "./actions/focusedDocumentActions";
import mainEventActions from "./actions/mainEventActions";

import "./App.css";
import { throwError } from "rxjs";
import documentDrawer from "./components/documentDrawer";

class App extends Component {
  constructor(props) {
    super(props);

    this.onMarkdownChange = this.onMarkdownChange.bind(this);
    this.onDocumentTitleChange = this.onDocumentTitleChange.bind(this);
  }

  componentDidMount() {
    console.log("app mounted");
    const eventCallbacks = this.buildCallbackObject();
    SetElectronListeners(eventCallbacks);
    this.connectToMain();
  }

  handleAppError(err) {
    console.log("App error!! ", err);
  }

  buildCallbackObject() {
    if (!this.props) throw "no props to callback";
    const cbo = {};
    cbo[MAIN_HANDSHAKE_ACK] = () => {
      this.props.completeHandshake();
      this.loadStartupDocument();
    };
    cbo[INTERNAL_ERROR] = err => {
      this.handleAppError(err);
    };
    cbo[MAIN_OPEN_NEW_DOCUMENT] = doc => {
      this.props.openNewDocument(doc);
    };
    cbo[APP_RENDER_RETURN_FOCUSED_DOCUMENT] = () => {
      return this.props.focused;
    };
    return cbo;
  }

  loadStartupDocument() {
    console.log("checking for startup document");
    if (!this.props.focused.text) {
      console.log("no focused document found");
      LoadDefaultDocument();
    }
  }

  connectToMain() {
    setTimeout(() => {
      PingMainProcess(err => {});
    }, 1000);
    // console.log("connect");
    // while (!this.props.main || !this.props.main.connected) {
    //   console.log("in while loop");
    //   (() => {
    //     console.log("trying to contact main...");
    //     setTimeout(() => {
    //       PingMainProcess();
    //     }, 1000);
    //   })();
    // }
  }

  onMarkdownChange(text) {
    if (this.props.focused.text === text) return;
    this.props.updateDocument({
      ...this.props.focused,
      unsavedChanges: true,
      text
    });
  }

  onDocumentTitleChange(title) {
    this.props.updateDocument({
      ...this.props.focused,
      name: title
    });
  }

  simpleAction = e => {
    this.props.simpleAction();
  };

  getFocusedText() {
    if (this.props && this.props.focused) {
      return this.props.focused.text;
    }
    return "loading...";
  }

  render() {
    const doc = this.props.focused;
    const { text, name } = doc;
    return (
      <div className="App">
        <div className="drawer-menu">
          <DocumentDrawer />
        </div>

        <div className="workspace">
          {/* <pre className="debug">{JSON.stringify(this.props.drawer)}</pre> */}
          <div className="app-bar">
            <DocumentBar
              document={doc}
              onTitleChange={this.onDocumentTitleChange}
            />
          </div>
          <div className="markdown">
            <SplitPane split="vertical" 
                       defaultSize="50%"
                       maxSize={-50}>
              <div className="editor-pane">
                <Editor
                  className="editor"
                  value={text}
                  onChange={this.onMarkdownChange}
                />
              </div>
              <div className="view-pane">
                <ReactMarkdown className="view" source={text} />
              </div>
            </SplitPane>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  completeHandshake: () => dispatch(mainEventActions.markHandshakeComplete()),
  updateDocument: doc => dispatch(focusedDocumentActions.update(doc)),
  openNewDocument: doc => dispatch(mainEventActions.openNewDocument(doc))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
