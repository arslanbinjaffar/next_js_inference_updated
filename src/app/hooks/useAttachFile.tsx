"use client";

import { SetStateAction, useRef, Dispatch, InputHTMLAttributes } from "react";
import { Button, ButtonProps } from "../components/ui/button";

export const useAttachFile = ({
  selectedFile,
  setSelectedFile,
}: {
  selectedFile: File | undefined;
  setSelectedFile: Dispatch<SetStateAction<File | undefined>>;
}) => {
  const attachFileInputRef = useRef<HTMLInputElement>(null);

  return {
    Component: (props: {
      inputProps?: InputHTMLAttributes<HTMLInputElement>;
      buttonProps?: ButtonProps & InputHTMLAttributes<HTMLButtonElement>;
    }) => (
      <section className="flex items-center gap-2">
        <div>
          <Button
            size={"sm"}
            onClick={() => {
              attachFileInputRef.current?.click();
            }}
            {...props.buttonProps}
          >
            {selectedFile ? "Update" : "Attach"} File
          </Button>
          <input
            type="file"
            accept=".pdf,.doc,.docs"
            ref={attachFileInputRef}
            id="file_input_for_model_client_side"
            onChange={(e) => {
              setSelectedFile(e.target.files ? e.target.files[0] : undefined);
            }}
            hidden
            {...props.inputProps}
          />
        </div>
        <p className="text-teal-600 underline">{selectedFile?.name}</p>
      </section>
    ),
    selectedFile,
  };
};
