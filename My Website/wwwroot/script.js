let x = 0; // Counter
let isDark = false;
let body = document.getElementById("body");

let y = 1; // Image Index

let z = 4; // Card ID
let Hidden;

let sum1 = 0;
let Ace1 = 0;

let sum2 = 0;
let Ace2 = 0;

let audio = document.createElement("audio");
audio.src = "Hit2.mp3";


// Index
function Increment() {
    x = x + 1;
    document.getElementById("var").innerText = x;
}
function Decrement() {
    if (x >= 1) {
        x = x - 1;
        document.getElementById("var").innerText = x;
    }
}
function SwitchMode() {
    if (!isDark) {
        body.style.backgroundColor = "black";
        document.getElementById("var").style.color = "White";
        isDark = true;
    } else {
        body.style.backgroundColor = "Gainsboro";
        document.getElementById("var").style.color = "Red";
        isDark = false;
    }
}


//Table
function showSymbol() {
    for (let i = 1; i <= 3; i++) {
        document.getElementById("s" + i).innerText = String.fromCharCode(Number(document.getElementById("t" + i).value));
    }
}
function switchImage() {
    if (y == 4) {
        y = 1;
    } else {
        y++;
    }
    document.getElementById("003").setAttribute("src", "/Images/Billy" + y + ".jpeg");
}


//BlackJack

async function Hit(k) {

    audio.play();

    const res = await fetch('/api/top');
    const data = await res.json();

    let img = "/cards/" + data.house + data.cardValue + ".png";
    let card = document.createElement("img");

    z++;

    card.src = img;
    card.id = "c" + z;
    card.width = "71";
    card.height = "95";

    document.getElementById("c" + k).insertAdjacentElement("afterend", card);

    if (k == 2) {
        sum2 += Value(data.cardValue);

        if (data.cardValue == 1) {
            Ace2++;
        }

        Ace(2);
        console.log(sum2);
    }

    if (k == 4) {
        sum1 += Value(data.cardValue);

        if (data.cardValue == 1) {
            Ace1++;
        }

        Ace(1);
        console.log(sum1);

        if (sum1 >= 21) {
            Stand();
        }
    }
}

async function Stand() {

    await new Promise(resolve => setTimeout(resolve, 500));

    console.log("Stand!");
    let result; //result of the game - win draw or loss

    document.getElementById("c1").setAttribute("src", Hidden);
    audio.play(); 

    document.getElementById("Button2").remove();

    document.getElementById("Button1").setAttribute("onclick", "Restart()");
    document.getElementById("Button1").innerHTML = "<h2> Restart </h2>";

    if (sum1 > 21) {
        result = 0;
        console.log("Bust! - 1");
    }

    else {
        if (sum2 == 21) {
            if (sum1 == 21) {
                result = 0.5;
            }

            else {
                result = 0;
            }
        }

        else {

            //document.getElementById("Button1").setAttribute("onclick", "Next()");
            //document.getElementById("Button1").innerHTML = "<h2> &nbsp; Next &nbsp;</h2>";

            while (sum2 < 17) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await Hit(2);
            }

            if (sum2 > 21) {
                result = 1;
                console.log("Bust! - 2");
            }



            else {
                if (sum2 > sum1) {
                    result = 0;
                }
            }

            if (sum2 < sum1) {
                result = 1;
            }

            if (sum2 == sum1) {
                result = 0.5;
            }
        }


    }


    if (result == 0.5) {
        document.getElementById("msg").innerText = "DRAW!";
    }

    else {
        if (result == 1) {
            document.getElementById("msg").innerText = "YOU WIN!";
        }

        else {
            document.getElementById("msg").innerText = "YOU LOSE!";
        }

        console.log(sum1);
        console.log(sum2);
    }

}

async function Restart() {

    await fetch('/api/restart');
    console.log("Restart!");

    for (; z > 4; z--) {
        document.getElementById("c" + z).remove();
    }

    document.getElementById("msg").innerHTML = "<br>";

    Start();
}

async function Start() {

    sum1 = 0;
    Ace1 = 0;

    sum2 = 0;
    Ace2 = 0;
    

    let res = await fetch('/api/top');
    let data = await res.json();

    Hidden = "/cards/" + data.house + data.cardValue + ".png";
    sum2 += Value(data.cardValue);

    if (data.cardValue == 1) {
        Ace2++;
    }

    document.getElementById("c1").setAttribute("src", "/Cards/Backside2.png");

    for (let i = 2; i <= 4; i++) {
         res = await fetch('/api/top');
         data = await res.json();

         document.getElementById("c" + i).setAttribute("src", "/cards/" + data.house + data.cardValue + ".png");

        if (i > 2) {
            sum1 += Value(data.cardValue);
            if (data.cardValue == 1) {
                Ace1++;
            }
        }

        else {
            sum2 += Value(data.cardValue);
            if (data.cardValue == 1) {
                Ace2++;
            }
        }
    }

    document.getElementById("Button1").setAttribute("onclick", "Hit(4)");
    document.getElementById("Button1").innerHTML = "<h2>&nbsp;&nbsp;Hit &nbsp;&nbsp;</h2>";

    let element = document.createElement("button");

    element.onclick = Stand;
    element.id = "Button2";
    element.innerHTML = "<h2> Stand </h2>";

    document.getElementById("Button1").insertAdjacentElement('afterend', element);

    if (sum2 == 21) {
        Stand();
    }

    else {
        if (sum1 == 21) { // forgive me
            document.getElementById("msg").innerText = "YOU WIN!";
            document.getElementById("c1").setAttribute("src", Hidden);
            document.getElementById("Button2").remove();
            document.getElementById("Button1").setAttribute("onclick", "Restart()"); 
            document.getElementById("Button1").innerHTML = "<h2> Restart </h2>";

        }
    }
}
function Value(k){

    if (k > 10) {
        return 10;
    }

    if (k == 1) {
        return 11;
    }

    return k;

}
function Ace(k) {
    if (k == 1) {
        while (Ace1 > 0 && sum1 > 21) {
            Ace1--;
            sum1 -= 10;
        }   
    }

    if (k == 2) {
        while (Ace2 > 0 && sum2 > 21) {
            Ace2--;
            sum2 -= 10;
        }
    }
}



