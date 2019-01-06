import React from "react";
import DocumentTitle from "./documentTitle";
import "./documentBar.css";

const maxPathLength = 50;

class DocumentBar extends React.Component {
  getAbbreviatedPath(absPath) {
    const directorySplit = absPath
      .substring(absPath.length - maxPathLength)
      .split("/");
    directorySplit.shift();
    return `.../${directorySplit.join("/")}`;
  }

  renderAbsPath() {
    const { document } = this.props;
    const { name, parentDirectoryPath, ext, isDefault } = document;
    if(isDefault) return;
    let absPath = `${parentDirectoryPath}/${name}.${ext}`;
    const strLength = absPath.length;
    if (strLength > maxPathLength) absPath = this.getAbbreviatedPath(absPath);
    return <div className="document-path-modest">{absPath}</div>;
  }
  render() {
    const { document } = this.props;

    return (
      <div className="document-bar">
        {this.renderAbsPath()}
        <DocumentTitle
          document={document}
          onTitleChange={this.props.onTitleChange}
        />
      </div>
    );
  }
}

export default DocumentBar;
