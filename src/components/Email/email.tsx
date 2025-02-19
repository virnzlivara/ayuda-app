import React from "react";
import { Loader } from "../Loader/Loader";
type EmailProps = { handleUpload: () => void; showLoading: boolean };
export const Email = ({ handleUpload, showLoading }: EmailProps) => {
  return (
    <button
      className="bg-[#4ebff9] py-4 px-4 text-2xl rounded-md flex justify-between items-center gap-2"
      onClick={handleUpload}
    >
      {showLoading && <Loader />}
      {showLoading ? "Sending..." : "Email this QR"}
    </button>
  );
};
