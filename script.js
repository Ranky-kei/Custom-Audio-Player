document.addEventListener("DOMContentLoaded", function() {
    const audio = document.getElementById("audio");
    const playPauseButton = document.getElementById("play-pause");
    const playIcon = document.getElementById("play-icon");
    const pauseIcon = document.getElementById("pause-icon");
    const rewindButton = document.getElementById("rewind");
    const fastForwardButton = document.getElementById("fast-forward");
    const seekBar = document.getElementById("seek-bar");
    const currentTimeElem = document.getElementById("current-time");
    const durationElem = document.getElementById("duration");
    const volumeSlider = document.getElementById("volume-slider");
    const volumeDisplay = document.getElementById("volume-display");
    const trackNameElem = document.getElementById("track-name");

    const trackName = "Your Track Name"; // Set your track name here
    trackNameElem.textContent = trackName;
    
    const currentVolume = localStorage.getItem('volume') || volumeSlider.value / 100;
    volumeSlider.value = currentVolume * 100;
    volumeDisplay.textContent = `${volumeSlider.value}%`;
    audio.volume = currentVolume;

    playPauseButton.addEventListener("click", function() {
        if (audio.paused) {
            audio.play();
            playIcon.style.display = "none";
            pauseIcon.style.display = "block";
        } else {
            audio.pause();
            playIcon.style.display = "block";
            pauseIcon.style.display = "none";
        }
    });

    rewindButton.addEventListener("click", function() {
        audio.currentTime = Math.max(0, audio.currentTime - 5);
    });

    fastForwardButton.addEventListener("click", function() {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    });

    audio.addEventListener("loadedmetadata", function() {
        const duration = formatTime(audio.duration);
        durationElem.textContent = duration;
        seekBar.max = audio.duration;
    });

    audio.addEventListener("timeupdate", function() {
        seekBar.value = audio.currentTime;
        currentTimeElem.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener("ended", function() {
        audio.currentTime = 0;
        currentTimeElem.textContent = formatTime(0);
        seekBar.value = 0;
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
    });

    seekBar.addEventListener("input", function() {
        audio.currentTime = seekBar.value;
    });

    volumeSlider.addEventListener("input", function() {
        audio.volume = volumeSlider.value / 100;
        volumeDisplay.textContent = `${volumeSlider.value}%`;
        localStorage.setItem('volume', volumeSlider.value / 100);
    });

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
});
