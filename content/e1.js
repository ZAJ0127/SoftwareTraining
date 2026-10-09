// Engineering unit 1: Breaking a problem down.
// The method for getting from a blank page to working code.
// Needs only what C++ chapter 1 teaches.
//
// Challenge fields used here:
//   plan      the steps of a working plan, shown after solving
//   scaffold  'blank' = the editor starts empty and you write your own plan first
// Predict challenges marked `noVerify: true` are concept questions.

const cpp = String.raw;
const L = 'https://www.learncpp.com/cpp-tutorial/';

export default {
  num: 'E1',
  lessons: [
    {
      id: 'p1-blank-page',
      title: 'Why the blank page feels hard',
      character: 'Sakura',
      show: 'Naruto',
      refs: [],
      body: [
        { p: 'Sakura knew every answer in the written exam. Then came the field test, where nobody handed her the questions. Plenty of programmers are in the same spot: they can read code fine, but stare at an empty editor and freeze.' },
        { p: 'That is not a lack of talent. Reading and writing are different skills. Reading code is recognition: the answer is in front of you and you only have to follow it. Writing is recall: pulling the answer out of your own head with nothing to prompt you. Recognition always feels easier, so lots of reading can leave recall untrained.' },
        { p: 'Writing from scratch also needs a second skill that reading never exercises: turning a problem described in words into a list of small steps. Most people who feel stuck are missing this part, not the syntax.' },
        { p: 'Both can be trained, and the practice looks like this. Write from an empty file, not by filling in gaps. Plan in plain English before you write any code. Repeat the small, common patterns until you can type them without thinking. Give a problem a real attempt before looking anything up.' },
        { tip: 'Looking things up is normal. Experienced engineers do it all day. The difference is what they look up: a detail, such as the exact syntax for something, not the approach. The aim of this unit is to have the approach in your own head.' },
      ],
      check: {
        q: 'You can follow other people\'s code easily but cannot write similar code yourself. What is the most likely reason?',
        options: ['You need to read more code first', 'You have practised recognising code, but not recalling and planning it', 'Some people can only read code'],
        answer: 1,
        explain: 'Reading builds recognition. Writing needs recall and planning, which only improve when you practise writing from nothing.',
      },
    },
    {
      id: 'p1-five-steps',
      title: 'Five steps from problem to program',
      character: 'Temari',
      show: 'Naruto',
      refs: [],
      body: [
        { p: 'Temari never charges in. She reads the field, works out the moves, then commits. Here is the same discipline as a method you can use on any programming problem.' },
        { p: '1. Restate the problem. What comes in, and what has to come out? Write it in one sentence.' },
        { p: '2. Work one example by hand. Pick a real input and calculate the output yourself, on paper or in your head. Notice every calculation you do. Those calculations are your program.' },
        { p: '3. Write the steps in plain English. One small step per line. If you cannot say how to do a step, it is too big. Split it.' },
        { p: '4. Turn each step into code, one at a time. Run the program after each step, so a mistake is always in the line you just wrote.' },
        { p: '5. Test with awkward inputs: zero, a value that does not divide evenly, the largest or smallest case.' },
        { p: 'Here it is on a real problem: turn a number of seconds into minutes and seconds. Restated: one number comes in, two numbers come out. By hand, with 135: 135 divided by 60 is 2 whole minutes; those use up 120 seconds; 135 minus 120 leaves 15. The comments below are those steps, and each line of code is one of the calculations.' },
        { code: cpp`#include <iostream>

int main() {
  // 1. Read the total number of seconds
  int total{};
  std::cin >> total;

  // 2. Whole minutes: total divided by 60
  int minutes{ total / 60 };

  // 3. Seconds left over: total minus the seconds used by those minutes
  int seconds{ total - minutes * 60 };

  // 4. Print both
  std::cout << minutes << " min " << seconds << " s\n";
  return 0;
}`, stdin: '135' },
        { tip: 'Step 2 is the one people skip, and it is the one that unlocks the rest. If you cannot get the right answer by hand, no amount of code will get it for you.' },
      ],
      check: {
        q: 'You have read a problem and have no idea where to start. Which step comes next?',
        options: ['Start typing and see what happens', 'Work one example by hand and note each calculation you make', 'Search for a complete solution'],
        answer: 1,
        explain: 'Solving one example by hand shows you the calculations the program has to make. That turns "no idea" into a list of steps.',
      },
    },
    {
      id: 'p1-plan-in-comments',
      title: 'Plan in comments, then fill in',
      character: 'Lena',
      show: '86',
      refs: [{ label: '1.2 Comments', url: L + 'comments/' }],
      body: [
        { p: 'Lena commands her squadron from a distance, so every order has to be clear before anyone moves. A plan written as comments works the same way. It is a list of orders, and the code underneath carries each one out.' },
        { p: 'Start with only the skeleton and your steps as comments. This already compiles and runs. It just does nothing yet.' },
        { code: cpp`#include <iostream>

int main() {
  // 1. Read the price of one item
  // 2. Read how many items
  // 3. Total: price times quantity
  // 4. Print the total
  return 0;
}` },
        { p: 'Now fill in one step, run it, and only then move to the next. Each comment becomes one or two lines of code. By the end, the comments explain the code for free.' },
        { code: cpp`#include <iostream>

int main() {
  // 1. Read the price of one item
  int price{};
  std::cin >> price;

  // 2. Read how many items
  int quantity{};
  std::cin >> quantity;

  // 3. Total: price times quantity
  int total{ price * quantity };

  // 4. Print the total
  std::cout << "Total: " << total << '\n';
  return 0;
}`, stdin: '20 3' },
        { p: 'If a step will not turn into code, it is not small enough. "Work out the change" is too big. "Change is the amount paid minus the price" turns straight into one line.' },
        { tip: 'When you get stuck halfway, check the code against the comment above it. A surprising number of bugs are a line that does not do what its comment says.' },
      ],
      check: {
        q: 'One of your plan steps will not turn into code, however long you look at it. What should you do?',
        options: ['Skip it and come back later', 'Split it into smaller steps until each one is obvious', 'Delete the plan and start typing'],
        answer: 1,
        explain: 'A step that will not become code is too big. Keep splitting until each step is roughly one line.',
      },
    },
    {
      id: 'p1-when-stuck',
      title: 'When you are stuck',
      character: 'Shinobu',
      show: 'Demon Slayer',
      refs: [],
      body: [
        { p: 'Shinobu was never the strongest swordswoman, so she won with precision instead of force. Being stuck calls for the same approach. Pushing harder on the whole problem rarely works. Making the problem smaller does.' },
        { p: 'Shrink it. Cannot handle input yet? Put a fixed number in the code, such as `int total{ 135 };`, and get the calculation right first. Add the input once that works.' },
        { p: 'Get something running. A program that prints one correct number is a foothold. Build out from it, one step at a time.' },
        { p: 'Print what you have. If a value is wrong, print every variable along the way and find the first one that does not match your example by hand.' },
        { p: 'Name the gap exactly. "I cannot do this problem" has no answer. "I do not know how to read two numbers from the input" has a quick one, and that is the right size of thing to look up.' },
        { p: 'Look up the detail, not the solution. Search for the small thing you named. Then close the page and type it from memory. Copying keeps the knowledge in the browser. Retyping puts it in your head.' },
        { tip: 'Give every problem a real attempt, around 15 minutes, before you look at any help. Struggling a little is what makes the answer stick when you do find it.' },
      ],
      check: {
        q: 'Which of these is the most useful thing to search for when stuck?',
        options: ['"c++ bill splitting program solution"', '"c++ read two integers from input"', '"why can\'t I code"'],
        answer: 1,
        explain: 'It names one specific gap. A full solution teaches you to copy, not to write.',
      },
    },
  ],

  challenges: [
    {
      id: 'p1-which-plan',
      kind: 'predict',
      noVerify: true,
      level: 'Easy',
      title: 'The bar tab',
      character: 'Shizune',
      show: 'Naruto',
      lesson: 'p1-five-steps',
      prompt: "Shizune has to total Tsunade's bar tab: read the number of drinks and the price per drink, then print the total. Which plan works?",
      options: [
        'Print the total. Read the drinks and the price. Multiply them.',
        'Read the drinks and the price. Multiply them. Print the result.',
        'Read the drinks. Print the drinks times the price. Read the price.',
      ],
      answer: 1,
      explain: 'A value has to exist before you can use it. Read everything you need, calculate, then print. The other two plans use values that have not been read yet.',
    },
    {
      id: 'p1-by-hand',
      kind: 'predict',
      noVerify: true,
      level: 'Easy',
      title: 'Deal by hand',
      character: 'Cana',
      show: 'Fairy Tail',
      lesson: 'p1-five-steps',
      prompt: 'Before any code, work an example by hand. Cana deals 130 cards into decks of 52. How many full decks does she make, and how many cards are left over?',
      options: ['2 decks, 26 left', '3 decks, 0 left', '2 decks, 2 left', '2 decks, 78 left'],
      answer: 0,
      explain: '130 divided by 52 is 2 whole decks. Those use 2 × 52 = 104 cards, and 130 − 104 leaves 26. The two calculations you just made, `cards / 52` and `cards - decks * 52`, are the program.',
    },
    {
      id: 'p1-time-split',
      kind: 'write',
      level: 'Easy',
      title: 'Operation clock',
      character: 'Lena',
      show: '86',
      lesson: 'p1-plan-in-comments',
      prompt: "Lena's operation log records time as a total number of minutes. Read that number and print it as hours and minutes, in the format shown. The plan is already written as comments: fill in each step, and run after each one.",
      plan: [
        'Read the total number of minutes.',
        'Whole hours: total divided by 60.',
        'Minutes left over: total minus the minutes used by those hours.',
        'Print the hours and minutes in the format shown.',
      ],
      starter: cpp`#include <iostream>

int main() {
  // 1. Read the total number of minutes

  // 2. Whole hours: total divided by 60

  // 3. Minutes left over: total minus the minutes used by those hours

  // 4. Print "H h M min"

  return 0;
}`,
      tests: [
        { name: '135 minutes', stdin: '135', expected: '2 h 15 min' },
        { name: 'Exactly one hour', stdin: '60', expected: '1 h 0 min' },
        { name: 'Under an hour', stdin: '59', expected: '0 h 59 min' },
      ],
      hints: [
        'Step 1 is two lines: create an `int`, then read into it with `std::cin`.',
        'Step 2: `int hours{ total / 60 };`',
        'Step 3: the hours used up `hours * 60` minutes. Subtract that from the total.',
      ],
      solution: cpp`#include <iostream>

int main() {
  // 1. Read the total number of minutes
  int total{};
  std::cin >> total;

  // 2. Whole hours: total divided by 60
  int hours{ total / 60 };

  // 3. Minutes left over: total minus the minutes used by those hours
  int minutes{ total - hours * 60 };

  // 4. Print "H h M min"
  std::cout << hours << " h " << minutes << " min\n";
  return 0;
}`,
      explain: 'Each comment turned into one or two lines. This "how many whole groups, and what is left over" pattern comes up constantly: time, money, packing items, splitting work.',
    },
    {
      id: 'p1-plan-bug',
      kind: 'bughunt',
      level: 'Easy',
      title: 'Check it against the plan',
      character: 'Suzune',
      show: 'Classroom of the Elite',
      lesson: 'p1-plan-in-comments',
      prompt: 'Suzune wrote the plan first, then the code. The plan is right, but one line of code does not do what its comment says. Compare each line with the comment above it.',
      starter: cpp`#include <iostream>

int main() {
  // 1. Read the total number of days
  int total{};
  std::cin >> total;

  // 2. Whole weeks: total divided by 7
  int weeks{ total / 7 };

  // 3. Days left over: total minus the days used by those weeks
  int days{ total - weeks };

  // 4. Print both
  std::cout << "Weeks: " << weeks << ", days: " << days << '\n';
  return 0;
}`,
      tests: [
        { name: '10 days', stdin: '10', expected: 'Weeks: 1, days: 3' },
        { name: 'Under a week', stdin: '6', expected: 'Weeks: 0, days: 6' },
        { name: 'Exactly three weeks', stdin: '21', expected: 'Weeks: 3, days: 0' },
      ],
      hints: [
        'Work 10 days by hand. How many days do the whole weeks use up?',
        'The days used by the weeks are `weeks * 7`, not `weeks`.',
      ],
      solution: cpp`#include <iostream>

int main() {
  // 1. Read the total number of days
  int total{};
  std::cin >> total;

  // 2. Whole weeks: total divided by 7
  int weeks{ total / 7 };

  // 3. Days left over: total minus the days used by those weeks
  int days{ total - weeks * 7 };

  // 4. Print both
  std::cout << "Weeks: " << weeks << ", days: " << days << '\n';
  return 0;
}`,
      explain: 'Step 3 says "the days used by those weeks", which is `weeks * 7`. Reading each line against its comment found the bug without running anything. Notice the input 6 passed even with the bug.',
    },
    {
      id: 'p1-cards',
      kind: 'write',
      scaffold: 'blank',
      level: 'Medium',
      title: 'Deal the decks',
      character: 'Cana',
      show: 'Fairy Tail',
      lesson: 'p1-plan-in-comments',
      prompt: 'Cana deals a pile of cards into decks of 52. Read the number of cards, then print how many full decks she can make and how many cards are left over, in the format shown. This one starts from an empty file: write your plan first.',
      plan: [
        'Read the number of cards.',
        'Full decks: cards divided by 52.',
        'Left over: cards minus the cards used by those decks.',
        'Print the two lines.',
      ],
      starter: '',
      tests: [
        { name: '130 cards', stdin: '130', expected: 'Decks: 2\nLeft: 26' },
        { name: 'Exactly one deck', stdin: '52', expected: 'Decks: 1\nLeft: 0' },
        { name: 'One card short', stdin: '51', expected: 'Decks: 0\nLeft: 51' },
      ],
      hints: [
        'This is the same shape as the operation clock, with 52 in place of 60.',
        'Start with the skeleton: `#include <iostream>`, then `int main() { ... return 0; }`.',
        'Left over is `cards - decks * 52`.',
      ],
      solution: cpp`#include <iostream>

int main() {
  // 1. Read the number of cards
  int cards{};
  std::cin >> cards;

  // 2. Full decks: cards divided by 52
  int decks{ cards / 52 };

  // 3. Left over: cards minus the cards used by those decks
  int left{ cards - decks * 52 };

  // 4. Print the two lines
  std::cout << "Decks: " << decks << '\n';
  std::cout << "Left: " << left << '\n';
  return 0;
}`,
      explain: 'Same pattern, new problem. Recognising that a new problem has the shape of one you have already solved is a large part of what fluency feels like.',
    },
  ],

  drills: [
    {
      id: 'd-groups',
      pattern: 'Whole groups and leftovers',
      title: 'Groups and leftovers',
      lesson: 'p1-five-steps',
      prompt: 'Read a total and a group size. Print how many full groups there are on one line, and how many are left over on the next.',
      tests: [
        { name: '17 in groups of 5', stdin: '17 5', expected: '3\n2' },
        { name: 'Divides evenly', stdin: '10 5', expected: '2\n0' },
        { name: 'Too few for a group', stdin: '3 4', expected: '0\n3' },
      ],
      hint: 'Groups: `total / size`. Left over: `total - groups * size`.',
      solution: cpp`#include <iostream>

int main() {
  int total{};
  int size{};
  std::cin >> total >> size;
  int groups{ total / size };
  std::cout << groups << '\n';
  std::cout << total - groups * size << '\n';
  return 0;
}`,
    },
  ],
};
