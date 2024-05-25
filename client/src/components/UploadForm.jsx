import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/joy";
import { useDropzone } from "react-dropzone";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const DropzoneComponent = ({onSuccess}) => {
  const [files, setFiles] = useState([]);
  const [alert, setAlert] = useState({ message: "", type: "info" });

  const handleUpload = async () => {
    if (!files.length) {
      if (!files.length) {
        setAlert({ message: "Please select videos to upload.", type: "error" });
        return;
      }
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("videos", file);
    });

    try {
      const response = await fetch(
        `http://localhost:5000/api/videos/upload`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload videos.");
      }
      setAlert({ message: "Videos uploaded successfully.", type: "success" });
      setFiles([]);
      onSuccess();
    } catch (error) {
      console.error("Error uploading Videos:", error.message);
      setAlert({
        message: "Error uploading Videos. Please try again.",
        type: "error",
      });
    }
  };

  const onDrop = (acceptedFiles) => {
    if (files.length + acceptedFiles.length > 10) {
      setAlert({
        message: "You can upload up to 10 videos only at a time.",
        type: "error",
      });
      return;
    }
    setFiles((prev) => [...prev, ...acceptedFiles]);
    setAlert({ message: "", type: "info" });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <Box sx={{ p: 2 }}>
      <Box
        {...getRootProps()}
        sx={{
          p: 2,
          border: "2px dashed",
          borderColor: "neutral.outlinedBorder",
          bgcolor: "background.body",
          color: "text.primary",
          borderRadius: 2,
          minHeight: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "background.level1",
            borderColor: "primary.outlinedHoverBorder",
          },
        }}
      >
        <input {...getInputProps()} />
        <Typography variant="body2" sx={{ mb: 2 }}>
          {isDragActive
            ? "Drop the videos here ..."
            : files.length
            ? `Selected: ${files.map((file) => file.name).join(", ")}`
            : "Drag 'n' drop videos here, or click to select videos"}
        </Typography>
      </Box>
      <Button
        variant="outlined"
        onClick={handleUpload}
        disabled={!files.length}
        sx={{ mt: 2, width: "calc(100%)" }}
      >
        Upload
      </Button>
      {alert.message && (
        <Stack sx={{ width: "100%", mt: 2 }}>
          <Alert severity={alert.type}>{alert.message}</Alert>
        </Stack>
      )}
    </Box>
  );
};

export default DropzoneComponent;
