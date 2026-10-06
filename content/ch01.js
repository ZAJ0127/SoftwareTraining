// Chapter 1: C++ basics.
// Lessons and challenges are original; each lesson links to the matching
// learncpp.com lesson for the full treatment.
//
// Text fields: wrap inline code in `backticks`.
// Code fields use String.raw so C++ backslashes (like '\n') stay as written.

const cpp = String.raw;
const L = 'https://www.learncpp.com/cpp-tutorial/';

export default {
  num: '1',
  lessons: [
    {
      id: 'c1-first-program',
      title: 'Your first program',
      character: 'Mirajane',
      show: 'Fairy Tail',
      refs: [{ label: '1.1 Statements and the structure of a program', url: L + 'statements-and-the-structure-of-a-program/' }],
      body: [
        { p: "Every guild has a front desk, and at Fairy Tail that's Mirajane. Nothing happens until you check in with her. A C++ program has a front desk too: a function called `main`. When your program starts, it runs the statements inside `main` from top to bottom, then stops." },
        { p: 'A statement is one instruction. Most statements end with a semicolon, the same way a sentence ends with a full stop. Forget it and the compiler refuses to build your program.' },
        { code: cpp`#include <iostream>

int main() {
  std::cout << "Checked in at the front desk.\n";
  return 0;
}` },
        { p: 'Line 1 brings in the tools for printing. `int main()` starts the function, the braces mark where it begins and ends, and `return 0;` tells the operating system that everything went fine.' },
        { tip: 'Try it: add a second `std::cout` line that prints a message of your own, then run it.' },
      ],
      check: {
        q: 'What happens if you delete the semicolon at the end of line 4?',
        options: ['The program prints nothing', 'The compiler reports an error and nothing runs', 'The program runs but skips that line'],
        answer: 1,
        explain: 'A missing semicolon is a syntax error. The compiler stops, so there is no program to run.',
      },
    },
    {
      id: 'c1-comments',
      title: 'Comments',
      character: 'Felicity',
      show: 'Arrow',
      refs: [{ label: '1.2 Comments', url: L + 'comments/' }],
      body: [
        { p: 'Felicity leaves notes all over her code so the rest of the team can follow what she did at 3 a.m. Those notes are comments: text the compiler ignores completely.' },
        { p: '`//` starts a comment that runs to the end of the line. `/* ... */` wraps a comment that can span several lines. Good comments say why the code does something. The code itself already says what.' },
        { code: cpp`#include <iostream>

int main() {
  // Greet the team before the mission starts
  std::cout << "Systems online.\n";

  /* This line is switched off for now:
  std::cout << "Alarm triggered.\n";
  */
  return 0;
}` },
        { tip: 'Putting `//` in front of a line to switch it off for a moment is called commenting out. It is one of the most useful debugging tricks you will learn.' },
      ],
      check: {
        q: 'How many lines does the program above print?',
        options: ['0', '1', '2'],
        answer: 1,
        explain: 'Only the first std::cout runs. The second sits inside a block comment, so the compiler never sees it.',
      },
    },
    {
      id: 'c1-variables',
      title: 'Variables',
      character: 'Lucy',
      show: 'Fairy Tail',
      refs: [
        { label: '1.3 Introduction to objects and variables', url: L + 'introduction-to-objects-and-variables/' },
        { label: '1.4 Variable assignment and initialization', url: L + 'variable-assignment-and-initialization/' },
      ],
      body: [
        { p: 'Lucy keeps her celestial keys on a ring, and she always knows how many she has. A variable is a named box in memory that holds a value like that count.' },
        { p: 'To create one, give its type and its name. `int` means a whole number. Put the starting value in braces: `int keys{ 10 };`. This is called initialization, and you should do it every time you create a variable.' },
        { p: 'Later you can replace the value with `=`. That is assignment: the old value is thrown away and the new one takes its place.' },
        { code: cpp`#include <iostream>

int main() {
  int keys{ 10 };      // create and initialize
  std::cout << keys << '\n';

  keys = 11;           // assign a new value
  std::cout << keys << '\n';
  return 0;
}` },
      ],
      check: {
        q: 'After `int a{ 4 }; int b{ a }; a = 9;` what is the value of b?',
        options: ['4', '9', '13'],
        answer: 0,
        explain: "b received a copy of a's value at the moment it was created. Changing a afterwards does not reach back and change b.",
      },
    },
    {
      id: 'c1-input-output',
      title: 'Printing and reading',
      character: 'Nami',
      show: 'One Piece',
      refs: [{ label: '1.5 Introduction to iostream: cout, cin, and endl', url: L + 'introduction-to-iostream-cout-cin-and-endl/' }],
      body: [
        { p: 'Nami counts every berry that comes in and every berry that goes out. Programs do the same with text: `std::cout` sends it out to the screen, and `std::cin` brings it in from the keyboard.' },
        { p: 'The arrows show which way the data moves. `std::cout << x` pushes x out. `std::cin >> x` pulls a value in and stores it in x. You can chain several `<<` in one statement.' },
        { p: "End a line with `'\\n'`. Without it, the next thing you print carries on along the same line." },
        { code: cpp`#include <iostream>

int main() {
  int berries{};
  std::cin >> berries;
  std::cout << "Nami counted " << berries << " berries.\n";
  return 0;
}`, stdin: '300' },
        { tip: 'In this app, anything the program reads with `std::cin` comes from the Input box under the editor. Change the number there and run again.' },
      ],
      check: {
        q: 'What does `std::cout << "A" << "B\\n" << "C";` print?',
        options: ['A B C on one line', 'AB on one line, then C on the next', 'A, B and C on three lines'],
        answer: 1,
        explain: 'Nothing adds spaces or line breaks for you. A and B sit together, the \\n ends the line, and C starts the next one.',
      },
    },
    {
      id: 'c1-uninitialized',
      title: 'Uninitialized variables',
      character: 'Tsunade',
      show: 'Naruto',
      refs: [{ label: '1.6 Uninitialized variables and undefined behavior', url: L + 'uninitialized-variables-and-undefined-behavior/' }],
      body: [
        { p: 'Tsunade will bet on anything, and she nearly always loses. Leaving a variable without a starting value is the same kind of bet.' },
        { p: '`int x;` creates a variable but puts nothing in it. Whatever was lying in that piece of memory before is now your value. It might be 0. It might be 32767. It can change from one run to the next.' },
        { p: 'Using that value is called undefined behavior: the language makes no promise about what happens. The fix costs two characters. Write `int x{};` and the variable starts at zero.' },
        { code: cpp`#include <iostream>

int main() {
  int safe{};        // starts at 0, every time
  std::cout << "Safe bet: " << safe << '\n';
  return 0;
}` },
        { tip: 'Undefined behavior is nasty because the program may appear to work on one machine and fail on another. Always initialize.' },
      ],
      check: {
        q: 'Which line creates a variable you can safely print straight away?',
        options: ['int total;', 'int total{};', 'Both are safe'],
        answer: 1,
        explain: 'The empty braces set total to 0. Without them the value is whatever happened to be in memory.',
      },
    },
    {
      id: 'c1-expressions',
      title: 'Literals, operators, and expressions',
      character: 'Bulma',
      show: 'Dragon Ball',
      refs: [
        { label: '1.9 Introduction to literals and operators', url: L + 'introduction-to-literals-and-operators/' },
        { label: '1.10 Introduction to expressions', url: L + 'introduction-to-expressions/' },
      ],
      body: [
        { p: 'Bulma runs the numbers before she builds anything. In C++, a value written directly in the code, like `5` or `"hello"`, is a literal. Operators such as `+`, `-`, `*` and `/` combine values.' },
        { p: 'Anything that works out to a single value is an expression: `2 + 3`, `speed * 2`, even just `speed`. You can use an expression anywhere a value is expected, including inside `std::cout`.' },
        { p: 'Multiplication and division happen before addition and subtraction, as in school maths. Use parentheses when you want a different order.' },
        { code: cpp`#include <iostream>

int main() {
  int capsules{ 4 };
  int perCapsule{ 6 };
  std::cout << capsules * perCapsule << '\n';
  std::cout << 2 + 3 * 4 << '\n';
  std::cout << (2 + 3) * 4 << '\n';
  return 0;
}` },
        { tip: 'Dividing two `int` values throws away the remainder: `7 / 2` is 3, not 3.5. The types that keep fractions arrive in chapter 4.' },
      ],
      check: {
        q: 'What does `std::cout << 10 - 2 * 3;` print?',
        options: ['24', '4', '8'],
        answer: 1,
        explain: '2 * 3 happens first, giving 6. Then 10 - 6 is 4.',
      },
    },
  ],

  challenges: [
    {
      id: 'c1-guild-greeting',
      kind: 'write',
      level: 'Easy',
      title: 'Guild greeting',
      character: 'Mirajane',
      show: 'Fairy Tail',
      lesson: 'c1-first-program',
      prompt: 'Mirajane wants a welcome message on the guild hall screen. Print exactly this line.',
      starter: cpp`#include <iostream>

int main() {
  // Print the welcome message here

  return 0;
}`,
      tests: [{ name: 'Prints the welcome', stdin: '', expected: 'Welcome to Fairy Tail!' }],
      hints: [
        'Text goes inside double quotes.',
        'Send it to the screen with `std::cout << "...";`',
        'Check the capital letters and the exclamation mark. The test compares every character.',
      ],
      solution: cpp`#include <iostream>

int main() {
  std::cout << "Welcome to Fairy Tail!\n";
  return 0;
}`,
      explain: '`std::cout` followed by `<<` sends the text in quotes to the screen. The statement ends with a semicolon, and `\\n` finishes the line.',
    },
    {
      id: 'c1-shopping-list',
      kind: 'write',
      level: 'Easy',
      title: "Yor's shopping list",
      character: 'Yor',
      show: 'Spy x Family',
      lesson: 'c1-first-program',
      prompt: 'Yor is determined to cook dinner tonight. Print her shopping list, one item per line.',
      starter: cpp`#include <iostream>

int main() {

  return 0;
}`,
      tests: [{ name: 'Three items, three lines', stdin: '', expected: 'Eggs\nFlour\nButter' }],
      hints: [
        'Each statement runs in order, top to bottom.',
        "Every item needs its own line ending: `\\n` inside the quotes.",
        'Three `std::cout` statements will do it. One statement with three `\\n` works too.',
      ],
      solution: cpp`#include <iostream>

int main() {
  std::cout << "Eggs\n";
  std::cout << "Flour\n";
  std::cout << "Butter\n";
  return 0;
}`,
      explain: 'Statements run one after another, so three print statements give three lines in the order you wrote them.',
    },
    {
      id: 'c1-capsule-bug',
      kind: 'bughunt',
      level: 'Easy',
      title: 'Capsule No. 9',
      character: 'Bulma',
      show: 'Dragon Ball',
      lesson: 'c1-first-program',
      prompt: 'Bulma typed this in a hurry and it will not compile. There are three mistakes. Fix them so it prints this line.',
      starter: cpp`#include <iostream>

int main() {
  std::cout << "Capsule No. 9 "
  std::cout < "ready\n";
  return 0
}`,
      tests: [{ name: 'Compiles and prints the line', stdin: '', expected: 'Capsule No. 9 ready' }],
      hints: [
        'Run it and read the first error. The line number tells you where the compiler got confused, which is often one line after the real mistake.',
        'Two statements are missing their semicolons.',
        'The output operator is two characters: `<<`.',
      ],
      solution: cpp`#include <iostream>

int main() {
  std::cout << "Capsule No. 9 ";
  std::cout << "ready\n";
  return 0;
}`,
      explain: 'Lines 4 and 6 needed semicolons, and line 5 used `<` (less than) where it needed `<<` (output). Fix the first error the compiler reports, then run again: later errors are often side effects of the first.',
    },
    {
      id: 'c1-key-count',
      kind: 'write',
      level: 'Easy',
      title: 'Key count',
      character: 'Lucy',
      show: 'Fairy Tail',
      lesson: 'c1-variables',
      prompt: 'Lucy is taking stock of her keys. Create an `int` variable holding her 10 gold keys and another holding her 5 silver keys, then print both counts using the variables.',
      starter: cpp`#include <iostream>

int main() {
  // Create the two variables

  // Print both counts

  return 0;
}`,
      tests: [{ name: 'Prints both counts', stdin: '', expected: 'Gold keys: 10\nSilver keys: 5' }],
      hints: [
        'A variable needs a type, a name, and a starting value: `int goldKeys{ 10 };`',
        'You can chain text and a variable in one statement: `std::cout << "Gold keys: " << goldKeys << \'\\n\';`',
        'Mind the space after each colon.',
      ],
      solution: cpp`#include <iostream>

int main() {
  int goldKeys{ 10 };
  int silverKeys{ 5 };

  std::cout << "Gold keys: " << goldKeys << '\n';
  std::cout << "Silver keys: " << silverKeys << '\n';
  return 0;
}`,
      explain: 'Text in quotes prints as written. A variable name without quotes prints the value stored in it. Chaining `<<` lets you mix the two.',
    },
    {
      id: 'c1-berry-doubler',
      kind: 'write',
      level: 'Easy',
      title: 'Berry doubler',
      character: 'Nami',
      show: 'One Piece',
      lesson: 'c1-input-output',
      prompt: 'Nami has found a way to double any treasure. Read one whole number and print twice that number.',
      starter: cpp`#include <iostream>

int main() {
  int berries{};
  // Read a number into berries, then print double

  return 0;
}`,
      tests: [
        { name: 'Doubles 250', stdin: '250', expected: '500' },
        { name: 'Doubles zero', stdin: '0', expected: '0' },
        { name: 'Doubles a debt', stdin: '-40', expected: '-80' },
      ],
      hints: [
        '`std::cin >> berries;` reads a number from the input into the variable.',
        'You can print an expression directly: `berries * 2`.',
      ],
      solution: cpp`#include <iostream>

int main() {
  int berries{};
  std::cin >> berries;
  std::cout << berries * 2 << '\n';
  return 0;
}`,
      explain: '`std::cin >> berries` stores the input in the variable. `berries * 2` is an expression, so it can go straight into `std::cout` without a second variable.',
    },
    {
      id: 'c1-arrows-left',
      kind: 'write',
      level: 'Easy',
      title: 'Arrows left',
      character: 'Kate Bishop',
      show: 'Hawkeye',
      lesson: 'c1-input-output',
      prompt: 'Kate starts with a full quiver and fires some arrows. Read two whole numbers, the arrows she started with and the arrows she fired, then print how many are left in this format.',
      starter: cpp`#include <iostream>

int main() {

  return 0;
}`,
      tests: [
        { name: '12 arrows, 5 fired', stdin: '12 5', expected: 'Arrows left: 7' },
        { name: 'Empty quiver', stdin: '30 30', expected: 'Arrows left: 0' },
        { name: 'Numbers on separate lines', stdin: '8\n3', expected: 'Arrows left: 5' },
      ],
      hints: [
        'You need two variables, one for each number.',
        'One statement can read both: `std::cin >> quiver >> fired;`',
        'Print the label, then the expression `quiver - fired`.',
      ],
      solution: cpp`#include <iostream>

int main() {
  int quiver{};
  int fired{};
  std::cin >> quiver >> fired;
  std::cout << "Arrows left: " << quiver - fired << '\n';
  return 0;
}`,
      explain: '`std::cin` skips spaces and line breaks between numbers, so the same code handles input on one line or two.',
    },
    {
      id: 'c1-unlucky-bet',
      kind: 'bughunt',
      level: 'Medium',
      title: 'The unlucky bet',
      character: 'Tsunade',
      show: 'Naruto',
      lesson: 'c1-uninitialized',
      prompt: 'For once Tsunade wins, and the payout is double her bet. This program should read the bet and print the winnings. It compiles, but it prints the wrong number. Fix it.',
      starter: cpp`#include <iostream>

int main() {
  int bet{};
  int winnings;
  std::cout << "Winnings: " << winnings << '\n';
  std::cin >> bet;
  winnings = bet * 2;
  return 0;
}`,
      tests: [
        { name: 'Bet of 100', stdin: '100', expected: 'Winnings: 200' },
        { name: 'Bet of 75', stdin: '75', expected: 'Winnings: 150' },
        { name: 'No bet', stdin: '0', expected: 'Winnings: 0' },
      ],
      hints: [
        'Statements run top to bottom. What value does `winnings` hold at the moment it is printed?',
        'The program prints before it has read the bet or done the calculation.',
        'Move the print to the end, and give `winnings` a starting value with `{}` while you are there.',
      ],
      solution: cpp`#include <iostream>

int main() {
  int bet{};
  int winnings{};
  std::cin >> bet;
  winnings = bet * 2;
  std::cout << "Winnings: " << winnings << '\n';
  return 0;
}`,
      explain: 'The original printed `winnings` before anything had been stored in it, which is undefined behavior. Reading, calculating, then printing fixes the order, and `{}` makes sure the variable never holds garbage.',
    },
    {
      id: 'c1-requip',
      kind: 'predict',
      level: 'Easy',
      title: 'Requip order',
      character: 'Erza',
      show: 'Fairy Tail',
      lesson: 'c1-variables',
      prompt: 'Erza is swapping gear mid-fight. Read the code without running it. What does it print?',
      code: cpp`#include <iostream>

int main() {
  int swords{ 3 };
  swords = swords + 2;
  int armor{ swords };
  swords = 10;
  std::cout << armor << '\n';
  return 0;
}`,
      options: ['3', '5', '10', '12'],
      answer: 1,
      explain: '`swords` becomes 5 on line 5. `armor` copies that 5 on line 6. Changing `swords` to 10 afterwards has no effect on `armor`, because a variable holds its own copy of the value.',
    },
    {
      id: 'c1-party-total',
      kind: 'write',
      level: 'Easy',
      title: 'Party total',
      character: 'Asuna',
      show: 'Sword Art Online',
      lesson: 'c1-expressions',
      prompt: "Asuna checks her party before a boss fight. Read three whole numbers, one HP value per party member, and print the party's total HP in this format.",
      starter: cpp`#include <iostream>

int main() {

  return 0;
}`,
      tests: [
        { name: 'Three fighters', stdin: '120 95 140', expected: 'Total HP: 355' },
        { name: 'Everyone down', stdin: '0 0 0', expected: 'Total HP: 0' },
        { name: 'One number per line', stdin: '1\n2\n3', expected: 'Total HP: 6' },
      ],
      hints: [
        'Three inputs need three variables.',
        'Chain the reads: `std::cin >> a >> b >> c;`',
        'Add them inside the print statement: `a + b + c`.',
      ],
      solution: cpp`#include <iostream>

int main() {
  int a{};
  int b{};
  int c{};
  std::cin >> a >> b >> c;
  std::cout << "Total HP: " << a + b + c << '\n';
  return 0;
}`,
      explain: 'Each `>>` fills the next variable in turn. The sum is an expression, so it can be printed directly.',
    },
    {
      id: 'c1-crate-lift',
      kind: 'bughunt',
      level: 'Medium',
      title: 'Crate lift',
      character: 'Ochaco',
      show: 'My Hero Academia',
      lesson: 'c1-expressions',
      prompt: 'Ochaco is floating crates onto a truck. The program should read the weight of one crate and the number of crates, then print the total weight. It runs, but the answer is wrong. Find the two bugs.',
      starter: cpp`#include <iostream>

int main() {
  int weight{};
  int crates{};
  std::cin >> weight >> weight;
  std::cout << "Total: " << weight + crates << '\n';
  return 0;
}`,
      tests: [
        { name: '3 crates of 20', stdin: '20 3', expected: 'Total: 60' },
        { name: '5 crates of 5', stdin: '5 5', expected: 'Total: 25' },
        { name: 'No crates', stdin: '100 0', expected: 'Total: 0' },
      ],
      hints: [
        'Trace it by hand with the input 20 3. What is in each variable after line 6?',
        'Both numbers are being read into the same variable.',
        'Total weight is weight times count, not weight plus count.',
      ],
      solution: cpp`#include <iostream>

int main() {
  int weight{};
  int crates{};
  std::cin >> weight >> crates;
  std::cout << "Total: " << weight * crates << '\n';
  return 0;
}`,
      explain: 'Line 6 read both numbers into `weight`, so the second overwrote the first and `crates` stayed at 0. Line 7 added where it should have multiplied. Neither is a compile error, which is why tracing values by hand is worth practising.',
    },
    {
      id: 'c1-precedence',
      kind: 'predict',
      level: 'Easy',
      title: 'Exact materials',
      character: 'Momo',
      show: 'My Hero Academia',
      lesson: 'c1-expressions',
      prompt: 'Momo has to calculate her materials exactly before she creates anything. What does this print?',
      code: cpp`#include <iostream>

int main() {
  std::cout << 2 + 3 * 4 - 1 << '\n';
  return 0;
}`,
      options: ['19', '13', '11', '15'],
      answer: 1,
      explain: 'Multiplication goes first: 3 * 4 is 12. Then left to right: 2 + 12 is 14, and 14 - 1 is 13.',
    },
    {
      id: 'c1-mission-timer',
      kind: 'write',
      level: 'Medium',
      title: 'Mission timer',
      character: 'Natasha',
      show: 'Marvel',
      lesson: 'c1-expressions',
      prompt: "Natasha's mission clock shows minutes and seconds, but the detonator only takes seconds. Read two whole numbers, minutes then seconds, and print the total number of seconds in this format.",
      starter: cpp`#include <iostream>

int main() {

  return 0;
}`,
      tests: [
        { name: '2 min 30 s', stdin: '2 30', expected: 'Seconds: 150' },
        { name: 'Under a minute', stdin: '0 45', expected: 'Seconds: 45' },
        { name: 'Ten minutes flat', stdin: '10 0', expected: 'Seconds: 600' },
      ],
      hints: [
        'There are 60 seconds in a minute.',
        'The expression is `minutes * 60 + seconds`. Multiplication happens first, so no parentheses are needed.',
      ],
      solution: cpp`#include <iostream>

int main() {
  int minutes{};
  int seconds{};
  std::cin >> minutes >> seconds;
  std::cout << "Seconds: " << minutes * 60 + seconds << '\n';
  return 0;
}`,
      explain: 'Operator precedence does the work: `minutes * 60` is calculated first, then `seconds` is added.',
    },
  ],
};
