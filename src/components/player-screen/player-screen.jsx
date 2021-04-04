import React, {useRef, useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {getRunTime} from '../../utils';

const PlayerScreen = () => {
  const history = useHistory();

  const {filmData: {
    backgroundImage,
    videoLink,
    runTime,
  }} = useSelector((state) => state.FILM_DATA.film);

  const [play, setPlay] = useState({
    playing: false,
    time: getRunTime(runTime),
    timeElapsed: 0
  });
  const playerRef = useRef();
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      playerRef.current.pause();
      playerRef.current.currentTime = 0;
    };
  }, []);

  const onPlayButton = () => {
    setPlay({
      ...play,
      playing: !play.playing
    });
    if (!play.playing) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
    }
  };

  const onPauseHandle = () => {
    clearTimeout(timerRef.current);
  };

  const onPlayHandle = () => {
    timerRef.current = setInterval(() => {
      let minutes = Math.floor(playerRef.current.currentTime / 60);
      let runTimeNow = runTime - minutes;
      setPlay({
        ...play,
        time: getRunTime(runTimeNow),
        timeElapsed: playerRef.current.currentTime / (runTime * 60) * 100
      });
    }, 1000);
  };

  const onOpenFullscreen = () => {
    if (playerRef.current.requestFullscreen) {
      playerRef.current.requestFullscreen();
    } else if (playerRef.current.webkitRequestFullscreen) { /* Safari */
      playerRef.current.webkitRequestFullscreen();
    } else if (playerRef.current.msRequestFullscreen) { /* IE11 */
      playerRef.current.msRequestFullscreen();
    }
  };

  return (
    <div className="player">
      <video
        src={videoLink}
        className="player__video"
        poster={backgroundImage}
        ref={playerRef}
        onPlay={onPlayHandle}
        onPause={onPauseHandle}
      ></video>

      <button onClick={() => history.goBack()} type="button" className="player__exit">Exit</button>

      <div className="player__controls">
        <div className="player__controls-row">
          <div className="player__time">
            <progress
              className="player__progress"
              value={play.timeElapsed}
              max="100"
            ></progress>
            <div className="player__toggler" style={{left: `${play.timeElapsed}%`}}>Toggler</div>
          </div>
          <div className="player__time-value">{play.time}</div>
        </div>

        <div className="player__controls-row">
          <button
            type="button"
            className="player__play"
            onClick={onPlayButton}
          >
            <svg viewBox="0 0 19 19" width="19" height="19">
              <use xlinkHref={play.playing ? `#pause` : `#play-s`}></use>
            </svg>
            <span>Play</span>
          </button>
          <div className="player__name">Transpotting</div>

          <button
            type="button"
            className="player__full-screen"
            onClick={onOpenFullscreen}
          >
            <svg viewBox="0 0 27 27" width="27" height="27">
              <use xlinkHref="#full-screen"></use>
            </svg>
            <span>Full screen</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerScreen;
