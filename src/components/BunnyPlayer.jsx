import { useEffect, useRef } from "react";

export default function BunnyPlayer({ bunnyVideoId, token, expires, libraryId = import.meta.env.VITE_BUNNY_LIBRARY_ID, onProgress, onEnded }) {
  const iframeRef = useRef(null);
  
  // Throttle progress updates to avoid too many requests
  const lastProgressTime = useRef(0);

  useEffect(() => {
    const handleMessage = (event) => {
      // Validate origin if possible, Bunny uses iframe.mediadelivery.net or video.bunnycdn.com
      if (!event.origin.includes("mediadelivery.net") && !event.origin.includes("bunnycdn.com")) {
         return;
      }

      try {
        const data = JSON.parse(event.data);
        
        if (data.event === "timeupdate") {
          const currentTime = data.currentTime;
          // Send progress every 10 seconds to avoid spamming the backend
          if (currentTime - lastProgressTime.current >= 10) {
             lastProgressTime.current = currentTime;
             if (onProgress) onProgress(currentTime);
          }
        }
        
        if (data.event === "ended") {
          if (onEnded) onEnded();
        }
      } catch (e) {
        // Ignore JSON parse errors from other messages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onProgress, onEnded]);

  if (!libraryId) {
    return <div className="text-white text-center p-4">Please set VITE_BUNNY_LIBRARY_ID in your .env file</div>;
  }

  let src = `https://iframe.mediadelivery.net/embed/${libraryId}/${bunnyVideoId}?autoplay=false`;
  if (token) {
     src += `&token=${token}`;
  }
  if (expires) {
     src += `&expires=${expires}`;
  }

  return (
    <iframe
      ref={iframeRef}
      src={src}
      loading="lazy"
      style={{ border: 0, position: "absolute", top: 0, height: "100%", width: "100%" }}
      allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
      allowFullScreen={true}
    ></iframe>
  );
}
