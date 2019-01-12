import emoji from "markdown-it-emoji";
import MarkdownIt from "markdown-it";
import React from "react";

import highlightjs from 'markdown-it-highlightjs';

const md = new MarkdownIt({
  html: true, // Enable HTML tags in source
  xhtmlOut: false, // Use '/' to close single tags (<br />).
  // This is only for full CommonMark compatibility.
  breaks: false, // Convert '\n' in paragraphs into <br>
  langPrefix: "language-", // CSS language prefix for fenced blocks. Can be
  // useful for external highlighters.
  linkify: true, // Autoconvert URL-like text to links

  // Enable some language-neutral replacement + quotes beautification
  typographer: true,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Could be either a String or an Array.
  //
  // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
  // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
  quotes: "“”‘’",

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed and should be escaped externally.
  // If result starts with <pre... internal wrapper is skipped.

//   highlight: function(str, lang) {
//     if (lang && hljs.getLanguage(lang)) {
//       try {
//         return hljs.highlight(lang, str).value;
//       } catch (__) {}
//     }

//     return ""; // use external default escaping
//   }
});

md.use(emoji).use(highlightjs);

function MarkdownRender(props) {
  const { source } = props;
  if (!source) return <div className="rendered-markdown-it" />;
  const html = md.render(source);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default MarkdownRender;
