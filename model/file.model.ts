import { Schema, model } from "mongoose";

// Interface for File document
export interface IFile {
  fileId: string;
  fileName: string;
  size: number; // Size in bytes
  fileType: string; // MIME type
  extension: string; // File extension
  url: string;
  dimension: {
    width: number | null;
    height: number | null;
  };
}

// Mongoose schema for File
const fileSchema = new Schema<IFile>(
  {
    fileId: {
      type: String,
      required: [true, "File ID is required"],
      unique: true,
    },
    fileName: {
      type: String,
      required: [true, "File name is required"],
      trim: true,
    },
    size: {
      type: Number,
      required: [true, "File size is required"],
      min: [1, "File size must be greater than 0"],
    },
    fileType: {
      type: String,
      required: [true, "File type is required"],
      trim: true,
    },
    extension: {
      type: String,
      required: [true, "File extension is required"],
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^[a-zA-Z0-9]+$/.test(v);
        },
        message: (props: { value: string }) => `${props.value} is not a valid file extension`,
      },
    },
    url: {
      type: String,
      required: [true, "File URL is required"],
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^(https?:\/\/\S+)$/.test(v); // Accepts both http and https
        },
        message: (props: { value: string }) => `${props.value} is not a valid URL`,
      },
    },
    dimension: {
      type: {
        width: {
          type: Number,
          default: null,
        },
        height: {
          type: Number,
          default: null,
        },
      },
      required: [
        function (this: IFile) {
          return this.fileType.startsWith("image/") || this.fileType.startsWith("video/");
        },
        "Dimensions are required for image and video files",
      ],
      default: null,
      validate: {
        validator: function (this: IFile, v: { width: number | null; height: number | null }) {
          if (this.fileType.startsWith("image/") || this.fileType.startsWith("video/")) {
            return v && typeof v.width === "number" && typeof v.height === "number";
          }
          return v === null;
        },
        message: "Dimensions must be valid numbers for image and video files, or null for others",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Model creation
const FileModel = model<IFile>("File", fileSchema);

export default FileModel;
