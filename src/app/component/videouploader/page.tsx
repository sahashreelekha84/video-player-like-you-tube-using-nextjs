"use client";

import React, { useState } from "react";
import { useMutation } from "react-query";
import { useDropzone } from "react-dropzone";
import { useForm, Controller } from "react-hook-form";
import { Box, Button, TextField, Typography, CircularProgress, InputAdornment, IconButton, Container, Grid } from "@mui/material";
import { ID } from "appwrite";
import { storage, database } from "../../../../api_url/api";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import { useRouter } from "next/navigation"; //  Import useRouter

interface VideoForm {
  name: string;
  description: string;
}

const VideoUploader: React.FC = () => {
    const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const router = useRouter(); //  Initialize useRouter
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { 
    control, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<VideoForm>({
    defaultValues: { name: "", description: "" },
  });

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: { "video/*": [] },
    maxSize: 50 * 1024 * 1024, // 50MB limit
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setVideoFile(file);
        setError(null);
      }
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: VideoForm) => {
      if (!videoFile) throw new Error("No video file selected.");

      const uploadedFile = await storage.createFile("67d7c859001db8160827", ID.unique(), videoFile);

      await database.createDocument(
        "67d7c818000549f9a3f0",
        "67d7c83e000abb188865",
        uploadedFile.$id,
        {
          name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
          description: data.description,
          fileId: uploadedFile.$id,
          fileUrl: storage.getFileView("67d7c859001db8160827", uploadedFile.$id),
        }
      );
      setUploadedFileId(uploadedFile.$id);
            return uploadedFile;
          },
    //   return uploadedFile;
    
    onSuccess: () => {
      setVideoFile(null);
      reset();
      setError(null);

     
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const onSubmit = (data: VideoForm) => {
    if (!videoFile) {
      setError("Please select a video file.");
      return;
    }
    uploadMutation.mutate(data);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{
        p: 4,
        mt: 5,
        border: "3px solid #ff0000",
        borderRadius: 3,
        bgcolor: "#000000",
        color: "#ffffff",
        boxShadow: "0px 4px 15px rgba(255, 0, 0, 0.7)",
        textAlign: "center"
      }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, color: "#ff0000" }}>
          {uploadedFileId ? "Edit Form" : "Upload Your Video 🎥"}
        </Typography>

        {/* Drag & Drop Upload */}
        <Box 
          {...getRootProps()} 
          sx={{ 
            cursor: "pointer", 
            p: 3, 
            bgcolor: "#1E1E1E", 
            borderRadius: 2, 
            transition: "0.3s",
            border: "2px dashed #ff0000",
            "&:hover": { bgcolor: "#2A2A2A" }
          }}
        >
          <input {...getInputProps()} />
          <Typography color="#ff0000">Drag & Drop your video here, or click to select</Typography>
        </Box>

        {fileRejections.length > 0 && (
          <Typography color="error" sx={{ mt: 1 }}>
            Invalid file type or size exceeds limit.
          </Typography>
        )}

        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              {/* Video Name Field */}
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Video name is required",
                  minLength: { value: 3, message: "Name must be at least 3 characters" },
                  maxLength: { value: 150, message: "Name cannot exceed 150 characters" },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Video Name"
                    fullWidth
                    sx={{ bgcolor: "#1E1E1E", borderRadius: 1, input: { color: "#fff" } }}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputProps={{
                      style: { color: "#ffffff" },
                      endAdornment: (
                        <InputAdornment position="end">
                          {uploadMutation.isSuccess && uploadMutation.data?.$id && (
                            <Link href={`/component/videoedit/${uploadMutation.data.$id}`} passHref>
                              <IconButton sx={{ color: "#ff0000" }}>
                                <EditIcon />
                              </IconButton>
                            </Link>
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              {/* Video Description Field */}
              <Controller
                name="description"
                control={control}
                rules={{
                  required: "Video description is required",
                  minLength: { value: 10, message: "Description must be at least 10 characters" },
                  maxLength: { value: 300, message: "Description cannot exceed 300 characters" },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Video Description"
                    fullWidth
                    multiline
                    rows={2}
                    sx={{ bgcolor: "#1E1E1E", borderRadius: 1, input: { color: "#fff" } }}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    InputProps={{ style: { color: "#ffffff" } }}
                  />
                )}
              />
            </Grid>
          </Grid>

          {videoFile && (
            <Typography sx={{ mt: 2, color: "#ff0000" }}>
              Selected File: <strong>{videoFile.name}</strong>
            </Typography>
          )}

          {/* Upload Button
          <Button
            variant="contained"
            sx={{ 
              mt: 3, 
              bgcolor: "#ff0000", 
              color: "#fff", 
              fontWeight: "bold", 
              borderRadius: 2, 
              transition: "0.3s",
              "&:hover": { bgcolor: "#c70000" }
            }}
            type="submit"
            disabled={uploadMutation.isLoading}
          >
            {uploadMutation.isLoading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Upload Video"}
          </Button> */}
             <Button variant="contained" sx={{ mt: 3, bgcolor: "#ff0000", color: "#fff", fontWeight: "bold", borderRadius: 2, transition: "0.3s", "&:hover": { bgcolor: "#c70000" } }} type="submit" disabled={uploadMutation.isLoading}>
            {uploadMutation.isLoading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Upload Video"}
          </Button>

          {uploadedFileId && (
            <Button variant="contained" sx={{ mt: 3, ml: 2, bgcolor: "#ff0000", color: "#fff" }} onClick={() => router.push(`/component/videodetail/${uploadedFileId}`)}>
              Existing Video
            </Button>
          )}
        </form>
      </Box>
    </Container>
  );
};

export default VideoUploader;
