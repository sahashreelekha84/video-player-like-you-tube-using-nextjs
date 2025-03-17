"use client";

import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  Box,
  Button,
  Paper,
  Grid,
  Typography,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { database } from "../../../../api_url/api";

// Dark Theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#181818", paper: "#212121" },
    text: { primary: "#FFFFFF", secondary: "#B3B3B3" },
    primary: { main: "#FF0000" },
  },
});

interface Video {
  $id: string;
  name: string;
  description: string;
  fileUrl: string;
  createdAt: string;
  likes: number;
}

const VideoList: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [durations, setDurations] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const { data: videos } = useQuery("videos", async () => {
    const response = await database.listDocuments("67d7c818000549f9a3f0", "67d7c83e000abb188865");
    return response.documents as unknown as Video[];
  });

  // Format video duration into mm:ss
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };



  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ p: 3, maxWidth: "1400px", mx: "auto", backgroundColor: "background.default", minHeight: "100vh" }}>
        <Typography variant="h5" fontWeight="bold" mb={2} color="text.primary">
          Uploaded Videos
        </Typography>

        {/* Toggle View & Upload Button */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button
            variant="outlined"
            sx={{ color: "text.primary", borderColor: "text.primary", "&:hover": { borderColor: "primary.main" } }}
            onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
          >
            Toggle {viewMode === "list" ? "Grid" : "List"} View
          </Button>
          <Button variant="contained" color="primary" onClick={() => router.push("/component/videouploader")}>
            Upload New Video
          </Button>
        
        </Box>

        {/* List View */}
        {viewMode === "list" ? (
          <Box>
            {videos?.map((video) => (
              <Paper
                key={video.$id}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  my: 2,
                  borderRadius: "12px",
                  backgroundColor: "background.paper",
                  transition: "background 0.2s, transform 0.2s",
                  "&:hover": { backgroundColor: "#282828", transform: "scale(1.02)" },
                }}
                elevation={3}
              >
                {/* Clickable Video Thumbnail */}
                <Box
                  sx={{
                    flexShrink: 0,
                    width: { xs: "100%", sm: "360px" },
                    height: "200px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Link href={`/component/videodetail/${video.$id}`} passHref>
                    <video
                      width="100%"
                      height="100%"
                      style={{ objectFit: "cover", borderRadius: "8px", cursor: "pointer" }}
                      muted
                      onLoadedMetadata={(e) => {
                        const duration = e.currentTarget.duration;
                        if (!isNaN(duration)) {
                          setDurations((prev) => ({
                            ...prev,
                            [video.$id]: formatDuration(duration),
                          }));
                        }
                      }}
                    >
                      <source src={video.fileUrl} type="video/mp4" />
                    </video>
                  </Link>

                  {/* Video Duration Overlay */}
                  {durations[video.$id] && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        backgroundColor: "rgba(0,0,0,0.7)",
                        color: "white",
                        padding: "4px 6px",
                        borderRadius: "4px",
                        fontSize: "14px",
                      }}
                    >
                      {durations[video.$id]}
                    </Box>
                  )}
                </Box>

                {/* Video Details */}
                <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                  <Link href={`/component/videodetail/${video.$id}`} passHref>
                    <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ cursor: "pointer" }}>
                      {video.name}
                    </Typography>
                  </Link>
                  <Typography variant="body2" color="text.secondary">
                    {video.description}
                  </Typography>

                  {/* Likes and Date */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      👍 {video.likes} Likes
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary">
                      📅 {timeAgo(video.createdAt)}
                    </Typography> */}
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        ) : (
          // Grid View (unchanged)
          <Grid container spacing={2}>
            {videos?.map((video) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={video.$id}>
                <Link href={`/component/videodetail/${video.$id}`} passHref>
                  <Paper
                    sx={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      backgroundColor: "background.paper",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: "200px",
                        overflow: "hidden",
                      }}
                    >
                      <video width="100%" height="100%" style={{ objectFit: "cover", cursor: "pointer" }} muted>
                        <source src={video.fileUrl} type="video/mp4" />
                      </video>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color="text.primary" mt={1}>
                      {video.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {video.description}
                    </Typography>
                  </Paper>
                </Link>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default VideoList;
