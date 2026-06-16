let x = 0; // Counter
let isDark = false;
let body = document.getElementById("body");

let y = 1; // Image Index


let Hidden;
const Decks = [];
let msg = 2; //msg id 
let Flag;

let audio = document.createElement("audio");
let Re4 = "Hit.mp3";
let Re3 = "Hit2.mp3";
audio.src = Re4;


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

class Card {
    #value;
    #house;
    constructor(value, house, rep) {
        this.#value = Value(value);
        this.#house = house;
        this.rep = rep;
    }

    GetValue() {
        return this.#value;
    }

    GetHouse() {
        return this.#house;
    }

    IsAce() {
        return (this.#value == 11);
    }
}
class Deck {
    #arr;
    #sum;
    #ace;

    constructor() {
        this.#arr = [];
        this.#sum = 0;
        this.#ace = 0;
    }

    Add(c) {

        this.#arr.push(c);
        this.#sum += c.GetValue();

        if (c.IsAce()) {
            this.#ace++;
        }


        //Ace

        while (this.#sum > 21 && this.#ace != 0) {
            this.#sum -= 10;
            this.#ace--;
        }
    }

    GetSum() {
        return this.#sum;
    }

    GetCard(k) {
        return this.#arr[k];
    }

    GetLastCard() {
        return this.#arr[this.#arr.length - 1];
    }

