import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HiPlay, HiPause } from "react-icons/hi";
import { FiPlay, FiPause } from "react-icons/fi";

// *************** Thank you to https://codesandbox.io/s/gjn3t ***************

const formWaveSurferOptions = (ref) => ({
  container: ref,
  waveColor: "#24b47e",
  progressColor: "#eee",
  cursorColor: "white",
  barWidth: 3,
  barRadius: 3,
  responsive: true,
  height: 150,
  normalize: true,
  partialRender: true,
  mediaControls: true,
});

export default function IndexPage(props) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlaying] = useState(false);

  // const url =
  //   "https://www.mfiles.co.uk/mp3-downloads/brahms-st-anthony-chorale-theme-two-pianos.mp3";
  const url = props.url;

  useEffect(() => {
    create();

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, []);

  const create = async () => {
    const WaveSurfer = (await import("wavesurfer.js")).default;

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load(url);
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
    wavesurfer.current.playPause();
  };

  return (
    <div className="audio-container row">
      <div className="controls col-2">
        {/* <div onClick={handlePlayPause}>{!playing ? "Paused" : "Playing"}</div> */}
        <div
          onClick={handlePlayPause}
          className="play-button"
          style={{ cursor: "pointer" }}
        >
          {!playing ? <FiPlay size={80} /> : <FiPause size={80} />}
        </div>
      </div>
      <div className="wave-container col">
        <div id={props.indexNumber} ref={waveformRef} className="wave-song" />
      </div>
    </div>
  );
}
