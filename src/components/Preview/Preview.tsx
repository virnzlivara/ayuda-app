import React from "react";
type PreviewProps = {
  previewUrl: string;
};
export const Preview = ({ previewUrl }: PreviewProps) => {
  return (
    <div className="flex justify-center h-full">
      <div
        style={{ marginTop: "20px", border: 2 }}
        className="d-flex justify-center"
      >
        <img
          src={previewUrl}
          alt="File Preview"
          style={{
            //  maxWidth: `${screenWidth - 40}px`, maxHeight: `${screenHeight - 200}px`,
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
};
