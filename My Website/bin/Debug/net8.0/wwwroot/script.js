let x = 0; // Counter
let isDark = false;
let body = document.getElementById("body");

let y = 1; // Image Index

let Hidden;
const Decks = [];
let Flag;

let audio = document.createElement("audio");
let Re4 = "Hit.mp3";
let Re3 = "Hit2.mp3";
audio.src = Re4;

let bet = 25;


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
        this.#value = value;
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
        return (this.#value == 1);
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
        this.#sum += Value(c.GetValue());

        if (c.IsAce()) {
            this.#ace++;
        }


        //Ace

        while (this.#sum > 21 && this.#ace != 0) {
            this.#sum -= 10;
            this.#ace--;
        }
    }

    Remove() {
        let pop = this.#arr.pop();
        this.#sum -= pop.GetValue();
        return pop;
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

    for (let i = 1; i < Decks.length; i++) {

        deck = Decks[i];

        console.log(deck);

        document.getElementById("Button1").onclick = () => HitNRun(deck, "msg");
        document.getElementById("Button2").onclick = () => Flag();

        if (deck.GetSize() == 2 && (deck.GetCard(0).GetValue() == deck.GetCard(1).GetValue())) {
            let element = document.createElement("button");
            element.id = "Button3";
            element.onclick = () => Split(deck);
            element.innerHTML = "<h2> Split </h2>";
            document.getElementById("Button1").insertAdjacentElement('afterend', element);
        }

        await new Promise(resolve => Flag = resolve);
        console.log("Flag!");

        if (document.getElementById("Button3") != null) {
            document.getElementById("Button3").remove();
        }
    }

    await Stand(Decks[1]);

    for (let i = 2; i < Decks.length; i++) {
        await Result(Decks[i], "msg");
    }


}

async function HitNRun(deck, id) {



    if (await Hit(deck)) {

        if (deck.GetSum() > 21) {
            document.getElementById(id).innerText = "LOSE!";
        }

        console.log("end");
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
    img.className = "card";

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

    Result(deck, "msg");


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

    for (let i = 1; i <= 4; i++) {
        document.getElementById("c" + i).src = "";
    }

    Decks.length = 0;

    document.getElementById("msg").innerText = "";
    document.getElementById("payout").innerText = "";

    document.getElementById("Button1").innerHTML = "<h2>&nbsp;&nbsp;Start &nbsp;&nbsp</h2>";
    document.getElementById("Button1").onclick = () => Start();

    document.getElementById("bet").innerText = "25";
    bet = 25;
    document.getElementById("payout").innerHTML = "";
    document.getElementById("chip").style.visibility = "hidden";

    const div = document.createElement("div");
    div.id = "form";

    const form = document.createElement("input");
    form.type = "number";
    form.id = "betform";
    div.appendChild(form);

    const label = document.createElement("h3");
    label.innerHTML = " <br> Place Your Bet";
    label.className = "msg";
    label.style.fontSize = "40px";
    div.appendChild(label);

    document.getElementById("betting").insertBefore(div, document.getElementById("reference"));

    Bet();
}

async function Start() {

    if (!(await DecrementBalance(bet))) 
        return;

    document.getElementById("form").remove();

    await fetch('/api/setman');
    console.log("SetMan");

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

    p1.width = "80";
    p1.height = "107";
    p1.src = deck.GetCard(1).rep.src;

    Decks[Decks.length - 1].Add(new Card(deck.GetCard(1).GetValue(), deck.GetCard(1).GetHouse(), p1));

    let res = await fetch('/api/top');
    let data = await res.json();

    let c = deck.Remove();
    c.rep.src = "/cards/" + data.house + data.cardValue + ".png";

    deck.Add(new Card(data.cardValue, data.house, c.rep));

    res = await fetch('/api/top');
    data = await res.json();

    p2 = document.createElement("img");

    p2.width = "80";
    p2.height = "107";
    p2.src = "/cards/" + data.house + data.cardValue + ".png";

    Decks[Decks.length - 1].Add(new Card(data.cardValue, data.house, p2))

    let span = document.createElement("span");
    span.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

    document.getElementById("split").appendChild(span);

    let div = document.createElement("div");
    div.style.gap = "5px";

    document.getElementById("split").appendChild(div);
    div.appendChild(p1);
    div.appendChild(p2);

    if (deck.GetCard(0).GetValue() != deck.GetCard(1).GetValue()) {
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
        audio.src = Re4;
    }
}

async function Result(deck, id) {

    await new Promise(resolve => setTimeout(resolve, 1000));
    let result;

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
                result = 2;
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
        if (result == 1 || result == 2) {
            document.getElementById(id).innerText = "WIN!";
        }

        else {
            document.getElementById(id).innerText = "LOSE!";
        }

        console.log(deck.GetSum());
        console.log(Decks[0].GetSum());
    }

    BetResult(result);
}

