let currentSong = new Audio();//give accesss to play(),pause(),current(),src()
let songs;
let currFolder;

function secondsToMinuteSeconds(seconds){
    if(isNaN(seconds) || seconds<0){
        return "00:00";
    }

    const minutes = Math.floor(seconds/60);
    const remainingSeconds = Math.floor(seconds%60);

    const formattedMinutes = String(minutes).padStart(2,'0');
    const formattedSeconds= String(remainingSeconds).padStart(2,'0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
    currFolder=folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`); // fetch always returns a promise and await pauses the function until promise is resolved
    let response = await a.text(); //cnverts raw data to text
    let div = document.createElement("div");
    div.innerHTML = response;
    let as=div.getElementsByTagName("a");
    console.log(as);
    songs=[];
    for(let index = 0 ;index<as.length; index++){
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    //Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML= songUL.innerHTML + `<li> 
        
                            <i class="fa-solid fa-music"></i>
                            <div class="info">
                                <div> ${song.replace("http://127.0.0.1:5500/", " ")}</div>
                                <div>Uruj </div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <i class="fa-regular fa-circle-play"></i>
                            </div> </li>`;
    }

    //Attach an event litener to each song 
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });
}

const playMusic= (track , pause=false)=>{
    currentSong.src = `/${currFolder}/` + track
    if(!pause){
            currentSong.play();
    }
   // play.src="pause.svg";
   document.querySelector(".songinfo").innerHTML = decodeURI(track);
   document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

}

// async function displayAlbums() {
//     let a = await fetch(`http://127.0.0.1:5500/songs/`);
//     let response = await a.text();
//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a");
//     let cardContainer= document.querySelector(".cardContainer");
//     let array = Array.from(anchors)
//         for (let index = 0; index < array.length; index++) {
//             const e = array[index];
            
//         let rawHref = e.getAttribute("href");
//         if (!rawHref) return;

//         let parts = rawHref.replace(/\/$/, "").split("/");
//         let folder = parts[parts.length - 1];

//         // ✅ Skip if folder is empty or equals "songs"
//         if (!folder || folder.toLowerCase() === "songs") return;

//         console.log(folder);
//         let meta = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
//         let json = await meta.json();
//         try {
           
//             console.log(json);
//         } catch (err) {
//             console.error(`Error loading metadata for folder: ${folder}`, err);
//         }
//         cardContainer.innerHTML = cardContainer.innerHTML +  ` <div data-folder="cs" class="card">
//                     <div class="play" >
//                         <div
//                             style="width: 40px; height: 40px; background-color: rgb(8, 181, 8); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
//                             <i class="fa-solid fa-play" style="color: black;"></i>
//                         </div>
//                     </div>

//                     <img src="https://i.scdn.co/image/ab67616d00001e026fbb60d6a7e03ccb940a518e" alt="">
//                     <h2>${json.title}</h2>
//                     <p>${json.description}</p>
//                 </div>`;

//                 //Load the playlist whenever card in clicked
//      Array.from(document.getElementsByClassName("card")).forEach(e=>{
//         e.addEventListener("click", async item=>{
//             if (e.dataset.folder) {
//             await getSongs(`songs/${item.currentTarget .dataset.folder}`);
//         } else {
//             console.warn("Missing data-folder in this .card element");
//         }
//         })
//      }) 

//     };
// }

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");

    let array = Array.from(anchors);

    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        let rawHref = e.getAttribute("href");
        if (!rawHref) continue;

        let parts = rawHref.replace(/\/$/, "").split("/");
        let folder = parts[parts.length - 1];

        // ✅ Skip if folder is empty or equals "songs"
        if (!folder || folder.toLowerCase() === "songs") continue;

        try {
            let meta = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let json = await meta.json();

            // ✅ Append the new card using insertAdjacentHTML
            cardContainer.insertAdjacentHTML("beforeend", `
                <div data-folder="${folder}" class="card">
                    <div class="play">
                        <div
                            style="width: 40px; height: 40px; background-color: rgb(8, 181, 8); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <i class="fa-solid fa-play" style="color: black;"></i>
                        </div>
                    </div>
                    <img src="/songs/${folder}/cover.jpg" alt="">
                    <h2>${json.title}</h2>
                    <p>${json.description}</p>
                </div>
            `);
        } catch (err) {
            console.error(`Error loading metadata for folder: ${folder}`, err);
        }
    }
}

// ✅ Use event delegation so new cards also respond
document.querySelector(".cardContainer").addEventListener("click", async (event) => {
    const card = event.target.closest(".card");
    if (!card) return;

    const folder = card.dataset.folder;
    if (folder) {
        await getSongs(`songs/${folder}`);
    } else {
        console.warn("Missing data-folder in this .card element");
    }
    playmusic(songs[0]);
});

async function main(){
    //Get the list of all the songs
    await getSongs("songs/ncs");
    playMusic(songs[0],true)

    //Display all the albums on the page
    displayAlbums();

    //Attach an event listener to play , previous and next buttons 
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src= "pause.svg"
        }else{
            currentSong.pause();
            play.src= "play.svg"
        }
    });

    //Listen for time update event
    currentSong.addEventListener("timeupdate" , ()=>{
        document.querySelector(".songtime").innerHTML = `${secondsToMinuteSeconds(currentSong.currentTime)} / ${secondsToMinuteSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime /currentSong.duration)*100 + "%";
    });
     //Add an event listener to seekbar
     document.querySelector(".seekbar").addEventListener("click",  e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent +"%";
        currentSong.currentTime=((currentSong.duration) * percent)/100;
     });
     //Add an event listener for hamburger
     document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
     });
     //add an event listener to close the hamburger
     document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%";
     });

     //Event listener for previous and next
     previous.addEventListener("click", ()=>{
        console.log("prebious clicked");
        console.log(currentSong);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index-1 >= 0)){
              playMusic(songs[index-1]);

        }
     });

     next.addEventListener("click", ()=>{
        console.log("next clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index+1 < songs.length)){
              playMusic(songs[index+1]);
        }
     });

     //Add an event listener to volume 
     document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("Seeting volume to " , e.target.value);
        currentSong.volume=parseInt(e.target.value)/100;
     });

    // Add event listener to mute the track
    //  document.querySelector(".volume>img").addEventListener("click", e=>{
    //     if(e.target.src == "volume.svg"){
    //         e.target.src="mute.svg";
    //         currentSong.volume=0;
    //     }
    //     else{
    //         e.target.src="volume.svg";
    //         currentSong.volume=10;

    //     }
    //  })
}

main();
 
