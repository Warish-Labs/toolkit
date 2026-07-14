"use client";

import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";

export function BrowserToolsStudioTool() {
  const [activeTab, setActiveTab] = useState("webcam");

  // --- Webcam Snapshot States ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webcamActive, setWebcamActive] = useState(false);
  const [snapshotSrc, setSnapshotSrc] = useState<string | null>(null);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setWebcamActive(true);
      }
    } catch (err) {
      alert("Could not access camera. Please verify permission settings.");
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setWebcamActive(false);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");
    setSnapshotSrc(dataUrl);
  };

  // --- Screen Recorder States ---
  const [screenRecording, setScreenRecording] = useState(false);
  const [screenUrl, setScreenUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startScreenRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setScreenUrl(URL.createObjectURL(blob));
        setScreenRecording(false);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setScreenRecording(true);
    } catch (err) {
      alert("Failed to start screen recording.");
    }
  };

  const stopScreenRecord = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      // Stop display stream tracks
      const stream = mediaRecorderRef.current.stream;
      stream.getTracks().forEach(t => t.stop());
    }
  };

  // --- Audio Recorder States ---
  const [audioRecording, setAudioRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRecorderInstance = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startAudioRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks.current = [];
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        setAudioRecording(false);
      };

      audioRecorderInstance.current = recorder;
      recorder.start();
      setAudioRecording(true);
    } catch (err) {
      alert("Failed to access microphone.");
    }
  };

  const stopAudioRecord = () => {
    if (audioRecorderInstance.current && audioRecorderInstance.current.state !== "inactive") {
      audioRecorderInstance.current.stop();
      audioRecorderInstance.current.stream.getTracks().forEach(t => t.stop());
    }
  };

  // --- Device Input Testers ---
  const [keyboardLog, setKeyboardLog] = useState<string[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== "tester") return;
      setKeyboardLog((prev) => [`Key: ${e.key} | Code: ${e.code}`, ...prev].slice(0, 5));
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); stopWebcam(); }}>
        <TabsList className="grid w-full grid-cols-4 text-[10px] sm:text-xs">
          <TabsTrigger value="webcam">Webcam Capture</TabsTrigger>
          <TabsTrigger value="screen">Screen Recorder</TabsTrigger>
          <TabsTrigger value="audio">Voice Recorder</TabsTrigger>
          <TabsTrigger value="tester">Hardware Tester</TabsTrigger>
        </TabsList>

        {/* ── Webcam Tab ── */}
        <TabsContent value="webcam" className="pt-4 space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative border border-border/60 bg-muted/20 rounded-2xl overflow-hidden w-full max-w-md aspect-video flex items-center justify-center">
              {!webcamActive && (
                <button
                  onClick={startWebcam}
                  className="bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold px-4 py-2 rounded-lg transition"
                >
                  Activate Webcam Stream
                </button>
              )}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${webcamActive ? "block" : "hidden"}`}
              />
            </div>

            {webcamActive && (
              <div className="flex gap-2">
                <button
                  onClick={takeSnapshot}
                  className="bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold px-4 py-2 rounded-lg transition"
                >
                  Take Photo Snapshot
                </button>
                <button
                  onClick={stopWebcam}
                  className="bg-secondary text-muted-foreground hover:bg-secondary/90 text-xs font-semibold px-4 py-2 rounded-lg transition"
                >
                  Turn Off Camera
                </button>
              </div>
            )}

            {snapshotSrc && (
              <div className="space-y-2 text-center pt-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Captured Snapshot</span>
                <img src={snapshotSrc} alt="Snapshot Preview" className="border border-border/60 rounded-xl max-w-sm w-full mx-auto" />
                <a
                  href={snapshotSrc}
                  download="webcam-snapshot.png"
                  className="inline-block text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition"
                >
                  Download Snapshot
                </a>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>
        </TabsContent>

        {/* ── Screen Recorder Tab ── */}
        <TabsContent value="screen" className="pt-4 space-y-4 text-center">
          <div className="max-w-sm mx-auto border border-border/60 bg-muted/20 p-5 rounded-2xl space-y-4">
            <h3 className="font-semibold text-sm">Screen Capture API Recorder</h3>
            
            <div className="flex justify-center gap-3">
              {!screenRecording ? (
                <button
                  onClick={startScreenRecord}
                  className="bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold px-4 py-2 rounded-lg transition"
                >
                  Start Recording Screen
                </button>
              ) : (
                <button
                  onClick={stopScreenRecord}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/95 text-xs font-semibold px-4 py-2 rounded-lg transition"
                >
                  Stop Recording Screen
                </button>
              )}
            </div>

            {screenUrl && (
              <div className="space-y-3 pt-2 text-center">
                <video src={screenUrl} controls className="border rounded-lg max-w-xs mx-auto" />
                <a
                  href={screenUrl}
                  download="screen-record.webm"
                  className="inline-block text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition"
                >
                  Download Recording File
                </a>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Audio Recorder Tab ── */}
        <TabsContent value="audio" className="pt-4 space-y-4 text-center">
          <div className="max-w-sm mx-auto border border-border/60 bg-muted/20 p-5 rounded-2xl space-y-4">
            <h3 className="font-semibold text-sm">Microphone Voice Recorder</h3>

            <div className="flex justify-center gap-3">
              {!audioRecording ? (
                <button
                  onClick={startAudioRecord}
                  className="bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold px-4 py-2 rounded-lg transition"
                >
                  Start Voice Recording
                </button>
              ) : (
                <button
                  onClick={stopAudioRecord}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/95 text-xs font-semibold px-4 py-2 rounded-lg transition"
                >
                  Stop Voice Recording
                </button>
              )}
            </div>

            {audioUrl && (
              <div className="space-y-3 pt-2 text-center">
                <audio src={audioUrl} controls className="mx-auto" />
                <a
                  href={audioUrl}
                  download="audio-record.webm"
                  className="inline-block text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition"
                >
                  Download Audio File
                </a>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Hardware Tester Tab ── */}
        <TabsContent value="tester" className="pt-4 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Keyboard Tester */}
            <div className="border border-border/60 bg-muted/20 p-5 rounded-2xl space-y-3">
              <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Keyboard Event Tester</h3>
              <p className="text-[11px] text-muted-foreground">Press any key on your keyboard to test event logs:</p>
              
              <div className="space-y-1 max-h-[140px] overflow-y-auto font-mono text-[11px]">
                {keyboardLog.length > 0 ? (
                  keyboardLog.map((log, idx) => (
                    <div key={idx} className="bg-card border p-2 rounded">{log}</div>
                  ))
                ) : (
                  <div className="text-muted-foreground italic text-center py-4">No keypress registered yet.</div>
                )}
              </div>
            </div>

            {/* Mouse position Tester */}
            <div
              onMouseMove={handleMouseMove}
              className="border border-border/60 bg-muted/20 p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-crosshair min-h-[180px]"
            >
              <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2">Mouse Grid Coordinates</h3>
              <div className="text-2xl font-bold font-mono text-primary">
                X: {mousePos.x}px | Y: {mousePos.y}px
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">Move cursor within this card to read coordinates.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
