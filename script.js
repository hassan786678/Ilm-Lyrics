let voices;

let currfolder;
async function getvoices(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    voices = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            voices.push(element.href.split(`/${folder}/`)[1])
        }
    }
    return voices;
}

// getvoices();

async function main() {
    await getvoices(`/audio/1Qirats`);
    console.log(voices);

    let audioUL = document.querySelector(".voicelist").getElementsByTagName("ul")[0];
    for (const voice of voices) {

        audioUL.innerHTML = audioUL.innerHTML + `<li>
       <div class="media">
       <img src="SVG Folder/mediaicon.svg" alt="mediaicon">
       
       <div class="info">
       <p>${voice.replaceAll("%20", " ")}</p>
       <p>songartist</p>
       </div>
       <div class="playnow">
       <p>Play Now</p>
       <img src="SVG Folder/player.svg" alt="">
       </div>
       </div>
       </li>`
    }


// function for time running

function formatTime(seconds) {
   if (!isFinite(seconds)) return "00:00";
   seconds = Math.floor(seconds);
   let mins = Math.floor(seconds / 60);
   let secs = seconds % 60;
   return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
}

    let Currvoice = new Audio();

    const playmusic = (track, pause = false ) => {
    Currvoice.src = `http://127.0.0.1:3000/${currfolder}/` + track;
    if(!pause){
        Currvoice.play();
        play.src = "SVG Folder/pause.svg"
    }
    document.querySelector(".voiceInfo").innerHTML = decodeURI(track)
     Currvoice.addEventListener("loadedmetadata", () => {
      document.querySelector(".voiceTime").innerHTML =
         "00:00 / " + formatTime(Currvoice.duration);
   });
    }

    playmusic(voices[0] , true)
    



    Array.from(document.querySelector(".voicelist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            let played = e.querySelector(".info").firstElementChild.innerHTML.trim();
            playmusic(played);
        })
    });

    // event listner for hamburger and close button;

    document.querySelector(".hamburger").addEventListener("click", (e) => {
        document.querySelector(".left").style.left = 0;
    })
    document.querySelector(".closebutton").addEventListener("click", (e) => {
        document.querySelector(".left").style.left = "-120%";
    })

    // event listner for play next and previous

    play.addEventListener("click", (e) => {
        if (Currvoice.paused) {
            Currvoice.play();
            play.src = "SVG Folder/pause.svg"
        } else {
            Currvoice.pause();
            play.src = "SVG Folder/player.svg"
        }

    })
let index = voices.indexOf(Currvoice.src.split("/").slice(-1)[0])
    previous.addEventListener("click",()=>{
        let index = voices.indexOf(Currvoice.src.split("/").slice(-1)[0])
        console.log(index);
        if(index-1<0){
            playmusic(voices[index])
        }else{
            playmusic(voices[index-1])
        }
    })

    next.addEventListener("click",()=>{
        let index = voices.indexOf(Currvoice.src.split("/").slice(-1)[0])
        console.log('next clicked');
        if(index+1 >= voices.length){
            playmusic(voices[index])
        }else{
            playmusic(voices[index+1])
        }
    })


// Update current time every second
   Currvoice.addEventListener("timeupdate", () => {
      document.querySelector(".voiceTime").innerHTML = 
        `${formatTime(Currvoice.currentTime)}/${formatTime(Currvoice.duration)}`;
        document.querySelector(".circle").style.left = (Currvoice.currentTime / Currvoice.duration) * 100 + "%";

   });
// For seekbar
   document.querySelector(".seekbar").addEventListener("click",(e)=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
    Currvoice.currentTime = ((Currvoice.duration*percent)/100)
    document.querySelector(".circle").style.left = percent + "%";
   })

volumeSign = document.querySelector(".volumeSign")

const volumeBar = document.querySelector(".volumebar");

// for volume change
volumeBar.addEventListener("input", (e) => {
  let value = e.target.value;
  if(value > 0){
      Currvoice.volume = value / 100;
      volumeSign.src = "SVG Folder/volume.svg";
  }else{
    volumeSign.src = "SVG Folder/mute.svg";
  }
});



volumeSign.addEventListener("click", (e) => {
  if (volumeSign.src.includes("volume.svg")) {
    volumeSign.src = "SVG Folder/mute.svg";
    Currvoice.volume = 0;
    document.querySelector(".volumebar").value = 0;
  } else {
    volumeSign.src = "SVG Folder/volume.svg";
    Currvoice.volume = 0.2; // volume 20%
    document.querySelector(".volumebar").value = 20; // shows 20 in range
  }
});

// for dynamic albums card
async function DisplayAlbums() {
   let a = await fetch(`/audio/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/audio") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/audio/${folder}/info.json`)
          
            let response = await a.json(); 

            let Cardcontainer = document.querySelector(".cardcontainer");
            Cardcontainer.innerHTML = Cardcontainer.innerHTML+`<div data-folder="${folder}"  class="cards">
            <img class = "cardimage" src="/audio/${folder}/Cover.png" alt="Cover">
            <p>${response.title}</p>
            <p>${response.description}</p>
            <img src="SVG Folder/Playforplaylist.svg
            " alt="">
            </div>`
        }
    }
            


}

await DisplayAlbums();

Array.from(document.querySelectorAll(".cards")).forEach(e=>{
    e.addEventListener("click", async item => {
        console.log(item.currentTarget.dataset.folder);
            songs = await getvoices(`audio/${item.currentTarget.dataset.folder}`)  
            playmusic(voices[0])

        })
})



}

main();