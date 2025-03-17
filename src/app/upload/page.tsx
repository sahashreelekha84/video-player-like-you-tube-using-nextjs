import VideoUploader from "../component/videouploader/page";
import { Container, Typography } from "@mui/material";

export default function UploadPage() {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" textAlign="center">
        Video Upload with Appwrite
      </Typography>
      <VideoUploader />
    </Container>
  );
}