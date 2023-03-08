import React, { useEffect, useRef } from "react";

import { replaceCaret } from "../utils";

const ContentEditable = React.forwardRef(
  ({ className, value, onChange, onKeyDown, onKeyUp }, ref) => {
    const defaultValue = useRef(value);

    // update content manually due to value's ref not trigger component re-render
    useEffect(() => {
      if (!ref) return;

      if (value !== ref.current.innerHTML) {
        console.log("content", value);
        ref.current.innerHTML = value;

        replaceCaret(ref.current);
      }
    }, [value, ref]);

    const handleInput = (event) => {
      if (onChange) {
        onChange(event.target.innerHTML);
      }
    };

    return (
      <div
        ref={ref}
        className={className}
        contentEditable
        dangerouslySetInnerHTML={{ __html: defaultValue.current }}
        onInput={handleInput}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      />
    );
  }
);

export default ContentEditable;
