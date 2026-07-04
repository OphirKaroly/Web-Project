# Virtual Casino - Requirements

## What Is This App?

A Multi-Page Luck Based Gaming Experience. 
It's Audience Is Fans Of Luck Based Games Like Black-Jack / 21 And Slot Machines.
The Site Lets Users Play Games And Gain (Or Lose) Poker Chips, The Website's Currency.

---

## Technologies Used

| Technology | Role |
|---|---|
| HTML5 | Page Structure And Content |
| CSS3 | Visual Styling And Layout |
| JavaScript (vanilla) | Game Code And Interactivity |
| C# with .NET Minimal API | Web Server, Creating And Storing Variables|

**No frameworks are used — on either the client or the server.**
There is no React, Vue, Angular, Bootstrap, jQuery, or any other library. 
The C# backend is equally bare: no Entity Framework, no MVC,
no Razor Pages — just a single file with route handlers.

---

## Graphical Design 

The Game Elements Are Centered To Allow Clean Interface And To Simulate 
A Casino Table Along With The Uniform Dark-Green Background.
The Action Buttons Are Simple As To Not Take Away Attention From The Game.

---

## Audio Design

Simple Sound Effects (Taken From Resident Evil 4 (2005) And Resident Evil 3 (1998))
Which Can Be Switched Are Played Whenever An Important Action Is Performed
In Order To Enhance The All Around Experience And Make It Feel Less Flat.

---

## Pages And What They Accomplish

### Home Page ('Index.html')

The Home Page Of The Site. 

- Has A Fidget Counter Users Can Play With, As Well As Two Interchangeable Color Schemes.
- Simple As To Not Discourage Or Scare The User Away.
- Branches Into All Of The Other Pages, The User Must Return Here If They Want To Switch Pages.

---

### BlackJack ('BlackJack.html')

A Page Containing A Virtual Version Of The Game Black-Jack (AKA 21).

- Four Empty Slots Sit In The Center Of The Screen, With A Start Button.

- Upon Pressing Start, 4 Cards Are Drawn, Two For The Dealer (Not A User),
And Two For The Player. One Of The Dealer's Cards Is Hidden (Backside-Up).
- There Are Up To Three Options: Hit, Stand, And If Both Of The Player's Cards
Are Of The Same Value - Split.

- Hit Draws Another Card For The Player.
- Stand Ends The Game And Reveals The Dealer's Hand.
- Split Splits Your Hand Into Two, Taking One Card And Drawing A New One For Each.
Each Hand Competes With The Dealer Independently.

- The Goal Of The Game Is To Get A Hand Of Bigger Value Than The Dealer Without
Going Over 21. If Your Hand Crosses 21 You Bust (Instantly Lose), Even If The Dealer's Hand Went Over As Well.
The Dealer Always Hits If His Hand Isn't Over 17.

- All Face Cards Are Equal To Ten, And An Ace Is Eleven But In The Case Of Potentially Busting
Can Turn Into One.

- When The Game Ends And The Player Either Loses, Draws Or Wins, All Action Buttons Are
Removed And Replaced With A Restart Button, Starting Another Round.

- A Betting Form To The Left Of The Cards, Where You Can Bet Any Amount Of Chips Bigger Than 25 And Within Your Balance.

- There Is A Button To Switch The Sound Effect Played When Certain Actions Are Performed.

- A Link Referring Back To The Home Page On The Left.

---

### Slot Machine ('SlotMachine.html')

A Page Containing A Slot Machine.

- Three Slots With Question Marks Sit In The Center Of The Screen, With A Run Button.
- Once Activated, The Slots Start Changing Between 6 Symbols 
(Spade, Clover, Diamond, Heart, Black Ace And Red Ace),Eventually Stopping On A Predetermined Symbol.
- Different Combinations And Symbols Give Different Multipliers (Applied To Chips Wagered),
With Spade Being Most Common (40%) And Red Ace Being The Rarest (2%).

- The Wager Will Always Be A Twentieth Of Your Current Balance, But Will Never Go Below 50 Chips.

- A Link Referring Back To The Home Page On The Left.

---

## Data And State

- **Deck Of Cards:** A Queue Of Objects Simulating Playing Cards Stored In The Server.
The Client Can Call To Reshuffle The Deck. 
- **Cards:** Every Time A Card Is Pulled (Fetched) From The Server It Is Stored As An Object In The Client Side.
- **Hidden:** The Dealer's Hidden Card, Fetched From The Server And Stored In The Client Side Seperately Until The Game Ends.
- **Audio:**  A Client Side Element Determining Which Sound Effect Is Used.
- **Decks:** The Decks Of The Dealer And The Player Are Saved As Objects In The Client Side Containing The Fetched Cards.
- **Balance** Your Balance Of Chips Across All Pages, Stored In The Server. Fetched And Updated When Necessary.


---

## User Interactions

| Interaction | Where | Result |
|---|---|---|
| Press Start | BlackJack | Fetches Four Cards From The Server, Reveals The Action Buttons, Removes The Wagered Chips From Your Balance And Starts The Game|
| Press Hit | BlackJack | Fetches An Additional Card From The Server And Checks If The Player Busts |
| Press Stand | BlackJack | Reveals The Dealer Full Hand And Fetches Cards For Him, Calculates The Winner (If The Player Then Adds The Wagered Chips To Your Balance) And Ends The Game With An Outcome Message  |
| Press Split | BlackJack | Fetches Two More Cards From The Server And Splits The Player's Hand Into Two |
| Press Restart| BlackJack | Removes All Cards, Resets All Values And Calls The Server Side To Reshuffle The Deck And Then Runs Start|
| Press Switch Sound | Switches The Sound Effect Played In Actions|
| Press Bet | SlotMachine | Predetermines The Outcome, Starts Switching Symbols Until The Chosen One Arrives, Removes The Wagered Amount And Returns It Times The Multiplier |
| Click Home Link | Any page | Redirects To The Home Page |

---

## What the App Does NOT Do

- No user accounts or login.
- No persistent storage — Chips are lost on server restart.
- No client-side routing or single-page app behaviour.
- No Responsive Layout.
- No Shared Elements Except The Home Page Link And The Balance.
- No admin interface.
- No search.
