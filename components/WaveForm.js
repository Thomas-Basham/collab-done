import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HiPlay, HiPause } from "react-icons/hi";
import { FiPlay, FiPause } from "react-icons/fi";
import CommentSection from "./CommentSection";

// *************** Thank you to https://codesandbox.io/s/gjn3t ***************

export default function WaveForm(props) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlaying] = useState(false);

  const url = props.url;
  const formWaveSurferOptions = (ref) => ({
    container: ref,
    waveColor: "#24b47e",
    progressColor: "#eee",
    cursorColor: "white",
    barWidth: 3,
    barRadius: 3,
    responsive: false,
    height: 150,
    normalize: true,
    partialRender: true,
    mediaControls: true,
  });
  useEffect(() => {
    create();
  }, []);

  const create = async () => {
    const WaveSurfer = (await import("wavesurfer.js")).default;

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    let songDuration = await wavesurfer.current.getDuration();
    wavesurfer.current.load(url);
  };

  const handlePlayPause = () => {
    if (wavesurfer.current.isReady) {
      setPlaying(!playing);
      wavesurfer.current.playPause();
    }
  };

  return (
    <div className="audio-container row">
      <div className="controls col-2">
        <div
          onClick={handlePlayPause}
          className="play-button"
          style={{ cursor: "pointer" }}
        >
          {!playing ? (
            <FiPlay
              value={{ color: "blue", className: "play-button" }}
              size={80}
            />
          ) : (
            <FiPause size={80} />
          )}
        </div>
      </div>
      <div className="wave-container col">
        <div id={props.indexNumber} ref={waveformRef} className="wave-song" />
      </div>
      <CommentSection songDetails={wavesurfer.current} song_id={props.song_id} />
    </div>
  );
}
