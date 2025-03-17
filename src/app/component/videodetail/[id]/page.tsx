"use client";

import React from "react";
import { useQuery } from "react-query";
import { useParams } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";
import { database } from "../../../../../api_url/api";

interface Video {
  $id: string;
  name: string;
  description: string;
  fileUrl: string;
}

const VideoDetails: React.FC = () => {
  const { id } = useParams(); // Get video ID from URL

  // Fetch Video Data
  const { data: video, isLoading } = useQuery(["video", id], async () => {
    if (!id) return null;
    const response = await database.getDocument("67d7c818000549f9a3f0", "67d7c83e000abb188865", id);
    return response as unknown as Video;
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!video) {
    return <Typography sx={{ textAlign: "center", color: "#fff", mt: 5 }}>No video found.</Typography>;
  }

  return (
    <Box sx={{ p: 3, bgcolor: "#121212", color: "#fff", minHeight: "100vh" }}>
      {/* Video Player */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <video width="80%" controls>
          <source src={video.fileUrl} type="video/mp4" />
        </video>
      </Box>

      {/* Video Details */}
      <Typography variant="h4" sx={{ color: "#BB86FC" }}>{video.name}</Typography>
      <Typography sx={{ color: "#aaa", mt: 1 }}>{video.description}</Typography>
    </Box>
  );
};

export default VideoDetails;
