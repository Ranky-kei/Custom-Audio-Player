document.addEventListener("DOMContentLoaded", function() {
    const audio = document.getElementById("audio");
    const playPauseButton = document.getElementById("play-pause");
    const playIcon = document.getElementById("play-icon");
    const pauseIcon = document.getElementById("pause-icon");
    const loadingAnimation = document.getElementById("loading-animation");
    const rewindButton = document.getElementById("rewind-button");
    const forwardButton = document.getElementById("forward-button");
    const prevTrackButton = document.getElementById("prev-track-button");
    const nextTrackButton = document.getElementById("next-track-button");
    const shuffleButton = document.getElementById("shuffle-button");
    const repeatButton = document.getElementById("repeat-button");
    const seekBar = document.getElementById("seek-bar");
    const currentTimeElem = document.getElementById("current-time");
    const durationElem = document.getElementById("duration");
    const volumeSlider = document.getElementById("volume-slider");
    const volumeDisplay = document.getElementById("volume-display");
    const trackNameElem = document.getElementById("track-name");
    const queueList = document.getElementById("queue-list");

    let trackQueue = [
        { name: "ユメの喫茶店", src: "audio/ミツキヨ (Mitsukiyo) - ユメの喫茶店/01. ユメの喫茶店.flac" },
        { name: "ようこそトロイメへ", src: "audio/ミツキヨ (Mitsukiyo) - ユメの喫茶店/02. ようこそトロイメへ.flac" },
        { name: "日差しの中のティータイム", src: "audio/ミツキヨ (Mitsukiyo) - ユメの喫茶店/03. 日差しの中のティータイム.flac" },
        { name: "ユノのアトリエ", src: "audio/ミツキヨ (Mitsukiyo) - ユメの喫茶店/04. ユノのアトリエ.flac" },
        { name: "YU.ME.NO!", src: "audio/ミツキヨ (Mitsukiyo) - ユメの喫茶店/05. YU.ME.NO!.flac" },
        { name: "昼下がりのメリエンダ", src: "audio/ミツキヨ (Mitsukiyo) - ユメの喫茶店/06. 昼下がりのメリエンダ.flac" },
        { name: "雨の日トロイメライ", src: "audio/ミツキヨ (Mitsukiyo) - ユメの喫茶店/07. 雨の日トロイメライ.flac" },
        { name: "スノーヘルツ", src: "audio/ミツキヨ (Mitsukiyo) - ユメの喫茶店/08. スノーヘルツ.flac" },
        { name: "Our home", src: "audio/ミツキヨ (Mitsukiyo) - ユメの喫茶店/09. Our home.flac" },
        { name: "トロイメ・ダイアリー feat. ユノ (CV- 白咲べる)", src: "audio/ミツキヨ (Mitsukiyo) - ユメの喫茶店/10. トロイメ・ダイアリー feat. ユノ (CV- 白咲べる).flac" }
    ];
    let currentTrackIndex = 0;
    let isShuffle = false;
    let isRepeat = false;

    // Load initial track
    loadTrack(currentTrackIndex);

    // Set initial volume from localStorage or default
    const volume = localStorage.getItem('volume') || 0.5;
    volumeSlider.value = volume * 100;
    volumeDisplay.textContent = `${volumeSlider.value}%`;
    audio.volume = volume;

    // Update track info on load
    audio.addEventListener("loadedmetadata", function() {
        durationElem.textContent = formatTime(audio.duration);
        seekBar.max = audio.duration - 1;
    });

    // Play/Pause toggle
    playPauseButton.addEventListener("click", function() {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });

    // Rewind 5 seconds
    rewindButton.addEventListener("click", function() {
        audio.currentTime = Math.max(0, audio.currentTime - 5);
    });

    // Forward 5 seconds
    forwardButton.addEventListener("click", function() {
        audio.currentTime = Math.min(audio.duration - 1, audio.currentTime + 5);
    });

    // Play previous track
    prevTrackButton.addEventListener("click", function() {
        if (currentTrackIndex > 0) {
            currentTrackIndex--;
        } else {
            currentTrackIndex = trackQueue.length - 1;
        }
        loadTrack(currentTrackIndex);
        audio.play();
    });

    // Play next track
    nextTrackButton.addEventListener("click", function() {
        nextTrack();
    });

    // Shuffle tracks
    shuffleButton.addEventListener("click", function() {
        isShuffle = !isShuffle;
        shuffleButton.classList.toggle('active', isShuffle);
    });

    // Repeat toggle
    repeatButton.addEventListener("click", function() {
        isRepeat = !isRepeat;
        repeatButton.classList.toggle('active', isRepeat);
    });

    // Update seek bar and current time display during playback
    audio.addEventListener("timeupdate", function() {
        seekBar.value = audio.currentTime;
        currentTimeElem.textContent = formatTime(audio.currentTime);
    });

    // Loading animation during buffering
    audio.addEventListener("waiting", function() {
        playIcon.style.display = "none";
        pauseIcon.style.display = "none";
        loadingAnimation.style.display = "block";
    });

    audio.addEventListener("canplay", function() {
        if (audio.paused) {
            playIcon.style.display = "block";
        } else {
            pauseIcon.style.display = "block";
        }
        loadingAnimation.style.display = "none";
    });

    audio.addEventListener("ended", function() {
        if (isRepeat && !isShuffle) {
            loadTrack(currentTrackIndex);
            audio.play();
        } else {
            nextTrack();
        }
    });

    // Play button visibility
    audio.addEventListener("play", function() {
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
        loadingAnimation.style.display = "none";
    });

    // Pause button visibility
    audio.addEventListener("pause", function() {
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
        loadingAnimation.style.display = "none";
    });

    // Update seek bar on user input
    seekBar.addEventListener("input", function() {
        audio.currentTime = seekBar.value;
    });

    // Update volume display and save to localStorage
    volumeSlider.addEventListener("input", function() {
        audio.volume = volumeSlider.value / 100;
        volumeDisplay.textContent = `${volumeSlider.value}%`;
        localStorage.setItem('volume', audio.volume);
    });

    // Load a specific track
    function loadTrack(index) {
        audio.src = trackQueue[index].src;
        trackNameElem.textContent = trackQueue[index].name;
        updateQueueDisplay();
    }

    // Move to the next track
    function nextTrack() {
        if (isShuffle) {
            currentTrackIndex = Math.floor(Math.random() * trackQueue.length);
        } else {
            currentTrackIndex = (currentTrackIndex + 1) % trackQueue.length;
        }
        loadTrack(currentTrackIndex);
        audio.play();
    }

    // Update queue display
    function updateQueueDisplay() {
        queueList.innerHTML = '';
        trackQueue.forEach((track, index) => {
            const trackItem = document.createElement('li');
            trackItem.textContent = track.name;
            trackItem.classList.toggle('current', index === currentTrackIndex);
            trackItem.addEventListener('click', () => {
                currentTrackIndex = index;
                loadTrack(currentTrackIndex);
                audio.play();
            });
            queueList.appendChild(trackItem);
        });
    }

    // Format time in minutes and seconds
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
});
