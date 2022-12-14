import { useEffect, useState } from "react";

const useRecorder = () => {
  const [audioURL, setAudioURL] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<any>(null);

  useEffect(() => {
    // Lazily obtain recorder first time we're recording.
    if (!recorder) {
      if (isRecording) {
        requestRecorder()
          .then(setRecorder)
          //by me
          .catch((err) => {
            //console.log(err);
          });
      }
      return;
    }

    // Manage recorder state.
    if (isRecording) {
      recorder.start();
    } else {
      recorder.stop();
    }

    // Obtain the audio when ready.
    const handleData = (e: any) => {
      setAudioURL(URL.createObjectURL(e.data));
    };
    recorder.addEventListener("dataavailable", handleData);
    return () => recorder.removeEventListener("dataavailable", handleData);
  }, [recorder, isRecording]);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
  };

  return [audioURL, isRecording, startRecording, stopRecording, recorder];
};

async function requestRecorder() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const myStream = mediaRecorder.stream;
  //console.log(myStream);
  return mediaRecorder;
}

export default useRecorder;
