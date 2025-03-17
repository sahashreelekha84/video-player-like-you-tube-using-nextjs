"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "react-query";
import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
import { database } from "../../../../../api_url/api";


const VideoEdit: React.FC = () => {
  const { id } = useParams(); // Get video ID from URL
  const router = useRouter();
  const [videoName, setVideoName] = useState("");

  // Fetch Video Details
  const { data: video, isLoading } = useQuery(["video", id], async () => {
    const response = await database.getDocument("67d7c818000549f9a3f0", "67d7c83e000abb188865", id);
    console.log('video',video);
    
    setVideoName(response.name); // Set initial value
    return response;
  });

  // Update Video Name Mutation
  const updateMutation = useMutation({
    mutationFn: async (newName: string) => {
      return database.updateDocument("67d7c818000549f9a3f0", "67d7c83e000abb188865", id, { name: newName });
    },
    onSuccess: () => {
      router.push("/component/videolist"); // Redirect back after update
    },
  });

  if (isLoading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3, maxWidth: "600px", mx: "auto", textAlign: "center" }}>
      <Typography variant="h5">Edit Video Name</Typography>

      <TextField
        label="Video Name"
        fullWidth
        sx={{ mt: 2 }}
        value={videoName}
        onChange={(e) => setVideoName(e.target.value)}
      />

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        disabled={updateMutation.isLoading}
        onClick={() => updateMutation.mutate(videoName)}
      >
        {updateMutation.isLoading ? <CircularProgress size={24} /> : "Save Changes"}
      </Button>
    </Box>
  );
};

export default VideoEdit;
