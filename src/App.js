import React, { Component } from "react";
import { connect } from "react-redux";
import SplitPane from "react-split-pane";
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
import MarkdownRender from "./components/markdownRender";

import "./App.css";
// import { throwError } from "rxjs";
// import documentDrawer from "./components/documentDrawer";

class App extends Component {
  constructor(props) {
    super(props);

    this.onMarkdownChange = this.onMarkdownChange.bind(this);
    this.onDocumentTitleChange = this.onDocumentTitleChange.bind(this);
    this.onSelectDrawerDocument = this.onSelectDrawerDocument.bind(this);
  }

  componentDidMount() {
    const eventCallbacks = this.buildCallbackObject();
    SetElectronListeners(eventCallbacks);
    this.connectToMain();
  }

  handleAppError(err) {
    console.log("App error!! ", err);
  }

  // event callbacks
  buildCallbackObject() {
    if (!this.props) throw "no props to callback";
    const callbacks = {};
    callbacks[MAIN_HANDSHAKE_ACK] = () => {
      this.props.completeHandshake();
      this.loadStartupDocument();
    };
    callbacks[INTERNAL_ERROR] = err => {
      this.handleAppError(err);
    };
    callbacks[MAIN_OPEN_NEW_DOCUMENT] = doc => {
      this.props.openNewDocument(doc);
    };
    callbacks[APP_RENDER_RETURN_FOCUSED_DOCUMENT] = () => {
      return this.props.focused;
    };
    return callbacks;
  }

  loadStartupDocument() {
    if (!this.props.focused.text) {
      LoadDefaultDocument();
    }
  }

  connectToMain() {
    setTimeout(() => {
      PingMainProcess(err => {});
    }, 1000);
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

  onSelectDrawerDocument(docId) {
    if(this.props.drawer[docId]){
      this.props.openNewDocument(this.props.drawer[docId]);
    }
  }

  // getFocusedText() {
  //   if (this.props && this.props.focused) {
  //     return this.props.focused.text;
  //   }
  //   return "loading...";
  // }

  // loadDocument

  render() {
    const doc = this.props.focused;
    const { text, name } = doc;
    return (
      <div className="App">
        <div className="drawer-menu">
          <DocumentDrawer
            drawerDocs={this.props.drawer}
            onSelectDrawerDocument={this.onSelectDrawerDocument}
            focudesDoc={this.props.focused}
          />
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
            <SplitPane split="vertical" defaultSize="50%" maxSize={-50}>
              <div className="editor-pane">
                <Editor
                  className="editor"
                  value={text}
                  onChange={this.onMarkdownChange}
                />
              </div>
              <div className="view-pane">
                <MarkdownRender className="view" source={text} />
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