async function HardRestart() {


    if (document.getElementById("Button3") == null) {
        document.getElementById("Button2").remove();
        await Restart();
    }

}




// Slot Machine

async function SlotMachine() {

    await fetch('/api/setman');
    console.log("SetMan");

    if (!(await DecrementBalance(50))) {
        return;
    }

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


//Man

async function Man() {

    let res = await fetch('/api/getman');
    let data = await res.json();

    if (data.present) {

        document.getElementById("man").style.visibility = "visible";
        document.getElementById("title").innerText = "Man";
      
        for (let i = 1; i < data.dialogue.length; i++) {

            await TypeWriter("text", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus a dui eros. Duis interdum erat vel eros tincidunt, quis eleifend arcu rhoncus. Sed feugiat consectetur sem, sit amet lobortis ipsum tincidunt ac. Vestibulum tristique mollis massa at viverra.", 25);
            let element = document.createElement("img");
            element.style.position = "absolute";
            element.style.top = "300px";
            element.style.left = "200px";
            element.style.height = "267px";
            element.style.width = "400px";
            element.src = "/Images/Stock Market V4.png";
            document.getElementById("misc").appendChild(element);

            await new Promise(resolve => setTimeout(resolve, 4000));
        }
    }
}

async function TypeWriter(id, text, speed) {

    const element = document.getElementById(id);
    element.innerHTML = "";

    for (let i = 0; i < text.length; i++) {

        await new Promise(resolve => setTimeout(resolve, speed));

        if (text[i] == ' ') {
            element.innerHTML += "&nbsp; &nbsp;";
        }

        else {
            element.innerHTML += text[i];
        }
    }
}

//Betting

async function IncrementBalance(num) {

    console.log("incBalance");

    await fetch('/api/incrementbalance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(num)
    });

    Balance();
}

async function DecrementBalance(num) {

    console.log("decBalance");

    const response = await fetch('/api/decrementbalance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(num)
    })

    if (await response.json()) {
        Balance();
        return true;
    }

    return false;
}

async function Balance() {
    let res = await fetch('/api/balance');
    let data = await res.json();

    console.log(data);

    document.getElementById("balance").innerText = data;
}
function Bet() {

    const form = document.getElementById("betform");

    form.addEventListener("input", () => {
        const num = form.valueAsNumber;
        if (num >= 25) {
            bet = num;
            document.getElementById("bet").innerText = bet;
        }
    })
}

async function BetResult(result) {

    if (result == 0) {
        return;
    }

    let payout;

    if (result == 0.5) {
        payout = bet;
    }

    if (result == 1) {
        payout = bet * 2;
    }

    if (result == 2) {
         payout = Math.floor(bet / 2 * 3);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    audio.play();
    document.getElementById("payout").innerHTML = "+ " + payout;
    document.getElementById("chip").style.visibility = "visible";

    await new Promise(resolve => setTimeout(resolve, 1000));
    audio.play();
    IncrementBalance(payout);
}


