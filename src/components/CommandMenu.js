import React, { useEffect, useState } from "react";
import { allowedCommands } from "../constants";

// set height of menu to fixed value to ensure menu's position correctly
const MENU_HEIGHT = 100;

const CommandMenu = ({ position, onSelect, onClose }) => {
  const [commandList, setCommandList] = useState(allowedCommands);
  const [command, setCommand] = useState("");
  const [selectedCommand, setSelectedCommand] = useState(0);

  // const isMenuOutsideOfTopViewport = position?.y - MENU_HEIGHT < 0;
  // const y = !isMenuOutsideOfTopViewport
  //   ? position?.y - MENU_HEIGHT
  //   : position?.y + MENU_HEIGHT / 4;

  const y = position?.y + MENU_HEIGHT / 4;
  const x = position?.x || 0;

  // Filter commandList when user typing
  useEffect(() => {
    if (command) {
      const filteredCommands = allowedCommands.filter((c) => {
        return c.label.toLocaleLowerCase().indexOf(command?.toLowerCase()) >= 0;
      });

      if (filteredCommands.length === 0 && command.length > 6) {
        onClose();
      }

      setCommandList(filteredCommands);
    }
  }, [command]);

  // handle selection by keyboard's input
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "Enter":
          if (commandList[selectedCommand]) {
            e.preventDefault();
            onSelect(commandList[selectedCommand].command);
          }
          break;
        case "ArrowDown": {
          e.preventDefault();
          const newSelectedCommand =
            selectedCommand === commandList.length - 1
              ? 0
              : selectedCommand + 1;

          setSelectedCommand(newSelectedCommand);
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const newSelectedCommand =
            selectedCommand === 0
              ? commandList.length - 1
              : selectedCommand - 1;
          setSelectedCommand(newSelectedCommand);
          break;
        }
        case "Backspace":
          if (e.metaKey || e.ctrlKey || !command) {
            onClose();
          } else {
            setCommand(command.slice(0, -1));
          }
          break;
        default:
          if (e.key?.length === 1) {
            setCommand(command + e.key);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [commandList, selectedCommand, command]);

  const handleHover = (index) => {
    setSelectedCommand(index);
  };

  const handleSelect = (e, command) => {
    e.preventDefault();
    onSelect(command);
  };

  return (
    <div className="menu-wrapper" style={{ top: y, left: x }}>
      <div className="menu">
        {commandList.map((command, index) => (
          <div
            key={command.id}
            className={`menu--item ${
              index === selectedCommand ? "selected-command" : ""
            }`}
            role="button"
            onClick={(e) => handleSelect(e, command.command)}
            onMouseOver={() => handleHover(index)}
          >
            {command.label}
          </div>
        ))}

        {commandList.length === 0 && (
          <div className="no-command">No result</div>
        )}
      </div>
    </div>
  );
};

export default CommandMenu;
