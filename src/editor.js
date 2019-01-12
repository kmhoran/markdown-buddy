import React from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
require("codemirror/lib/codemirror.css");
require("codemirror/theme/monokai.css");
require("codemirror/mode/markdown/markdown");

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.updateCode = this.updateCode.bind(this);
  }

  updateCode = (editor, data, value) => {
    if (value) {
      this.props.onChange(value);
    }
  };

  render() {
    var options = {
      mode: "markdown",
      theme: "monokai"
    };
    return (
      <CodeMirror
        value={this.props.value}
        options={options}
        onChange={this.updateCode}
        height="100%"
        onBeforeChange={(editor, data, value, next) => {
          this.updateCode(editor, data, value);
          return next;
        }}
      />
    );
  }
}

export default Editor;
