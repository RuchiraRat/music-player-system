const menuBtn = document.querySelector(".menu-btn"),
    container = document.querySelector(".container");

const progressBar = document.querySelector(".bar"),
    progressDot = document.querySelector(".dot"),
    currentTimeEl = document.querySelector(".current-time"),
    DurationEl = document.querySelector(".duration");

const addSongBtn = document.querySelector("#add-song");
const fileInput = document.querySelector("#fileInput");

const searchBtn = document.querySelector('.search-btn');
const closeBtn = document.querySelector('.close-btn');
const searchBar = document.querySelector('.search-bar');
const overlay = document.querySelector('.overlay');

searchBtn.addEventListener('click', () => {
    searchBar.style.display = 'block';
    overlay.style.display = 'block';  // Show the blurred overlay
});

closeBtn.addEventListener('click', () => {
    searchBar.style.display = 'none';
    overlay.style.display = 'none';   // Hide the blurred overlay
});

menuBtn.addEventListener("click", () => {
    container.classList.toggle("active");
});

let currentSongIndex = 0,
    shuffle = false,
    repeat = 0,
    favourites = [],
    audio = new Audio(),
    playing = false;

const songs = [
    { title: "Arcade x Mann Mera", artist: "Artist 1", img_src: "1.jpg", src: "1.mp3" },
    { title: "See You Again", artist: "Wiz Khalifa", img_src: "2.jpg", src: "2.mp3" },
    { title: "Ganjaman", artist: "Alfons", img_src: "1.jpg", src: "3.mp3" },
    { title: "Friday Night", artist: "Vigiland", img_src: "2.jpg", src: "4.mp3" },
    { title: "Tetris", artist: "Critical Hit", img_src: "1.jpg", src: "5.mp3" },
    { title: "Candy Paint", artist: "Post Malone", img_src: "2.jpg", src: "6.mp3" }
];

const playlistContainer = document.querySelector("#playlist"),
    infoWrapper = document.querySelector(".info"),
    coverImage = document.querySelector(".cover-image"),
    currentSongTitle = document.querySelector(".current-song-title"),
    currentFavourite = document.querySelector("#current-favourite");

let currentAudio = null;

function init() {
    updatePlaylist(songs);
    loadSong(currentSongIndex);
}
init();

function updatePlaylist(songs) {
    playlistContainer.innerHTML = "";

    songs.forEach((song, index) => {
        const isFavourite = favourites.includes(index);
        const tr = document.createElement("tr");
        tr.classList.add("song");

        
        tr.innerHTML = `
            <td class="no"><h5>${index + 1}</h5></td>
            <td class="title"><h6>${song.title}</h6></td>
            <td class="length"><h5>2:03</h5></td>
            <td><i class="fas fa-heart ${isFavourite ? "active" : ""}"></i></td>
        `;
       
        playlistContainer.appendChild(tr);


        tr.querySelector(".fa-heart").addEventListener("click", (e) => {
            addToFavourites(index);
            e.target.classList.toggle("active");
            e.stopPropagation();  // Prevent song from playing when heart is clicked
        });

        tr.addEventListener("click", () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        });

        // Load duration of the song
        const audioForDuration = new Audio(`music-player-system-main/${song.src}`);
        audioForDuration.addEventListener("loadedmetadata", () => {
            const duration = formatTime(audioForDuration.duration);
            tr.querySelector(".length h5").innerText = duration;
        });
    });
}

function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
}

function loadSong(index) {
    const song = songs[index];
    audio.src = `music-player-system-main/${song.src}`;
    currentSongTitle.innerHTML = song.title;
    infoWrapper.innerHTML = `<h2>${song.title}</h2><h3>${song.artist}</h3>`;
    coverImage.style.backgroundImage = `url(music-player-system-main/${song.img_src})`;

    if (favourites.includes(index)) {
        currentFavourite.classList.add("active");
    } else {
        currentFavourite.classList.remove("active");
    }
}

function playSong() {
    if (playing) {
        audio.pause();
        playing = false;
        playPauseBtn.classList.replace("fa-pause", "fa-play");
    } else {
        audio.play();
        playing = true;
        playPauseBtn.classList.replace("fa-play", "fa-pause");
    }
}

const playPauseBtn = document.querySelector("#playpause"),
    nextBtn = document.querySelector("#next"),
    prevBtn = document.querySelector("#prev");

playPauseBtn.addEventListener("click", playSong);

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    playSong();
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    playSong();
}

function addToFavourites(index) {
    if (favourites.includes(index)) {
        favourites = favourites.filter(item => item !== index);
    } else {
        favourites.push(index);
    }
    updatePlaylist(songs);
}

currentFavourite.addEventListener("click", () => {
    addToFavourites(currentSongIndex);
});

const shuffleBtn = document.querySelector("#shuffle");
shuffleBtn.addEventListener("click", () => {
    shuffle = !shuffle;
    shuffleBtn.classList.toggle("active");
});

function shuffleSongs() {
    if (shuffle) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    }
}

const repeatBtn = document.querySelector("#repeat");
repeatBtn.addEventListener("click", () => {
    repeat = (repeat + 1) % 3;
    repeatBtn.classList.toggle("active", repeat > 0);
});

audio.addEventListener("ended", () => {
    if (repeat === 1) {
        playSong();  // Repeat the current song
    } else if (repeat === 2 || shuffle) {
        nextSong();  // Play next or shuffle if repeat-all or shuffle is on
    } else if (currentSongIndex < songs.length - 1) {
        nextSong();  // Play next song if not the last song
    } else {
        playPauseBtn.classList.replace("fa-pause", "fa-play");
        playing = false;
    }
});

function updateProgress() {
    const { duration, currentTime } = audio;
    if (!isNaN(duration)) {
        currentTimeEl.textContent = formatTime(currentTime);
        DurationEl.textContent = formatTime(duration);
        const progressPercentage = (currentTime / duration) * 100;
        progressDot.style.left = `${progressPercentage}%`;
    }
}

audio.addEventListener("timeupdate", updateProgress);

progressBar.addEventListener("click", (e) => {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
});

document.addEventListener("DOMContentLoaded", () => {
    addSongBtn.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", (event) => {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const newSong = {
                title: file.name.split(".")[0],
                artist: "Unknown Artist",
                img_src: "default.jpg",
                src: URL.createObjectURL(file)
            };
            songs.push(newSong);
        }
        updatePlaylist(songs);
    });
});
