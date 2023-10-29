import React, {useState, useRef, useEffect} from 'react';

import './styles/AudioPlayer.css';


import download__icon from "../../assets/icons/download-icon.jpg"
import play__icon from "../../assets/icons/play-icon.jpg"
import pause__icon from "../../assets/icons/pause-icon.jpg"
import volume__icon from "../../assets/icons/volume-icon.jpg"
import volume_off__icon from "../../assets/icons/volume-off-icon.jpg"
import current__image from "../../assets/img/current-episode.jpg"
import current__audio from "../../assets/audio/file_example_MP3_5MG.mp3"

const current__episode = "How to rapidly test any experience!"

function AudioPlayer() {

    const [isPlaying, setIsPlaying] = useState(false);
    const [isOpenVolume, setIsOpenVolume] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentVolume, setCurrentVolume] = useState(0.5);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    let audioProgressBarWidth = `${(currentTime / duration) * 100}%`;
    let volumeProgressBarWidth = `${(currentVolume*100)}%`;

    useEffect(() => {
        const onLoadedMetadata = () => {
            setDuration(audioRef.current.duration);
        };

        if (audioRef.current) {
            audioRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('loadedmetadata', onLoadedMetadata);
            }
        };
    }, []);

    const playPauseHandler = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const timeUpdateHandler = (e) => {
        const current = e.target.currentTime;
        setCurrentTime(current);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60).toString().padStart(2, '0');
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const volumeChangeHandler = (e) => {
        const newVolume = parseFloat(e.target.value);
        audioRef.current.volume = newVolume;
        setCurrentVolume(newVolume);
    };

    const VolumeHandler = () => {
        setIsOpenVolume(!isOpenVolume);
    };

    const downloadAudioHandler = () => {
        const a = document.createElement('a');
        a.href = current__audio;
        a.download = 'audio.mp3';
        a.click();
    };

    return (
        <div className="current-episode">
            <img src={current__image} alt="" className="current-episode__image"/>
            <h1 className="current-episode__title">{current__episode}</h1>
            <div className="current-episode__audio">
                <div className="audio-play-button" onClick={playPauseHandler}>
                    <img className="audio-button__image" src={isPlaying ? pause__icon : play__icon} alt="Play/Pause" />
                </div>
                <div className="audio-time">
                    <h6 className="audio-time">
                        {formatTime(currentTime)}
                    </h6>
                </div>
                <div className="audio-progress-bar">
                    <input
                        className="audio-progress-bar__input"
                        type="range"
                        min="0"
                        max={Math.floor(duration)}
                        value={currentTime}
                        onChange={(e) => {
                            const newTime = e.target.value;
                            audioRef.current.currentTime = newTime;
                            setCurrentTime(newTime);
                        }}
                        style={{ '--progress-audio-width': audioProgressBarWidth }}
                    />
                </div>
                <div className="audio-time">
                    <h6 className="audio-time">
                        {formatTime(duration-currentTime)}
                    </h6>
                </div>
                <div className="audio-volume-button" onClick={VolumeHandler}>
                    <img className="audio-button__image" src={(currentVolume == 0)? volume_off__icon : volume__icon} alt="Volume" />
                </div>
                <div className={isOpenVolume ? "volume-progress-bar volume-open" : "volume-progress-bar volume-close" }>
                    <input
                        className="volume-progress-bar__input"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={currentVolume}
                        onChange={volumeChangeHandler}
                        style={{ '--progress-volume-width': volumeProgressBarWidth }}
                    />
                </div>
                <div className="audio-download-button" onClick={downloadAudioHandler}>
                    <img className="audio-button__image" src={download__icon} alt="Download" />
                </div>
            </div>
            <h6 className="current-episode__link-title">LISTEN ON</h6>
            <div className="current-episode__link">
                <a href="https://open.spotify.com/" target="_blank" className="icon-spotify"></a>
                <a href="https://soundcloud.com/" target="_blank" className="icon-soundcloud"></a>
                <a href="https://music.apple.com/" target="_blank" className="icon-apple"></a>
            </div>
            <audio
                ref={audioRef}
                src={current__audio}
                onTimeUpdate={timeUpdateHandler}
                onLoadedMetadata={(e) => setCurrentTime(e.target.duration)}
            />
        </div>
    );
}

export default AudioPlayer;