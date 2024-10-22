console.log("js starteed !!");
let currentsong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
    // Validate input
    if (isNaN(seconds) || seconds < 0) {
        return "00/00";
    }

    // Calculate minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds with leading zeros
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time
    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(tds);
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}`)[0, 1]);
        }
    }
    let songsul = document.querySelector('.songlist').getElementsByTagName('ul')[0]
    songsul.innerHTML = "";
    // let numberedSongs = songs.map((song, index) => `${index + 1}. ${song}`);

    for (const song of songs) {
        songsul.innerHTML = songsul.innerHTML + `<li>
        
        
        <img class="invert" src="img/music.svg" alt="">
        <div class="info">
        <div>${song.replaceAll("%20", " ").replaceAll("/", "")}</div>
                </div>
                <div class="playnow">
                <img src="img/play.svg" alt="" class="invert">
                </div>
                </li>`;
    }
    //play songs marquee
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener('click', element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })
}

function playmusic(track, pause = false) {
    // let audio = new Audio(`/${currfolder}/` + track);
    currentsong.src = `/${currfolder}/` + track;
    if (!pause) {
        currentsong.pause();
        play.src = "img/pause.svg"
    }
    currentsong.play();
    document.querySelector('.song-info').innerHTML = "Music :-  " + decodeURI(track);
    document.querySelector('.song-time').innerHTML = "00:00/00:00";
}

// async function displayAlbums() {
//     let a = await fetch(`http://127.0.0.1:5500/songs/`);
//     let response = await a.text();
//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a");
//     let cardContainer = document.querySelector(".card-containner");
//     let array = Array.from(anchors)
//     for (let index = 0; index < array.length; index++) {
//         const e = array[index];
//       if (e.href.includes("/songs/")) {
//         let folder = e.href.split("/").slice(-2)[0];
//          // Get the metadata of the folder
//         let a = await fetch(`http://127.0.0.1:5500/${folder}/Arijit_Singh/info.json`);
//         let response = await a.json();
//         console.log(a);
//         console.log(response);
//         cardContainer.innerHTML = cardContainer.innerHTML + 
//           `<div data-folder="Arijit_Singh" class="card-artists">
//               <div class="play">
//                 <button id="Arijit_Singh"><img src="modified_play.svg" alt="" /></button>
//               </div>
//               <img class="img-artes" src="/${folder}/Arijit_Singh/cover.webp" alt="" />
//               <h3>${response.title}</h3>
//               <h4 style="color: gray">Artist</h4>
//             </div>
// `;
//       }
//     };
//   }
  

async function main() {
    await getsongs("songs/");
    // console.log(songs[0]);
    //remamber tis to uncommet for playing first song  
    playmusic(songs[0], true);

    // displayAlbums();

    //make event listsener to play pause and next and prev
    play.addEventListener('click', () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "img/pause.svg"
        } else {
            currentsong.pause();
            play.src = "img/play.svg"
        }
    })

    // make event for song time
    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime,currentsong.duration);
        document.querySelector('.song-time').innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)
            }/${secondsToMinutesSeconds(currentsong.duration)
            }`
        document.querySelector(".circule").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    //add event to the seek bar to make it bettar and real 

    document.querySelector(".seakbar").addEventListener("click", (e) => {
        let persent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector('.circule').style.left = persent + "%";
        currentsong.currentTime = ((currentsong.duration) * persent) / 100
        // console.log(e)
    })

    //add event to hambarger 
    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').style.left = "0";
    })

    //add event to hambarger 
    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.left').style.left = "-120%";
    })

    //add event to the prevese buttone
    prev.addEventListener('click', () => {
        // console.log(' pre buttone click');
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        // console.log(songs,index);
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })

    //add event to the next buttone
    next.addEventListener('click', () => {
        currentsong.pause();
        // console.log(' next buttone click');
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        // console.log(songs,index);
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
    })

    //add event for the volum 
    document.querySelector(".range").getElementsByTagName('input')[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100;
    })

//     // add evente for the folders (click for songs to load )
//     Array.from(document.getElementsByClassName("card-artists")).forEach(e => {
//         // console.log(e)
//         e.addEventListener('click', async item => {
//             console.log(item, item.currentTarget.dataset)
//             songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
//             // Update the current song to the first song in the new folder
// +            playmusic(songs[0], true);
//         })
//     })


    let Arijit_Singh = document.getElementById('Arijit_Singh')
    Arijit_Singh.addEventListener('click', ()=>{
     getsongs("songs/Arijit_Singh/");
     playmusic(songs[0], true);
    })

    let AR_Rahman = document.getElementById('AR-Rahman')
    AR_Rahman.addEventListener('click', ()=>{
     getsongs("songs/AR-Rahman/");
     playmusic(songs[0], true);
    })

    let MC_Square = document.getElementById('MC_Square')
    MC_Square.addEventListener('click', ()=>{
     getsongs("songs/MC_Square/");
     playmusic(songs[0], true);
    })

    let srushti_tawde = document.getElementById('srushti_tawde')
    srushti_tawde.addEventListener('click', ()=>{
     getsongs("songs/srushti_tawde/");
     playmusic(songs[0], true);
    })

    let Paradox = document.getElementById('Paradox')
    Paradox.addEventListener('click', ()=>{
     getsongs("songs/Paradox/");
     playmusic(songs[0], true);
    })

    let Spectra = document.getElementById('Spectra')
    Spectra.addEventListener('click', ()=>{
     getsongs("songs/Spectra/");
     playmusic(songs[0], true);
    })
}

main();