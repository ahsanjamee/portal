import { Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadIcon } from "../icons/AllIcons";
import axios from "axios";

type IUploadImageProps = {
  file: string;
  setFile: (value: string) => void;
};

const UploadImage: React.FC<IUploadImageProps> = ({ file, setFile }) => {
  const uploadUrl = import.meta.env.VITE_CLOUDINARY_URL;
  const upload_Preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const [uploading, setUploading] = useState(false);

  const uploadImages = async (files: any[]) => {
    const file = files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", upload_Preset);
    setUploading(true);

    try {
      const response = await axios.post(uploadUrl, formData);

      setFile(response.data.secure_url);
      setUploading(false);

      notifications.show({
        message: "Upload successful",
        color: "green",
      });
    } catch (err) {
      setUploading(false);
      console.error("Upload error:", err);

      notifications.show({
        message: "Upload failed. Please try again.",
        color: "red",
      });
    }
  };
  // if (response !== undefined) {

  //   setFile(response.url);
  //   notifications.show({
  //     message: "Upload successful",
  //     color: "green",
  //   });
  // } else {
  //   notifications.show({
  //     message: "Upload failed",
  //     color: "red",
  //   });
  // }

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg"],
      "image/jpg": [".jpg"],
      "image/png": [".png"],
    },
    maxFiles: 1, // Limit to only one file
    maxSize: 5 * 1024 * 1024, // Max size in bytes (2MB)
    onDrop: useCallback(
      async (acceptedFiles: File[]) => {
        if (acceptedFiles.length !== 0) {
          const files = acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          );
          await uploadImages(files);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    ),
    onDropRejected: (fileRejections) => {
      if (fileRejections.length > 0) {
        if (fileRejections[0]?.errors[0]?.code === "file-invalid-type") {
          notifications.show({
            message: "We accept JPEG and PNG files",
            color: "red",
          });
        }
        if (fileRejections[0]?.errors[0]?.code === "file-too-large") {
          notifications.show({
            message: "File size is larger than 10 MB",
            color: "red",
          });
        }
        if (fileRejections[0]?.errors[0]?.code === "too-many-files") {
          notifications.show({
            message: "Only one file can be uploaded",
            color: "red",
          });
        }
      }
    },
  });

  return (
    <>
      {file !== "" ? (
        <div className="relative max-w-[150px] h-full mt-4">
          <img
            src={file}
            alt="Uploaded"
            className="w-full h-full object-contain max-w-[150px] shadow-md rounded-lg"
          />
          <button
            onClick={() => {
              setFile("");
            }}
            className="absolute bg-white rounded-full z-50 shadow-xl top-[-10px] right-[-10px] p-1 hover:rotate-180 transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#000"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : (
        <>
          <div
            {...getRootProps()}
            className="bg-white w-full border-dashed border-gray-400 border-2 p-6 text-center cursor-pointer  col-span-5 relative"
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div className="flex justify-center items-center w-full h-full">
                <Loader size={"xl"} />
              </div>
            ) : (
              <div className="text-gray-600 flex flex-col justify-center items-center">
                <UploadIcon />
                <div className="text-neutral-900 text-sm  font-semibold   my-3 ml-3">
                  <span className="text-vadio-brand-500">Upload image</span> or
                  drag and drop
                </div>
                <div className="text-gray-400 text-xs  font-normal  ">
                  We accept JPEG and PNG files (Max. 5MB)
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default UploadImage;
