const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(text){
    if(!text) return;
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;
    window.speechSynthesis.speak(text_speak);
}

function wishMe(){
    const hour = new Date().getHours();
    if(hour >= 0 && hour < 12) speak("Good Morning Master");
    else if(hour >= 12 && hour < 17) speak("Good Afternoon Master");
    else speak("Good Evening Master");
}

window.addEventListener('load', ()=>{
    speak("Initializing JARVIS");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if(!SpeechRecognition){
    content.textContent = "Speech Recognition not supported in this browser.";
}
const recognition =  new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = "en-US";

recognition.onresult = (event)=>{
    const transcript = event.results[0][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
}

recognition.onerror = (e)=>{
    content.textContent = "Error: " + e.error;
}

btn.addEventListener('click', ()=>{
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(() => {
        content.textContent = "Listening...";
        recognition.start();
    })
    .catch(() => {
        content.textContent = "Microphone permission denied.";
    });
});

function takeCommand(message){
    if(message.includes('hey') || message.includes('hello')){
        speak("Hello Sir, How May I Help You?");
    }
    else if(message.includes("open google")){
        window.open("https://google.com", "_blank");
        speak("Opening Google");
    }
    else if(message.includes("open youtube")){
        window.open("https://youtube.com", "_blank");
        speak("Opening Youtube");
    }
    else if(message.includes("open facebook")){
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook");
    }
    else if(message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(message)}`, "_blank");
        speak("This is what I found on the internet regarding " + message);
    }
    else if(message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`, "_blank");
        speak("This is what I found on Wikipedia regarding " + message);
    }
    else if(message.includes('time')) {
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        speak("The time is " + time);
    }
    else if(message.includes('date')) {
        const date = new Date().toLocaleDateString([], {month: 'long', day:'numeric'});
        speak("Today is " + date);
    }
    else {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(message)}`, "_blank");
        speak("I found some information for " + message + " on Google");
    }
}