    GetSize() {
        return this.#arr.length;
    }
}

async function Run() {

    console.log("Run!");

    let deck;
    let id;

    for (let i = 1; i < Decks.length; i++) {

        console.log(i);
        console.log(Decks.length);

        deck = Decks[i];
        id = "msg" + i;

        console.log(deck);

        document.getElementById("Button1").onclick = () => HitNRun(deck, id);
        document.getElementById("Button2").onclick = () => Flag();

        if (deck.GetSize() == 2 && (deck.GetCard(0) == deck.GetCard(1))) {
            let element = document.createElement("button");
            element.id = "Button3";
            element.onclick = () => Split(deck);
            element.innerHTML = "<h2> Split </h2>";
        }

        await new Promise(resolve => Flag = resolve);
    }

    await Stand(Decks[1]);

    for (let i = 2; i < Decks.length; i++) {
        await Result(Decks[i], "msg" + i);
    }


}

async function HitNRun(deck, id) {



    if (await Hit(deck)) {

        if (deck.GetSum() > 21) {
            document.getElementById(id).innerText = "LOSE!";
        }

        await new Promise(resolve => setTimeout(500));
        Flag();
    }

}

async function Hit(deck) {

    audio.play();

    if (document.getElementById("Button3") != null) {
        document.getElementById("Button3").remove();
    }

    const res = await fetch('/api/top');
    const data = await res.json();

    let img = document.createElement("img");

    img.src = "/cards/" + data.house + data.cardValue + ".png";
    img.width = "71";
    img.height = "95";

    console.log("before - ");
    console.log(deck);

    deck.GetLastCard().rep.insertAdjacentElement('afterend', img);
    deck.Add(new Card(data.cardValue, data.house, img));

    console.log("after - ");
    console.log(deck);

    console.log(deck.GetSum());

    return (deck.GetSum() >= 21);
}

async function Stand(deck) {

    console.log("Stand!");
    await new Promise(resolve => setTimeout(resolve, 500));

    document.getElementById("c1").setAttribute("src", Hidden);
    document.getElementById("Button2").remove();
    document.getElementById("Button1").setAttribute("onclick", "Restart()");
    document.getElementById("Button1").innerHTML = "<h2> Restart </h2>";

    if (document.getElementById("Button3") != null) {
        document.getElementById("Button3").remove();
    }

    audio.play();

    Result(deck, "msg1");
}

async function Restart() {

    await fetch('/api/restart');
    console.log("Restart!");

    document.getElementById("split").innerHTML = "";

    const len = Decks.length;

    for (let i = 0; i < len; i++) {
        for (let j = 2; j < Decks[i].GetSize(); j++) {
            console.log(Decks[i].GetCard(j).rep);
            Decks[i].GetCard(j).rep.remove();
        }
    }

    Decks.length = 0;

    document.getElementById("msg1").innerHTML = "<br> <br>";
    msg = 2;

    Start();
}

async function Start() {

    Decks.push(new Deck());
    Decks.push(new Deck());

    let res = await fetch('/api/top');
    let data = await res.json();

    Hidden = "/cards/" + data.house + data.cardValue + ".png";
    Decks[0].Add(new Card(data.cardValue, data.house, document.getElementById("c1")));

    Decks[0].GetCard(0).rep.src = "/cards/backside2.png";

    for (let i = 2; i <= 4; i++) {
        res = await fetch('/api/top');
        data = await res.json();

        if (i > 2) {
            Decks[1].Add(new Card(data.cardValue, data.house, document.getElementById("c" + i)));
            Decks[1].GetCard(i - 3).rep.src = "/cards/" + data.house + data.cardValue + ".png";
        }

        else {
            Decks[0].Add(new Card(data.cardValue, data.house, document.getElementById("c" + i)));
            Decks[0].GetCard(1).rep.src = "/cards/" + data.house + data.cardValue + ".png";
        }
    }

    let id = "msg1";

    document.getElementById("Button1").onclick = () => HitNRun(Decks[1], id);
    document.getElementById("Button1").innerHTML = "<h2>&nbsp;&nbsp;Hit &nbsp;&nbsp;</h2>";

    let element = document.createElement("button");

    element.onclick = () => Stand(Decks[1]);
    element.id = "Button2";
    element.innerHTML = "<h2> Stand </h2>";

    document.getElementById("Button1").insertAdjacentElement('afterend', element);

    if (Decks[0].GetSum() == 21) {
        Stand(Decks[1], true);
    }

    else {
        if (Decks[1].GetSum() == 21) {
            Stand(Decks[1], true);
        }

        else {
            Run();
        }
    }
}

async function Split(deck) {

    audio.play();

    Decks.push(new Deck());

    let p1 = document.createElement("img");

    p1.width = "71";
    p1.height = "95";
    p1.src = deck[1].rep.src;

    Decks[Decks.length - 1].Add(new Card(deck[1].GetValue(), deck[1].GetHouse(), p1));

    let res = await fetch('/api/top');
    let data = await res.json();

    let c = deck.pop();
    c.rep.src = "/cards/" + data.cardValue + data.house + ".png";

    deck.Add(new Card(data.cardValue, data.house, c.rep));

    res = await fetch('/api/top');
    data = await res.json();

    p2 = document.createElement("img");

    p2.width = "71";
    p2.height = "95";
    p2.src = "/cards/" + data.house + data.cardValue + ".png";

    Decks[Decks.length - 1].Add(new Card(data.cardValue, data.house, p2))

    let span = document.createElement("span");
    span.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

    document.getElementById("split").appendChild(span);

    let div = document.createElement("div");
    div.id = "d" + msg;

    document.getElementById("split").appendChild(div);
    div.appendChild(p1);
    div.appendChild(p2);

    let m = document.createElement("h4");
    m.id = "msg" + msg;

    msg++;

    div.appendChild(m);

    if (deck.GetCard(0) != deck.GetCard(1)) {
        document.getElementById("Button3").remove();
    }

}

function Value(k) {

    if (k > 10) {
        return 10;
    }

    if (k == 1) {
        return 11;
    }

    return k;

}
function SwitchSound() {
    if (audio.src == Re4) {
        audio.src = Re3;
    }

    else {
        audio.src = Re3;
    }
}

async function Result(deck, id) {

    let result;

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (deck.GetSum() > 21) {
        result = 0;
        console.log("Bust! - 1");
    }

    else {
        if (Decks[0].GetSum() == 21) {
            if (deck.GetSum() == 21) {
                result = 0.5;
            }

            else {
                result = 0;
            }
        }

        else {

            if (deck.GetSize() == 2 && deck.GetSum() == 21) {
                result = 1;
            }

            else {
                while (Decks[0].GetSum() < 17 && !(await Hit(Decks[0]))) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                if (Decks[0].GetSum() > 21) {
                    result = 1;
                    console.log("Bust! - 2");
                }



                else {
                    if (Decks[0].GetSum() > deck.GetSum()) {
                        result = 0;
                    }
                }

                if (Decks[0].GetSum() < deck.GetSum()) {
                    result = 1;
                }

                if (Decks[0].GetSum() == deck.GetSum()) {
                    result = 0.5;
                }
            }
        }
    }


    if (result == 0.5) {
        document.getElementById(id).innerText = "DRAW!";
    }

    else {
        if (result == 1) {
            document.getElementById(id).innerText = "WIN!";
        }

        else {
            document.getElementById(id).innerText = "LOSE!";
        }

        console.log(deck.GetSum());
        console.log(Decks[0].GetSum());
    }
}

async function HardRestart() {


    if (document.getElementById("Button3") == null) {
        document.getElementById("Button2").remove();
        await Restart();
    }

}




// Slot Machine

async function SlotMachine() {

    document.getElementById("slot1").src = "/Cards/Slot0.jpg";
    document.getElementById("slot2").src = "/Cards/Slot0.jpg";
    document.getElementById("slot3").src = "/Cards/Slot0.jpg";

    await new Promise(resolve => setTimeout(resolve, 600));

    for (let i = 1; i <= 3; i++) {

        await SlotMachineHelper(i);
        await new Promise(resolve => setTimeout(resolve, 600));
    }
}

async function SlotMachineHelper(k) {

    let sym = SymDeterminer();
    let slot = document.getElementById("slot" + k);

    slot.src = "/Cards/Slot" + sym + ".jpg";

    for (let i = 0; i < 7; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));

        let currSym = sym;

        while (currSym == sym) {

            currSym = SymDeterminer();
            console.log(i + "-" + currSym)
        }

        sym = currSym;
        audio.play();
        slot.src = "/Cards/Slot" + sym + ".jpg";
    }
}

function SymDeterminer() {

    let sym = Math.random();
    console.log(sym);

    switch (true) {

        case sym < 0.02:
            return 6;
            break;

        case sym >= 0.02 && sym < 0.12:
            return 5;
            break;

        case sym >= 0.12 && sym < 0.3:
            return 4;
            break;

        case sym >= 0.3 && sym < 0.5:
            return 3;
            break;

        case sym >= 0.5 && sym < 0.7:
            return 2;
            break;

        case sym >= 0.7 && sym < 1:
            return 1;
            break;

        default:
            return 0;
            break;
    }
}
