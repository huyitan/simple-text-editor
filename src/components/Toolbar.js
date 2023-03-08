import React from "react";
import { allowedCommands } from "../constants";

const CommandButton = ({ used = false, label, cmd, onClick }) => {
  const handleClick = (e) => {
    e.preventDefault();

    if (cmd) {
      onClick(cmd);
    }
  };

  return (
    <button
      className={`toolbar--button ${used ? "used-command" : ""}`}
      onMouseDown={handleClick}
    >
      {label || cmd}
    </button>
  );
};

const Toolbar = ({ usedCommands = [], onClick }) => {
  return (
    <div className="toolbar">
      {allowedCommands.map((command) => (
        <CommandButton
          keu={command.id}
          label={command.label}
          cmd={command.command}
          used={usedCommands.includes(command.command)}
          onClick={onClick}
        />
      ))}
    </div>
  );
};

export default Toolbar;
