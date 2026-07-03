using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace My_Website
{
    public class Card
    {
        public string house { get; set; }
        public int cardValue { get; set; }

        public Card(string house, int cardValue)
        {
            this.house = house;
            this.cardValue = cardValue;
        }
        public Card()
        {
            Random r = new Random();
            int x = r.Next(1, 5);

            switch(x)
            {
                case 1:
                    {
                        this.house = "C";
                        break;
                    }

                case 2:
                    {
                        this.house = "S";
                        break;
                    }

                case 3:
                    {
                        this.house = "H";
                        break;
                    }

                case 4:
                    {
                        this.house = "D";
                        break;
                    }
            }

            this.cardValue = r.Next(1, 14);
        }
        public string GetHouse()
        {
            return house;
        }
        public int GetValue()
        {
            return cardValue;
        }
        public override string ToString()
        {
            return house + "" + cardValue;
        }

    }
    public class Deck
    {
        private Queue<Card> deck;
        private static Queue<Card> discards = new Queue<Card>();
        public Deck()
        {
            deck = new Queue<Card>();

                string[] arr = new string[] { "C", "S", "H", "D"};

                for (int i = 1; i <= 13; i++)
                {
                    for (int j = 0; j<4; j++)
                    {
                        deck.Insert(new Card(arr[j], i));
                    }
                }
        }

        public Card DrawTop()
        {
            Card Discard = deck.Remove();
            discards.Insert(Discard);

            return Discard;
        }
        public void Shuffle()
        {
            Queue<Card> q1 = new Queue<Card>();
            Queue<Card> q2 = new Queue<Card>();

            Random r = new Random();

            for (int i = 0; i < 12; i++)
            {
                for (int j = 0; j < 26; j++)
                {
                    q1.Insert(deck.Remove());
                }

                while (!deck.IsEmpty())
                {
                    q2.Insert(deck.Remove());
                }

                while (!q1.IsEmpty() && !q2.IsEmpty())
                {
                    int x = r.Next(1, 3);

                    if (x % 2 == 0)
                        deck.Insert(q1.Remove());

                    else
                        deck.Insert(q2.Remove());
                }

                if (!q1.IsEmpty())
                {
                    while (!q1.IsEmpty())
                        deck.Insert(q1.Remove());
                }

                else
                    while (!q2.IsEmpty())
                        deck.Insert(q2.Remove());
            }

            
        }
        public void Restart()
        {
            while (!discards.IsEmpty())
            {
                deck.Insert(discards.Remove());
            }

            this.Shuffle();
        }
    }
    public class Node<T>
    {
        private T value;
        private Node<T> next;

        //-----------------------------------
        //constructors
        public Node(T value)
        {
            this.value = value;
            this.next = null;
        }
        public Node(T value, Node<T> next)
        {
            this.value = value;
            this.next = next;
        }
        //-----------------------------------
        //getters
        public T GetValue()
        {
            return this.value;
        }
        public Node<T> GetNext()
        {
            return this.next;
        }
        //-----------------------------------
        //setters
        public void SetValue(T value)
        {
            this.value = value;
        }
        public void SetNext(Node<T> next)
        {
            this.next = next;
        }
        //-----------------------------------
        //return true if this.next is not null, else returns false
        public bool HasNext()
        {
            return (this.next != null);
        }
        //-----------------------------------
        //ToString
        public override string ToString()
        {
            return value + "," + next;
        }

    }
    public class Queue<T>
    {
        private Node<T> first;
        private Node<T> last;

        //-----------------------------------
        //constructor
        public Queue()
        {
            this.first = null;
            this.last = null;
        }
        //-----------------------------------
        //adds element x to the end of the queue
        public void Insert(T x)
        {
            Node<T> temp = new Node<T>(x);
            if (first == null)
                first = temp;
            else
                last.SetNext(temp);
            last = temp;
        }
        //-----------------------------------
        //removes & returns the element from the head of the queue
        public T Remove()
        {
            if (IsEmpty())
                return default(T);
            T x = first.GetValue();
            first = first.GetNext();
            if (first == null)
                last = null;
            return x;
        }
        //-----------------------------------
        //returns the element from the head of the queue
        public T Head()
        {
            return first.GetValue();
        }
        //-----------------------------------
        //returns true if there are no elements in queue
        public bool IsEmpty()
        {
            return first == null;
        }
        //-------------------------------------
        //ToString
        public override string ToString()
        {
            if (this.IsEmpty())
                return "[]";
            string temp = first.ToString();
            return "QueueHead[" + temp.Substring(0, temp.Length - 1) + "]";
        }
    }
    public class Man
    {
        public bool present { get; set; }
        public string[] dialogue { get; set; }
        public Man()
        {
            present = false;
            dialogue = new string[2];
        }

        public void SetMan()
        {
            present = true;
            dialogue[0] = "I See You've Gotten Your Hands Dirty With Gambling..";
            dialogue[1] = "Very Well..";
        }

        public Man GetMan()
        {
            return this;
        }
    }

    public class Program
    {


        public static void Main(string[] args)
        {

            Man man = new Man();
            int balance = 1000;

            Deck d = new Deck();
            d.Shuffle();

            var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.MapGet("/api/top", d.DrawTop);
            app.MapGet("/api/restart", d.Restart);
            app.MapGet("/api/setman", man.SetMan);
            app.MapGet("/api/getman", man.GetMan);
            app.MapGet("/api/balance", () => balance);

            app.MapPut("/api/incrementbalance", ([FromBody] int num) =>
            {
                balance += num;
            });
            app.MapPut("/api/decrementbalance", ([FromBody] int num) =>
            {
                if (num > balance)
                {
                    return false;
                }

                balance -= num;
                return true;
            });

            app.Run();

        }

        
    }
}
