import React, { useCallback, useEffect, useRef, useState } from "react";
import CommandMenu from "./CommandMenu";
import ContentEditable from "./ContentEditable";
import Toolbar from "./Toolbar";

import { replaceCaret } from "../utils";
import { CMD_KEY } from "../constants";

const TextEditor = () => {
  const editorRef = useRef();
  const [html, setHtml] = useState("");
  const [htmlBackup, setHtmlBackup] = useState(null);
  const [command, setCommand] = useState("");
  const [usedCommands, setUsedCommands] = useState([]);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [commandMenuPosition, setCommandMenuPosition] = useState({
    x: null,
    y: null
  });

  const handleSetCommand = useCallback((cmd) => {
    setUsedCommands((commands) => {
      const newCommands = [...commands];
      const commandIndex = commands.indexOf(cmd);

      if (commandIndex !== -1) {
        newCommands.splice(commandIndex, 1);
      } else newCommands.push(cmd);

      return newCommands;
    });
    setCommand("");
    document.execCommand(cmd, false);
  }, []);

  useEffect(() => {
    if (command) {
      handleSetCommand(command);
    }
  }, [command, handleSetCommand]);

  const handleChange = (value) => {
    setHtml(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === CMD_KEY) {
      setHtmlBackup(html);
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === CMD_KEY) {
      openCommandMenu();
    }
  };

  const openCommandMenu = () => {
    const { x, y } = calculateCommandMenuPosition();

    setCommandMenuPosition({ x, y });
    setCommandMenuOpen(true);

    document.addEventListener("click", closeCommandMenu, false);
  };

  const closeCommandMenu = () => {
    setHtmlBackup(null);
    setCommandMenuOpen(false);
    setCommandMenuPosition({ x: null, y: null });

    document.removeEventListener("click", closeCommandMenu, false);
  };

  const handleCommandSelection = (command) => {
    if (editorRef.current) {
      editorRef.current.focus();
      replaceCaret(editorRef.current);
    }

    setCommand(command);
    setHtml(htmlBackup);

    closeCommandMenu();
  };

  const handleSetCommandFromToolbar = (cmd) => {
    if (editorRef.current) {
      editorRef.current.focus();
      replaceCaret(editorRef.current);
    }

    handleSetCommand(cmd);
  };

  return (
    <>
      {commandMenuOpen && (
        <CommandMenu
          position={commandMenuPosition}
          onSelect={handleCommandSelection}
          onClose={closeCommandMenu}
        />
      )}

      <Toolbar
        usedCommands={usedCommands}
        onClick={handleSetCommandFromToolbar}
      />
      <ContentEditable
        ref={editorRef}
        className="text-editor"
        value={html}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onChange={handleChange}
      />

      <div className="tooltip">Press '/' for commands</div>
    </>
  );
};

const calculateCommandMenuPosition = () => {
  let x, y;
  const isSupported = typeof window.getSelection !== "undefined";

  if (isSupported) {
    const selection = window.getSelection();
    if (selection.rangeCount !== 0) {
      const range = selection.getRangeAt(0).cloneRange();
      range.collapse(true);
      const rect = range.getClientRects()[0];

      if (rect) {
        x = rect.left;
        y = rect.top;
      }
    }
  }

  return { x, y };
};

export default TextEditor;
