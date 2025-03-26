"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { 
  IconVideo, 
  IconVideoOff, 
  IconPlayerPlay, 
  IconPlayerStop, 
  IconDeviceFloppy, 
  IconTrash, 
  IconCameraSelfie,
  IconPhotoVideo
} from "@tabler/icons-react";

export default function WebcamRecorder() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [recordedVideoURL, setRecordedVideoURL] = useState<string>("");
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [error, setError] = useState<string>("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Obtenir la liste des caméras disponibles
  useEffect(() => {
    async function getAvailableCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(videoDevices);
        
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error("Erreur lors de l'énumération des périphériques:", err);
        setError("Impossible d'accéder aux périphériques vidéo.");
      }
    }
    
    getAvailableCameras();
  }, []);
  
  // Activer ou désactiver la caméra
  const toggleCamera = async () => {
    if (cameraActive) {
      // Arrêter la caméra
      stopCamera();
    } else {
      // Démarrer la caméra
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: selectedCamera ? { deviceId: { exact: selectedCamera } } : true,
          audio: true
        });
        
        setStream(mediaStream);
        setCameraActive(true);
        setError("");
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Erreur lors de l'accès à la caméra:", err);
        setError("Impossible d'accéder à la caméra. Vérifiez les autorisations.");
      }
    }
  };
  
  // Arrêter la caméra
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    setCameraActive(false);
    
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  // Changer de caméra
  const handleCameraChange = async (deviceId: string) => {
    setSelectedCamera(deviceId);
    
    if (cameraActive) {
      // Arrêter la caméra actuelle
      stopCamera();
      
      // Petit délai pour s'assurer que la caméra est bien arrêtée
      setTimeout(() => {
        toggleCamera();
      }, 300);
    }
  };
  
  // Démarrer l'enregistrement
  const startRecording = () => {
    if (!stream) return;
    
    setRecordedChunks([]);
    setRecordingTime(0);
    
    if (recordedVideoURL) {
      URL.revokeObjectURL(recordedVideoURL);
      setRecordedVideoURL("");
    }
    
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        setRecordedChunks(prev => [...prev, event.data]);
      }
    };
    
    mediaRecorder.onstop = () => {
      if (recordedChunks.length > 0) {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoURL(url);
      }
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(1000); // Enregistrer par segments de 1 seconde
    setRecording(true);
    
    // Démarrer le chronomètre
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };
  
  // Arrêter l'enregistrement
  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      toast.success("Enregistrement terminé!");
    }
  };
  
  // Sauvegarder la vidéo
  const saveVideo = () => {
    if (!recordedVideoURL) return;
    
    const a = document.createElement('a');
    a.href = recordedVideoURL;
    a.download = `webcam-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Vidéo téléchargée avec succès!");
  };
  
  // Supprimer l'enregistrement
  const deleteRecording = () => {
    if (recordedVideoURL) {
      URL.revokeObjectURL(recordedVideoURL);
    }
    
    setRecordedChunks([]);
    setRecordedVideoURL("");
    setRecordingTime(0);
    
    toast.success("Enregistrement supprimé!");
  };
  
  // Formater le temps d'enregistrement
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <IconCameraSelfie size={24} className="mr-2 text-red-500" />
          Enregistreur Webcam
        </h2>
      </div>
      
      {error && (
        <div className="bg-red-900/40 border border-red-800 text-red-100 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-black rounded-lg overflow-hidden relative">
            <video 
              ref={videoRef}
              autoPlay 
              playsInline
              muted
              className="w-full h-64 object-cover"
            />
            
            {!cameraActive && !recordedVideoURL && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                <IconVideoOff size={40} className="text-slate-400" />
              </div>
            )}
            
            {recording && (
              <div className="absolute top-2 right-2 bg-red-600 px-2 py-1 rounded flex items-center">
                <div className="animate-pulse w-3 h-3 bg-white rounded-full mr-1"></div>
                <span className="text-white text-xs">{formatTime(recordingTime)}</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Caméra
              </label>
              <select
                value={selectedCamera}
                onChange={(e) => handleCameraChange(e.target.value)}
                disabled={cameraActive}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
              >
                {availableCameras.length === 0 ? (
                  <option value="">Pas de caméra détectée</option>
                ) : (
                  availableCameras.map((camera, index) => (
                    <option key={camera.deviceId} value={camera.deviceId}>
                      {camera.label || `Caméra ${index + 1}`}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={toggleCamera}
                className={`w-full px-4 py-2 rounded-md flex items-center justify-center ${
                  cameraActive 
                    ? "bg-red-600 hover:bg-red-700" 
                    : "bg-green-600 hover:bg-green-700"
                } text-white`}
                disabled={availableCameras.length === 0}
              >
                {cameraActive ? (
                  <>
                    <IconVideoOff size={18} className="mr-1" />
                    Arrêter la caméra
                  </>
                ) : (
                  <>
                    <IconVideo size={18} className="mr-1" />
                    Démarrer la caméra
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex justify-between gap-2">
            <button
              onClick={startRecording}
              disabled={!cameraActive || recording}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-md flex items-center justify-center flex-1"
            >
              <IconPlayerPlay size={18} className="mr-1" />
              Démarrer
            </button>
            
            <button
              onClick={stopRecording}
              disabled={!recording}
              className="bg-slate-600 hover:bg-slate-700 disabled:opacity-50 text-white px-4 py-2 rounded-md flex items-center justify-center flex-1"
            >
              <IconPlayerStop size={18} className="mr-1" />
              Arrêter
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-slate-700/30 rounded-lg p-4 h-full">
            <h3 className="text-md font-medium mb-2 flex items-center">
              <IconPhotoVideo size={18} className="mr-1 text-green-400" />
              Prévisualisation de l'enregistrement
            </h3>
            
            <div className="bg-black rounded-md overflow-hidden relative h-64">
              {recordedVideoURL ? (
                <video 
                  src={recordedVideoURL} 
                  controls 
                  className="w-full h-full"
                ></video>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-slate-400">Aucun enregistrement</p>
                </div>
              )}
            </div>
            
            {recordedVideoURL && (
              <div className="flex justify-between mt-4">
                <button
                  onClick={deleteRecording}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <IconTrash size={16} className="mr-1" />
                  Supprimer
                </button>
                
                <button
                  onClick={saveVideo}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <IconDeviceFloppy size={16} className="mr-1" />
                  Télécharger
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-slate-700/30 p-4 rounded-md text-sm text-slate-300">
        <h3 className="font-medium text-white mb-2">À propos de l'enregistrement Webcam</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>L'accès à la caméra et au microphone nécessite votre autorisation.</li>
          <li>Les enregistrements sont stockés temporairement dans votre navigateur.</li>
          <li>Aucune donnée n'est envoyée à un serveur, tout reste sur votre appareil.</li>
          <li>Les vidéos sont enregistrées au format WebM, compatible avec la plupart des navigateurs modernes.</li>
          <li>Pour une meilleure qualité, assurez-vous d'avoir un bon éclairage.</li>
        </ul>
      </div>
    </div>
  );
}