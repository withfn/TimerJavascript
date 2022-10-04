const hours = document.querySelector('#hours');
const minutes = document.querySelector('#minutes');
const seconds = document.querySelector('#seconds');
const div_time = document.querySelector('#div-time');
const edit_time = document.querySelectorAll('.time-input')
const button_start_pause = document.querySelector('.start-pause');
const button_cancel = document.querySelector('.cancel')
const style = getComputedStyle(document.body);

let time = new Date();
let runningTimer; //interval timer
let alarmSound = new Audio('assets/sound/alarm.mp3');
let is_running = false;

button_start_pause.addEventListener('click', start_pause);
button_cancel.addEventListener('click', cancel);

document.addEventListener("keydown", function(e){
    key = e.key.toLowerCase();
    if ( key === "i" ) if (is_running == false) start_pause();
    if ( key === "p" ) if (is_running) start_pause();
    if ( key === "c" ) cancel();
});

function start_pause(){
    //start
    if (is_running === false){
        time.setHours(Number(hours.value), Number(minutes.value), Number(seconds.value));
        if (time.getHours() === 0 && time.getMinutes() === 0 && time.getSeconds() === 0){
            //checks if the value is greater than 0 to start the timer
            //pass
        }
        else{
            timerStyleSetting(backgroundColor="--white", fontColor="--time-color", editEnable=false);
            button_start_pause.textContent = 'Pausar';
            printTimerTitle();
            printTimer();
            runningTimer = setInterval(function(){
                time.setSeconds( time.getSeconds() - 1 );
                printTimer();
                printTimerTitle();
                checkIfTimeIsUp();
            }, 1000);
            is_running = true;
        };
    }
    //pause
    else {
        button_start_pause.textContent = 'Iniciar';
        clearInterval(runningTimer);
        timerStyleSetting(backgroundColor="--white", fontColor="--time-pause-color", editEnable=false);
        is_running = false;
    };
};

//Cancels the time and resets its value
function cancel(){
    clearInterval(runningTimer);
    timerStyleSetting(backgroundColor="--background-color", fontColor="--time-pause-color", editEnable=true);
    div_time.style.color = style.getPropertyValue('--time-pause-color');
    button_start_pause.textContent = 'Iniciar';
    document.title = 'Timer';
    is_running = false;
};

//print the current time on the screen
function printTimer(){
    hours.value = `${formatTime(time.getHours())}`;
    minutes.value = `${formatTime(time.getMinutes())}`;
    seconds.value = `${formatTime(time.getSeconds())}`;
};

//concatenates a 0 at the beginning if the number is less than 10
function formatTime(time){
    if (parseInt(time) < 10){ return `0${time}`}
    else{return time};
};

//checks if the time is up and triggers the alarm
function checkIfTimeIsUp(){
    if (time.getHours() === 0 && time.getMinutes() === 0 && time.getSeconds() === 0){
        alarmSound.play();
        cancel();
    };
};

//format the timer and print in the tab title
function printTimerTitle(){
    let hours = ''
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    let haveHour = (time.getHours() > 0);
    if (haveHour) {
        hours = time.getHours();
        hours = ((time.getHours() < 10) ? `0${time.getHours()}:` : `${time.getHours()}:`);
    };
    document.title = `Timer ${hours}${formatTime(minutes)}:${formatTime(seconds)}`;
};


function timerStyleSetting(backgroundColor, fontColor, editEnable){
    div_time.style.color = style.getPropertyValue(fontColor);
    for (let i=0; i < edit_time.length; i++){
        edit_time[i].style.backgroundColor = style.getPropertyValue(backgroundColor);
        edit_time[i].style.color = style.getPropertyValue(fontColor);
        if (editEnable) {
            edit_time[i].removeAttribute("readonly");
            edit_time[i].classList.add("enabled");
            edit_time[i].value = '';
        }
        else {
            edit_time[i].setAttribute("readonly", "true");
            edit_time[i].classList.remove("enabled");
        };
    };
};