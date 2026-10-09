// Engineering unit 2: Finding and fixing bugs.
// Needs only what C++ chapter 1 teaches.
// (Lesson and challenge ids start with e1- because this was once unit 1.
// They are stored in saved progress, so they must not change.)
//
// Lesson code blocks marked `broken: true` are meant to fail to compile.
// Predict challenges marked `noVerify: true` have answers that are not
// simply "what the code prints".

const cpp = String.raw;
const L = 'https://www.learncpp.com/cpp-tutorial/';

export default {
  num: 'E2',
  lessons: [
    {
      id: 'e1-source-to-program',
      title: 'How code becomes a program',
      character: 'Momo',
      show: 'My Hero Academia',
      refs: [
        { label: '0.5 Introduction to the compiler, linker, and libraries', url: L + 'introduction-to-the-compiler-linker-and-libraries/' },
        { label: '3.1 Syntax and semantic errors', url: L + 'syntax-and-semantic-errors/' },
      ],
      body: [
        { p: 'Momo can create almost any object, but only if she understands exactly how it is built. The compiler is the same. It turns your text into a working program, and it can only do that if every detail of the text is valid.' },
        { p: 'The text you write is source code. On its own it does nothing. The compiler translates it into machine code, and a second tool, the linker, joins that with library code such as `std::cout` to make an executable. Only then can the program run.' },
        { p: 'So there are three moments when something can go wrong, and knowing which one you are in is the first step in fixing anything.' },
        { p: 'A compile error means the compiler could not understand the text, and no program is produced. A runtime error means the program started, then crashed or misbehaved while running. A logic error means the program ran to the end and gave the wrong answer.' },
        { code: cpp`#include <iostream>

int main() {
  int price{ 20 };
  int quantity{ 3 };
  std::cout << "Total: " << price + quantity << '\n';
  return 0;
}` },
        { p: 'That program compiles and runs without complaint, and prints 23 where it should print 60. The compiler checks grammar, not meaning. Logic errors are the ones you have to catch yourself, which is what the rest of this unit is about.' },
      ],
      check: {
        q: 'A program compiles, runs to the end, and prints the wrong total. What kind of error is that?',
        options: ['Compile error', 'Runtime error', 'Logic error'],
        answer: 2,
        explain: 'It built and it ran, so the grammar was fine and nothing crashed. The instructions themselves were wrong.',
      },
    },
    {
      id: 'e1-reading-errors',
      title: 'Reading a compiler error',
      character: 'Natasha',
      show: 'Marvel',
      refs: [{ label: '3.1 Syntax and semantic errors', url: L + 'syntax-and-semantic-errors/' }],
      body: [
        { p: 'Natasha gets what she needs from an interrogation by listening to exactly what is said. Compiler errors look hostile, but they answer the same questions every time: where, and what.' },
        { p: "Take this message: `line 5: error: expected ',' or ';' before 'std'`. The line number is where the compiler noticed the problem. The real mistake is on that line or just before it, because the compiler only realises something is missing when it reaches the next thing." },
        { code: cpp`#include <iostream>

int main() {
  int agents{ 6 }
  std::cout << agents << '\n';
  return 0;
}`, broken: true },
        { tip: 'Run it and read the message before fixing anything. Which line does it name, and which line is the semicolon missing from?' },
        { p: 'Fix the first error, then compile again. One mistake often confuses the compiler for the rest of the file, so later errors may vanish once the first is fixed.' },
        { p: 'A warning is different. The program still builds, but the compiler has spotted something that is probably a mistake, such as using a variable before giving it a value. Treat a warning as an error that has not happened yet.' },
      ],
      check: {
        q: 'The compiler reports 12 errors. What is the best first move?',
        options: ['Fix the last one, since it is nearest the end', 'Fix the first one and compile again', 'Fix all twelve before compiling again'],
        answer: 1,
        explain: 'Later errors are often side effects of the first. Fixing them in order, one compile at a time, is usually the quickest route.',
      },
    },
    {
      id: 'e1-tracing',
      title: 'Tracing by hand',
      character: 'Hinata',
      show: 'Naruto',
      refs: [{ label: '3.4 Basic debugging tactics', url: L + 'basic-debugging-tactics/' }],
      body: [
        { p: "Hinata's Byakugan lets her see what is happening inside an opponent. You need the same view inside a running program, because the code you meant to write and the code you actually wrote are often different." },
        { p: 'Tracing means playing computer. Go through the code one line at a time and write down the value of every variable after each line. It feels slow. It is also the fastest way to find a logic error, because the moment your notes differ from what you expected, you have found the bug.' },
        { code: cpp`#include <iostream>

int main() {
  int chakra{ 100 };
  int cost{ 30 };
  chakra = chakra - cost;   // chakra is 70
  cost = cost * 2;          // cost is 60
  chakra = chakra - cost;   // chakra is 10
  std::cout << chakra << '\n';
  return 0;
}` },
        { p: 'When tracing in your head gets hard, make the program do it. Add a temporary `std::cout` that prints a variable at the point you are unsure about, run it, and compare. This is called print debugging, and working engineers use it every day.' },
        { tip: "Label your debug prints, for example `std::cout << \"after cost: \" << chakra << '\\n';`, so you can tell them apart. Remove them when you are done." },
      ],
      check: {
        q: 'In the example, what is the value of `cost` when the program ends?',
        options: ['30', '60', '10'],
        answer: 1,
        explain: 'cost starts at 30 and line 7 doubles it. Nothing changes it after that.',
      },
    },
    {
      id: 'e1-testing',
      title: 'Test it like you want it to break',
      character: 'Yoruichi',
      show: 'Bleach',
      refs: [{ label: '9.1 Introduction to testing your code', url: L + 'introduction-to-testing-your-code/' }],
      body: [
        { p: 'Yoruichi does not test an opponent by hitting where they are strongest. She probes for the gap. Testing your own code takes the same attitude: you are trying to break it, because anything you fail to break now will break later in front of someone else.' },
        { p: 'A test is an input together with the output you expect. Work out the expected output yourself, before you run the code. If you run first, it is too easy to look at whatever came out and decide it seems fine.' },
        { p: 'One test is never enough. A program that works for 10 and 2 may fail for 0, for a negative number, or when the answer is not a whole number. These awkward inputs are called edge cases, and bugs collect there.' },
        { code: cpp`#include <iostream>

int main() {
  int cookies{};
  int friends{};
  std::cin >> cookies >> friends;
  std::cout << "Each gets " << cookies / friends << '\n';
  return 0;
}`, stdin: '10 2' },
        { tip: 'Run it with `10 2`, then change the input to `7 2`. The first looks fine. The second gives 3 each, and one cookie quietly goes missing.' },
        { p: 'The Check button in this app runs tests somebody else wrote. In a real job nobody hands you those. Being the person who thinks of the awkward inputs is a large part of what makes an engineer reliable.' },
      ],
      check: {
        q: 'You wrote a function that halves a number. Which set of test inputs is the most useful?',
        options: ['10, 20, 30', '10, 7, 0, -4', '2, 4, 8'],
        answer: 1,
        explain: 'It covers an even number, an odd number, zero and a negative. The other sets only test the easy case three times.',
      },
    },
  ],

  challenges: [
    {
      id: 'e1-blueprint',
      kind: 'predict',
      noVerify: true,
      level: 'Easy',
      title: 'Check the blueprint',
      character: 'Momo',
      show: 'My Hero Academia',
      lesson: 'e1-source-to-program',
      prompt: 'Momo checks a blueprint before she builds. Without running this, decide what happens.',
      code: cpp`#include <iostream>

int main() {
  std::cout << "Creation complete\n;
  return 0;
}`,
      options: ['It will not compile', 'It compiles, then crashes when run', 'It runs and prints the wrong text', 'It runs correctly'],
      answer: 0,
      explain: 'The closing quote is missing on line 4, so the compiler cannot tell where the text ends. That is a compile error: no program is produced, so there is nothing to run or crash.',
    },
    {
      id: 'e1-checklist-bug',
      kind: 'bughunt',
      level: 'Easy',
      title: 'Mission checklist',
      character: 'Natasha',
      show: 'Marvel',
      lesson: 'e1-reading-errors',
      prompt: 'This mission checklist will not compile. Run it, read the first error, fix that one thing, and run again. The messages tell you almost exactly what to do.',
      starter: cpp`#include <iostream>

int main() {
  int agents{ 4 };
  int gadgets{ 3 };
  int totl{ agents * gadgets };
  std::cout << "Gadgets packed: " << total << '\n';
  std::cout << "Agents: " << agent << '\n';
  return 0;
}`,
      tests: [{ name: 'Compiles and prints both lines', stdin: '', expected: 'Gadgets packed: 12\nAgents: 4' }],
      hints: [
        '"was not declared" means the compiler has never seen that exact name.',
        'Compare the name on line 7 with the name defined on line 6, letter by letter.',
        'There is a second misspelled name on line 8.',
      ],
      solution: cpp`#include <iostream>

int main() {
  int agents{ 4 };
  int gadgets{ 3 };
  int total{ agents * gadgets };
  std::cout << "Gadgets packed: " << total << '\n';
  std::cout << "Agents: " << agents << '\n';
  return 0;
}`,
      explain: 'Both errors were misspelled names. The compiler even suggests the name it thinks you meant. Reading the message carefully is faster than staring at the code.',
    },
    {
      id: 'e1-trace-swap',
      kind: 'predict',
      level: 'Medium',
      title: 'See through it',
      character: 'Hinata',
      show: 'Naruto',
      lesson: 'e1-tracing',
      prompt: 'Trace this line by line and write the values down as you go. What does it print?',
      code: cpp`#include <iostream>

int main() {
  int a{ 2 };
  int b{ 5 };
  a = a + b;
  b = a - b;
  a = a - b;
  std::cout << a << ' ' << b << '\n';
  return 0;
}`,
      options: ['2 5', '5 2', '7 2', '7 5'],
      answer: 1,
      explain: 'After line 6, a is 7. After line 7, b is 7 - 5 = 2. After line 8, a is 7 - 2 = 5. The three lines swap the two values, which is hard to see without writing each step down.',
    },
    {
      id: 'e1-average-bug',
      kind: 'bughunt',
      level: 'Medium',
      title: 'Tournament average',
      character: 'Videl',
      show: 'Dragon Ball',
      lesson: 'e1-tracing',
      prompt: "Videl wants the average of her two tournament scores. The program compiles and runs, but the answer is wrong. Trace it with the input 10 20 to find out why.",
      starter: cpp`#include <iostream>

int main() {
  int first{};
  int second{};
  std::cin >> first >> second;
  std::cout << "Average: " << first + second / 2 << '\n';
  return 0;
}`,
      tests: [
        { name: 'Scores 10 and 20', stdin: '10 20', expected: 'Average: 15' },
        { name: 'Two equal scores', stdin: '4 4', expected: 'Average: 4' },
        { name: 'A zero and a hundred', stdin: '0 100', expected: 'Average: 50' },
      ],
      hints: [
        'With 10 and 20, which part of the expression is worked out first?',
        'Division happens before addition, so only `second` is being halved.',
        'Parentheses change the order: `(first + second) / 2`',
      ],
      solution: cpp`#include <iostream>

int main() {
  int first{};
  int second{};
  std::cin >> first >> second;
  std::cout << "Average: " << (first + second) / 2 << '\n';
  return 0;
}`,
      explain: 'Without parentheses the code worked out `first + (second / 2)`. Notice that the input 0 100 gave the right answer even with the bug. A test that happens to pass is why you need more than one.',
    },
    {
      id: 'e1-find-the-gap',
      kind: 'predict',
      noVerify: true,
      level: 'Medium',
      title: 'Find the gap',
      character: 'Yoruichi',
      show: 'Bleach',
      lesson: 'e1-testing',
      prompt: 'This code is meant to split a bill fairly between friends. With three of these inputs it looks correct. Which input exposes the flaw?',
      code: cpp`#include <iostream>

int main() {
  int bill{};
  int friends{};
  std::cin >> bill >> friends;
  std::cout << "Each pays " << bill / friends << '\n';
  return 0;
}`,
      options: ['10 2', '9 3', '7 2', '8 4'],
      answer: 2,
      explain: 'With 7 and 2, integer division gives 3 each, which only covers 6 of the 7. The other inputs divide evenly, so they would never reveal the problem. Good test inputs are the ones that do not divide neatly.',
    },
    {
      id: 'e1-payslip-bug',
      kind: 'bughunt',
      level: 'Medium',
      title: 'The pay slip',
      character: 'Rangiku',
      show: 'Bleach',
      lesson: 'e1-reading-errors',
      prompt: "Rangiku's pay slip is wrong. The bonus is supposed to be 10, added to the base pay she types in. The program compiles, so press Run and look below the output: the compiler has left a warning that points straight at the cause.",
      starter: cpp`#include <iostream>

int main() {
  int base{};
  int bonus;
  std::cin >> base;
  std::cout << "Pay: " << base + bonus << '\n';
  return 0;
}`,
      tests: [
        { name: 'Base pay of 40', stdin: '40', expected: 'Pay: 50' },
        { name: 'No base pay', stdin: '0', expected: 'Pay: 10' },
        { name: 'Base pay of 990', stdin: '990', expected: 'Pay: 1000' },
      ],
      hints: [
        'The warning says a variable is used uninitialized. Which one?',
        '`bonus` is created on line 5 but never given a value.',
        'Initialize it where it is created: `int bonus{ 10 };`',
      ],
      solution: cpp`#include <iostream>

int main() {
  int base{};
  int bonus{ 10 };
  std::cin >> base;
  std::cout << "Pay: " << base + bonus << '\n';
  return 0;
}`,
      explain: 'The compiler built the program but warned that `bonus` had no value. Warnings are free bug reports. Read them every time, even when the program appears to work.',
    },
  ],
};
