// Chapter 2: Functions and files.
// Original lessons and challenges; each lesson links to the matching
// learncpp.com lesson for the full treatment.

const cpp = String.raw;
const L = 'https://www.learncpp.com/cpp-tutorial/';

export default {
  num: '2',
  lessons: [
    {
      id: 'c2-functions',
      title: 'Functions',
      character: 'Erza',
      show: 'Fairy Tail',
      refs: [
        { label: '2.1 Introduction to functions', url: L + 'introduction-to-functions/' },
        { label: '2.3 Void functions', url: L + 'void-functions-non-value-returning-functions/' },
      ],
      body: [
        { p: 'Erza does not forge a new sword every time she needs one. She calls on armor she already owns, by name, whenever the fight demands it. A function is the same idea: a block of code with a name that you can run whenever you need it.' },
        { p: 'You have been writing one function all along: `main`. To write your own, give it a return type, a name, parentheses, and a body in braces. `void` means the function hands nothing back.' },
        { p: 'Defining a function does not run it. It runs when you call it, by writing its name followed by parentheses. When the function finishes, the program carries on from the line after the call.' },
        { code: cpp`#include <iostream>

void requip() {
  std::cout << "Requip: Heaven's Wheel!\n";
}

int main() {
  std::cout << "Enemy spotted.\n";
  requip();
  std::cout << "Back to the fight.\n";
  return 0;
}` },
        { tip: 'Add a second `requip();` call and run it. One definition, as many calls as you like.' },
      ],
      check: {
        q: 'If you delete line 9, the call to `requip()`, what does the program print?',
        options: ['Nothing at all', 'Only the two lines printed by main', 'All three lines, as before'],
        answer: 1,
        explain: 'A function that is defined but never called never runs. The definition alone does nothing.',
      },
    },
    {
      id: 'c2-return-values',
      title: 'Return values',
      character: 'Wendy',
      show: 'Fairy Tail',
      refs: [{ label: '2.2 Function return values', url: L + 'function-return-values-value-returning-functions/' }],
      body: [
        { p: 'When Wendy heals someone, they walk away with more HP than they had. Something comes back from the spell. A function can hand a value back to whoever called it, and that value is the return value.' },
        { p: "Put the type of the value in front of the function's name, and use `return` to send it back. `int healingPower()` promises to return an `int`. The call then stands for that value: you can print it, store it, or use it in an expression." },
        { code: cpp`#include <iostream>

int healingPower() {
  return 50;
}

int main() {
  int hp{ 120 };
  hp = hp + healingPower();
  std::cout << "HP: " << hp << '\n';
  return 0;
}` },
        { p: '`return` also ends the function on the spot. Statements after it in the same function never run.' },
        { tip: 'A function whose type is not `void` must return a value on every path. Forgetting to is undefined behavior, the same trap as an uninitialized variable.' },
      ],
      check: {
        q: 'Using the function above, what does `std::cout << healingPower() + healingPower();` print?',
        options: ['50', '100', '5050'],
        answer: 1,
        explain: 'Each call is replaced by the value it returns, so the expression becomes 50 + 50.',
      },
    },
    {
      id: 'c2-parameters',
      title: 'Parameters and arguments',
      character: 'Nobara',
      show: 'Jujutsu Kaisen',
      refs: [{ label: '2.4 Introduction to function parameters and arguments', url: L + 'introduction-to-function-parameters-and-arguments/' }],
      body: [
        { p: "Nobara's technique is always the same move, but the number of nails changes with the target. A function that did exactly the same thing every time would be limited. Parameters let the caller send values in." },
        { p: "A parameter is a variable listed in the function's parentheses. The values you supply in the call are the arguments. Each argument is copied into its parameter, in order." },
        { code: cpp`#include <iostream>

int damage(int nails, int powerPerNail) {
  return nails * powerPerNail;
}

int main() {
  std::cout << damage(3, 40) << '\n';
  std::cout << damage(5, 40) << '\n';
  return 0;
}` },
        { p: "Because arguments are copied, changing a parameter inside the function does not change the caller's variable. The function works on its own copy." },
        { tip: 'Order matters. `damage(3, 40)` and `damage(40, 3)` happen to give the same answer, but `subtract(10, 3)` and `subtract(3, 10)` would not.' },
      ],
      check: {
        q: '`void boost(int x) { x = x + 10; }` is called as `boost(hp);` while hp is 30. What is hp afterwards?',
        options: ['30', '40', '10'],
        answer: 0,
        explain: 'x is a copy of hp. The function adds 10 to the copy, then the copy is thrown away. hp never changes.',
      },
    },
    {
      id: 'c2-local-scope',
      title: 'Local scope',
      character: 'Yor',
      show: 'Spy x Family',
      refs: [{ label: '2.5 Introduction to local scope', url: L + 'introduction-to-local-scope/' }],
      body: [
        { p: 'Yor keeps her two lives apart. What happens on a job stays on the job, and nobody at city hall knows a thing. Variables inside a function work the same way.' },
        { p: 'A variable created inside a function is a local variable. It exists from the line where it is defined until the closing brace of that function, then it is destroyed. Other functions cannot see it.' },
        { p: 'That means two functions can both have a variable called `count` without clashing. Each has its own.' },
        { code: cpp`#include <iostream>

int cleanUp() {
  int count{ 3 };        // this count belongs to cleanUp
  return count;
}

int main() {
  int count{ 10 };       // this count belongs to main
  cleanUp();
  std::cout << count << '\n';
  return 0;
}` },
        { tip: 'Define each variable as close as you can to where it is first used. Small scopes mean fewer places for a bug to hide.' },
      ],
      check: {
        q: 'Can `main` print a variable that was defined inside `cleanUp`?',
        options: ['Yes, any function can read it', 'No, it is out of scope and the code will not compile', 'Yes, but it prints 0'],
        answer: 1,
        explain: "A local variable's name is only visible inside the function that defines it. Using it elsewhere is a compile error.",
      },
    },
    {
      id: 'c2-forward-declarations',
      title: 'Forward declarations',
      character: 'Zatanna',
      show: 'DC',
      refs: [{ label: '2.7 Forward declarations and definitions', url: L + 'forward-declarations/' }],
      body: [
        { p: 'Before Zatanna walks on stage, the poster outside has already listed the acts. The audience knows what is coming even though nothing has been performed yet. The compiler needs the same notice.' },
        { p: 'It reads your file from top to bottom. If `main` calls a function that is defined further down, the compiler has not seen it yet and reports an error.' },
        { p: "A forward declaration fixes that. It is the function's first line, ending in a semicolon instead of a body: `int encore(int shows);`. It tells the compiler the function exists, what it takes and what it returns. The full definition can come later." },
        { code: cpp`#include <iostream>

int encore(int shows);   // declaration: the poster

int main() {
  std::cout << encore(3) << '\n';
  return 0;
}

int encore(int shows) {  // definition: the act
  return shows * 2;
}` },
        { tip: 'Delete line 3 and run it to see the error you get when the compiler meets a name it has not been told about.' },
      ],
      check: {
        q: 'What is the difference between a declaration and a definition?',
        options: ['They are the same thing', 'A declaration says the function exists; a definition also supplies its body', 'A definition comes first; a declaration supplies the body'],
        answer: 1,
        explain: 'The declaration is the promise, the definition is the delivery. The compiler needs the promise before the first call.',
      },
    },
    {
      id: 'c2-namespaces',
      title: 'Naming collisions and namespaces',
      character: 'Kate Bishop and Kate Kane',
      show: 'Marvel and DC',
      refs: [{ label: '2.9 Naming collisions and an introduction to namespaces', url: L + 'naming-collisions-and-an-introduction-to-namespaces/' }],
      body: [
        { p: 'Shout "Kate!" in a room that holds Kate Bishop and Kate Kane and both turn round. Code has the same problem. If two functions in one program have the same name and parameters, the compiler cannot tell which one you mean. That is a naming collision.' },
        { p: "A namespace is a named region that keeps its names apart from everyone else's. Put each Kate in her own namespace and say which one you want with `::`." },
        { code: cpp`#include <iostream>

namespace marvel {
  int gadgets() { return 12; }   // trick arrows
}

namespace dc {
  int gadgets() { return 8; }    // batarangs
}

int main() {
  std::cout << marvel::gadgets() << '\n';
  std::cout << dc::gadgets() << '\n';
  return 0;
}` },
        { p: 'This is what `std::` has meant all along. `cout` lives in a namespace called `std`, short for standard, so its name can never clash with one of yours.' },
        { tip: 'Older tutorials use `using namespace std;`. It removes that protection, so prefer writing `std::` in full.' },
      ],
      check: {
        q: 'What does the `std::` in `std::cout` tell you?',
        options: ['cout is a keyword', 'cout belongs to the namespace named std', 'cout is defined in your own program'],
        answer: 1,
        explain: 'The part before `::` names the namespace to look in. `std` is where the standard library keeps its names.',
      },
    },
    {
      id: 'c2-headers',
      title: 'Multiple files and headers',
      character: 'Barbara',
      show: 'Batman',
      refs: [
        { label: '2.8 Programs with multiple code files', url: L + 'programs-with-multiple-code-files/' },
        { label: '2.11 Header files', url: L + 'header-files/' },
        { label: '2.12 Header guards', url: L + 'header-guards/' },
      ],
      body: [
        { p: 'As Oracle, Barbara does not carry every file in her head. She keeps an index that says what exists and where to find it. Real programs are split across many files, and they need the same kind of index.' },
        { p: "Code is usually split into `.cpp` files, each holding related functions. For one file to call a function that lives in another, it needs that function's forward declaration. Copying declarations around by hand would be tedious and error-prone, so they are collected in a header file, ending in `.h`." },
        { listing: cpp`// heal.h  (the index: declarations only)
#ifndef HEAL_H
#define HEAL_H

int heal(int hp);

#endif


// heal.cpp  (the definition)
#include "heal.h"

int heal(int hp) {
  return hp + 50;
}


// main.cpp  (a user of the function)
#include "heal.h"
#include <iostream>

int main() {
  std::cout << heal(100) << '\n';
  return 0;
}` },
        { p: '`#include` pastes the contents of the header into the file before compiling. That is all `#include <iostream>` has been doing: bringing in the declarations for `std::cout` and friends. The three lines starting with `#` in the header are a header guard, which stops the same header being pasted twice.' },
        { p: 'Each `.cpp` file is compiled on its own, then a tool called the linker joins the pieces into one program. This app runs a single file at a time, so the examples here keep everything in one file.' },
      ],
      check: {
        q: 'What belongs in a header file?',
        options: ['Function definitions with full bodies', 'Forward declarations that other files need', 'The main function'],
        answer: 1,
        explain: 'A header is the index. It declares what exists so other files can use it, and the matching .cpp file holds the definitions.',
      },
    },
  ],

  challenges: [
    {
      id: 'c2-battle-cry',
      kind: 'write',
      level: 'Easy',
      title: 'Battle cry',
      character: 'Erza',
      show: 'Fairy Tail',
      lesson: 'c2-functions',
      plan: [
        "Define a void function battleCry that prints the cry.",
        "In main, call it three times.",
      ],
      prompt: 'Erza fights in bursts. Write a function called `battleCry` that prints `Requip!` on its own line, then call it three times from `main`.',
      starter: cpp`#include <iostream>

// Write battleCry here

int main() {
  // Call it three times

  return 0;
}`,
      tests: [{ name: 'Three cries', stdin: '', expected: 'Requip!\nRequip!\nRequip!' }],
      hints: [
        'The function returns nothing, so its type is `void`.',
        'Define it above `main` so the compiler has seen it before the calls.',
        'A call is the name plus parentheses and a semicolon: `battleCry();`',
      ],
      solution: cpp`#include <iostream>

void battleCry() {
  std::cout << "Requip!\n";
}

int main() {
  battleCry();
  battleCry();
  battleCry();
  return 0;
}`,
      explain: 'The print statement is written once and reused three times. If the cry ever changes, there is one place to edit.',
    },
    {
      id: 'c2-key-ring',
      kind: 'write',
      level: 'Easy',
      title: 'Key ring',
      character: 'Yukino',
      show: 'Fairy Tail',
      lesson: 'c2-return-values',
      plan: [
        "Define goldKeys, returning 2.",
        "Define blackKeys, returning 1.",
        "main adds the two calls and prints the total. It is already written.",
      ],
      prompt: 'Yukino carries two gold keys and one black key. `main` is already written. Add the two functions it calls: `goldKeys` returns 2 and `blackKeys` returns 1.',
      starter: cpp`#include <iostream>

// Write goldKeys and blackKeys here

int main() {
  std::cout << "Keys: " << goldKeys() + blackKeys() << '\n';
  return 0;
}`,
      tests: [{ name: 'Adds both kinds of key', stdin: '', expected: 'Keys: 3' }],
      hints: [
        'Both functions hand back a whole number, so their return type is `int`.',
        'The body is a single statement: `return 2;`',
      ],
      solution: cpp`#include <iostream>

int goldKeys() {
  return 2;
}

int blackKeys() {
  return 1;
}

int main() {
  std::cout << "Keys: " << goldKeys() + blackKeys() << '\n';
  return 0;
}`,
      explain: 'Each call is replaced by its return value, so `goldKeys() + blackKeys()` becomes 2 + 1.',
    },
    {
      id: 'c2-healing-spell',
      kind: 'write',
      level: 'Easy',
      title: 'Healing spell',
      character: 'Wendy',
      show: 'Fairy Tail',
      lesson: 'c2-parameters',
      plan: [
        "Define heal, taking the current HP as a parameter.",
        "Return the HP plus 50.",
        "main reads the HP and prints the result of heal. It is already written.",
      ],
      prompt: "Wendy's spell restores 50 HP. `main` is already written. Add the function `heal`, which takes a patient's HP and returns it with 50 added.",
      starter: cpp`#include <iostream>

// Write heal here

int main() {
  int hp{};
  std::cin >> hp;
  std::cout << "HP: " << heal(hp) << '\n';
  return 0;
}`,
      tests: [
        { name: 'Heals from 100', stdin: '100', expected: 'HP: 150' },
        { name: 'Heals from zero', stdin: '0', expected: 'HP: 50' },
        { name: 'Heals a tank', stdin: '999', expected: 'HP: 1049' },
      ],
      hints: [
        'The function takes one `int` and returns an `int`.',
        'Its first line is `int heal(int hp)`.',
        'The body can be one line: `return hp + 50;`',
      ],
      solution: cpp`#include <iostream>

int heal(int hp) {
  return hp + 50;
}

int main() {
  int hp{};
  std::cin >> hp;
  std::cout << "HP: " << heal(hp) << '\n';
  return 0;
}`,
      explain: "The `hp` inside `heal` is a separate variable from the `hp` in `main`. It receives a copy of the argument, and the result travels back through `return`.",
    },
    {
      id: 'c2-resupply-bug',
      kind: 'bughunt',
      level: 'Medium',
      title: 'Resupply',
      character: 'Mikasa',
      show: 'Attack on Titan',
      lesson: 'c2-parameters',
      prompt: 'Mikasa picks up four fresh blades at the supply point, but the count never goes up. The `resupply` function is correct. The bug is in how `main` uses it.',
      starter: cpp`#include <iostream>

int resupply(int blades) {
  return blades + 4;
}

int main() {
  int blades{};
  std::cin >> blades;
  resupply(blades);
  std::cout << "Blades: " << blades << '\n';
  return 0;
}`,
      tests: [
        { name: 'Two blades left', stdin: '2', expected: 'Blades: 6' },
        { name: 'Completely out', stdin: '0', expected: 'Blades: 4' },
        { name: 'Well stocked', stdin: '8', expected: 'Blades: 12' },
      ],
      hints: [
        'The function receives a copy of `blades`. Does anything in `main` change the original?',
        'The value `resupply` returns is being thrown away.',
        'Store it: `blades = resupply(blades);`',
      ],
      solution: cpp`#include <iostream>

int resupply(int blades) {
  return blades + 4;
}

int main() {
  int blades{};
  std::cin >> blades;
  blades = resupply(blades);
  std::cout << "Blades: " << blades << '\n';
  return 0;
}`,
      explain: "Arguments are copied, so a function cannot change the caller's variable just by being called. The new value comes back as the return value, and the caller has to do something with it.",
    },
    {
      id: 'c2-nail-count',
      kind: 'write',
      level: 'Easy',
      title: 'Nail count',
      character: 'Nobara',
      show: 'Jujutsu Kaisen',
      lesson: 'c2-parameters',
      scaffold: 'blank',
      plan: [
        "Define nailsNeeded with two int parameters: the curses and the nails per curse.",
        "Return curses times nails per curse.",
        "In main, read the two numbers.",
        "Print \"Nails: \" followed by the result of calling nailsNeeded.",
      ],
      prompt: 'Nobara plans her nails before a mission. Write a function `nailsNeeded` that takes the number of curses and the nails per curse, and returns how many nails to pack. Then write `main`: read the two numbers and print the result in the format shown. This one starts from an empty file.',
      starter: '',
      tests: [
        { name: '3 curses, 4 nails each', stdin: '3 4', expected: 'Nails: 12' },
        { name: 'A quiet night', stdin: '0 9', expected: 'Nails: 0' },
        { name: 'One nail each', stdin: '7 1', expected: 'Nails: 7' },
      ],
      hints: [
        'Two parameters are separated by a comma, and each needs its own type.',
        'The first line is `int nailsNeeded(int curses, int perCurse)`.',
      ],
      solution: cpp`#include <iostream>

int nailsNeeded(int curses, int perCurse) {
  return curses * perCurse;
}

int main() {
  int curses{};
  int perCurse{};
  std::cin >> curses >> perCurse;
  std::cout << "Nails: " << nailsNeeded(curses, perCurse) << '\n';
  return 0;
}`,
      explain: 'Arguments are matched to parameters by position: the first argument goes to the first parameter, the second to the second.',
    },
    {
      id: 'c2-cover-story',
      kind: 'predict',
      level: 'Medium',
      title: 'Cover story',
      character: 'Yor',
      show: 'Spy x Family',
      lesson: 'c2-local-scope',
      prompt: "Both functions use a variable called `x`. Read the code without running it. What does it print?",
      code: cpp`#include <iostream>

int addOne(int x) {
  x = x + 1;
  return x;
}

int main() {
  int x{ 5 };
  addOne(x);
  std::cout << x << '\n';
  return 0;
}`,
      options: ['5', '6', '7', 'It does not compile'],
      answer: 0,
      explain: "The `x` in `addOne` is a different variable that happens to share a name. It becomes 6 and is returned, but `main` ignores the return value, so main's `x` is still 5.",
    },
    {
      id: 'c2-encore-bug',
      kind: 'bughunt',
      level: 'Easy',
      title: 'Encore',
      character: 'Zatanna',
      show: 'DC',
      lesson: 'c2-forward-declarations',
      prompt: 'Zatanna gives two encores for every show. Every line here is spelled correctly, yet it will not compile. Fix it without changing what either function does.',
      starter: cpp`#include <iostream>

int main() {
  int shows{};
  std::cin >> shows;
  std::cout << "Encores: " << encore(shows) << '\n';
  return 0;
}

int encore(int shows) {
  return shows * 2;
}`,
      tests: [
        { name: 'Three shows', stdin: '3', expected: 'Encores: 6' },
        { name: 'Night off', stdin: '0', expected: 'Encores: 0' },
        { name: 'A long tour', stdin: '11', expected: 'Encores: 22' },
      ],
      hints: [
        'Read the error: which name does the compiler say it does not know?',
        'The compiler reads top to bottom. When it reaches the call in `main`, it has not seen `encore` yet.',
        'Add a forward declaration above `main`: `int encore(int shows);`',
      ],
      solution: cpp`#include <iostream>

int encore(int shows);

int main() {
  int shows{};
  std::cin >> shows;
  std::cout << "Encores: " << encore(shows) << '\n';
  return 0;
}

int encore(int shows) {
  return shows * 2;
}`,
      explain: 'A forward declaration tells the compiler the function exists before it reaches the call. Moving the whole definition above `main` works too.',
    },
    {
      id: 'c2-two-kates',
      kind: 'write',
      level: 'Easy',
      title: 'Two Kates',
      character: 'Kate Bishop and Kate Kane',
      show: 'Marvel and DC',
      lesson: 'c2-namespaces',
      plan: [
        "Print \"Bishop: \" followed by marvel::gadgets().",
        "Print \"Kane: \" followed by dc::gadgets().",
      ],
      prompt: 'Two functions share the name `gadgets`, kept apart by namespaces. Complete `main` so it prints how many gadgets each Kate carries, in the format shown.',
      starter: cpp`#include <iostream>

namespace marvel {
  int gadgets() { return 12; }
}

namespace dc {
  int gadgets() { return 8; }
}

int main() {

  return 0;
}`,
      tests: [{ name: 'Picks the right function each time', stdin: '', expected: 'Bishop: 12\nKane: 8' }],
      hints: [
        'Kate Bishop is the Marvel one. Kate Kane is the DC one.',
        'Name the namespace, then `::`, then the function: `marvel::gadgets()`',
      ],
      solution: cpp`#include <iostream>

namespace marvel {
  int gadgets() { return 12; }
}

namespace dc {
  int gadgets() { return 8; }
}

int main() {
  std::cout << "Bishop: " << marvel::gadgets() << '\n';
  std::cout << "Kane: " << dc::gadgets() << '\n';
  return 0;
}`,
      explain: 'Calling plain `gadgets()` would not compile, because no function of that name exists outside the namespaces. The prefix tells the compiler where to look.',
    },
    {
      id: 'c2-cursed-tools',
      kind: 'predict',
      level: 'Easy',
      title: 'Cursed tools',
      character: 'Maki',
      show: 'Jujutsu Kaisen',
      lesson: 'c2-return-values',
      prompt: 'Maki is weighing up two cursed tools. What does this print?',
      code: cpp`#include <iostream>

int square(int n) {
  return n * n;
}

int main() {
  std::cout << square(3) + square(2) << '\n';
  return 0;
}`,
      options: ['10', '13', '25', '36'],
      answer: 1,
      explain: '`square(3)` is 9 and `square(2)` is 4. Each call is worked out first, then the two results are added.',
    },
    {
      id: 'c2-combo',
      kind: 'write',
      level: 'Medium',
      title: 'Kick combo',
      character: 'Mirko',
      show: 'My Hero Academia',
      lesson: 'c2-parameters',
      scaffold: 'blank',
      plan: [
        "Define doubleIt: return n times 2.",
        "Define combo: return doubleIt(kicks) plus 1.",
        "In main, read the number of kicks.",
        "Print \"Combo: \" followed by combo(kicks).",
      ],
      prompt: "Mirko's combo is double her kicks, plus one finishing blow. Write `doubleIt`, which returns a number times two, and `combo`, which calls `doubleIt` and adds the finishing blow. Then write `main`: read the number of kicks and print the combo in the format shown. This one starts from an empty file.",
      starter: '',
      tests: [
        { name: 'Three kicks', stdin: '3', expected: 'Combo: 7' },
        { name: 'Finisher only', stdin: '0', expected: 'Combo: 1' },
        { name: 'Ten kicks', stdin: '10', expected: 'Combo: 21' },
      ],
      hints: [
        'A function can call another function.',
        'Inside `combo`, the doubled value is `doubleIt(kicks)`.',
        'The body is `return doubleIt(kicks) + 1;`',
      ],
      solution: cpp`#include <iostream>

int doubleIt(int n) {
  return n * 2;
}

int combo(int kicks) {
  return doubleIt(kicks) + 1;
}

int main() {
  int kicks{};
  std::cin >> kicks;
  std::cout << "Combo: " << combo(kicks) << '\n';
  return 0;
}`,
      explain: 'Small functions that call other small functions are how large programs are built. Each one does a single job and has a name that says what it is.',
    },
    {
      id: 'c2-fuel-bug',
      kind: 'bughunt',
      level: 'Medium',
      title: 'Fuel gauge',
      character: 'Bulma',
      show: 'Dragon Ball',
      lesson: 'c2-parameters',
      prompt: "Bulma's ship reports negative fuel. The program reads the tank size and the fuel used, and should print what is left. The `remaining` function is correct. Find the bug.",
      starter: cpp`#include <iostream>

int remaining(int total, int used) {
  return total - used;
}

int main() {
  int total{};
  int used{};
  std::cin >> total >> used;
  std::cout << "Fuel left: " << remaining(used, total) << '\n';
  return 0;
}`,
      tests: [
        { name: '100 in the tank, 30 used', stdin: '100 30', expected: 'Fuel left: 70' },
        { name: 'A short hop', stdin: '9 4', expected: 'Fuel left: 5' },
        { name: 'Running on empty', stdin: '50 50', expected: 'Fuel left: 0' },
      ],
      hints: [
        'Trace the call with 100 and 30. Which value lands in which parameter?',
        'Arguments are matched by position, not by name.',
        'The call has its arguments the wrong way round.',
      ],
      solution: cpp`#include <iostream>

int remaining(int total, int used) {
  return total - used;
}

int main() {
  int total{};
  int used{};
  std::cin >> total >> used;
  std::cout << "Fuel left: " << remaining(total, used) << '\n';
  return 0;
}`,
      explain: 'The compiler cannot catch swapped arguments when both are the same type. Notice that the third test passed even with the bug, which is why one passing test proves very little.',
    },
    {
      id: 'c2-job-payout',
      kind: 'project',
      level: 'Project',
      title: 'Job payout calculator',
      character: 'Lucy',
      show: 'Fairy Tail',
      lesson: 'c2-parameters',
      plan: [
        "netReward: the reward minus the damage.",
        "shareEach: the net divided by the members.",
        "leftOver: the net minus shareEach times the members.",
        "main: read the three numbers, store the net, print the three lines.",
      ],
      prompt: "Lucy's team finished a job, and wrecked half the town doing it, as usual. Build a payout calculator so she knows what she is taking home. The program reads three whole numbers: the reward, the number of team members, and the cost of the damage.",
      steps: [
        'Write `int netReward(int reward, int damage)`. It returns the reward after the damage is paid for.',
        "Write `int shareEach(int net, int members)`. It returns each member's equal share. Integer division is exactly what you want here.",
        'Write `int leftOver(int net, int members)`. It returns what remains after the equal shares are handed out. Call `shareEach` inside it.',
        'In `main`, read the three numbers, call your functions, and print three lines in the format shown.',
      ],
      starter: cpp`#include <iostream>

// 1. netReward

// 2. shareEach

// 3. leftOver

int main() {
  int reward{};
  int members{};
  int damage{};
  std::cin >> reward >> members >> damage;

  // 4. Call your functions and print the three lines

  return 0;
}`,
      tests: [
        { name: 'An even split', stdin: '70000 4 10000', expected: 'Net reward: 60000\nShare each: 15000\nLeft over: 0' },
        { name: 'No damage, uneven split', stdin: '100 3 0', expected: 'Net reward: 100\nShare each: 33\nLeft over: 1' },
        { name: 'Seven members', stdin: '1000 7 1', expected: 'Net reward: 999\nShare each: 142\nLeft over: 5' },
      ],
      hints: [
        'Build and test one function at a time. Print its result from `main` and press Run before moving on.',
        'Store the net reward in a variable in `main`, because the next two functions both need it: `int net{ netReward(reward, damage) };`',
        'What is left over is the net minus everything that was handed out: `net - shareEach(net, members) * members`.',
      ],
      solution: cpp`#include <iostream>

int netReward(int reward, int damage) {
  return reward - damage;
}

int shareEach(int net, int members) {
  return net / members;
}

int leftOver(int net, int members) {
  return net - shareEach(net, members) * members;
}

int main() {
  int reward{};
  int members{};
  int damage{};
  std::cin >> reward >> members >> damage;

  int net{ netReward(reward, damage) };
  std::cout << "Net reward: " << net << '\n';
  std::cout << "Share each: " << shareEach(net, members) << '\n';
  std::cout << "Left over: " << leftOver(net, members) << '\n';
  return 0;
}`,
      explain: 'Each function does one small job and can be checked on its own, and `leftOver` reuses `shareEach` so the sharing rule lives in one place. Splitting a problem like this is the core skill the rest of programming builds on.',
    },
  ],

  drills: [
    {
      id: 'd-void-fn',
      pattern: 'A function that does a job',
      title: 'Say it twice',
      lesson: 'c2-functions',
      prompt: 'Write a `void` function called `greet` that prints `Hi` on its own line. Call it twice from `main`.',
      tests: [{ name: 'Two greetings', stdin: '', expected: 'Hi\nHi' }],
      mustMatch: [{ re: /void\s+greet\s*\(\s*\)/, msg: 'Define the function as `void greet()`.' }],
      hint: 'Define `greet` above `main`, then call it with `greet();`',
      solution: cpp`#include <iostream>

void greet() {
  std::cout << "Hi\n";
}

int main() {
  greet();
  greet();
  return 0;
}`,
    },
    {
      id: 'd-return-fn',
      pattern: 'A function that returns a value',
      title: 'Lucky seven',
      lesson: 'c2-return-values',
      prompt: 'Write `int seven()`, which returns 7. In `main`, print `seven() * 2`.',
      tests: [{ name: 'Prints 14', stdin: '', expected: '14' }],
      mustMatch: [{ re: /int\s+seven\s*\(\s*\)/, msg: 'Define the function as `int seven()`.' }],
      hint: 'The body is one line: `return 7;`',
      solution: cpp`#include <iostream>

int seven() {
  return 7;
}

int main() {
  std::cout << seven() * 2 << '\n';
  return 0;
}`,
    },
    {
      id: 'd-param-fn',
      pattern: 'A function with a parameter',
      title: 'Triple',
      lesson: 'c2-parameters',
      prompt: 'Write `int triple(int n)`. Read a number and print its triple using the function.',
      tests: [
        { name: 'Triple 4', stdin: '4', expected: '12' },
        { name: 'Triple 0', stdin: '0', expected: '0' },
      ],
      mustMatch: [{ re: /int\s+triple\s*\(\s*int\s+\w+\s*\)/, msg: 'Define the function as `int triple(int n)`.' }],
      hint: 'Inside the function, `return n * 3;`. In `main`, print `triple(x)`.',
      solution: cpp`#include <iostream>

int triple(int n) {
  return n * 3;
}

int main() {
  int x{};
  std::cin >> x;
  std::cout << triple(x) << '\n';
  return 0;
}`,
    },
    {
      id: 'd-two-params',
      pattern: 'A function with two parameters',
      title: 'Area',
      lesson: 'c2-parameters',
      prompt: 'Write `int area(int width, int height)`. Read a width and a height, then print the area using the function.',
      tests: [
        { name: '3 by 5', stdin: '3 5', expected: '15' },
        { name: 'A line', stdin: '7 1', expected: '7' },
      ],
      mustMatch: [{ re: /int\s+area\s*\(\s*int\s+\w+\s*,\s*int\s+\w+\s*\)/, msg: 'Define the function as `int area(int width, int height)`.' }],
      hint: 'Two parameters are separated by a comma, each with its own type.',
      solution: cpp`#include <iostream>

int area(int width, int height) {
  return width * height;
}

int main() {
  int w{};
  int h{};
  std::cin >> w >> h;
  std::cout << area(w, h) << '\n';
  return 0;
}`,
    },
    {
      id: 'd-fn-calls-fn',
      pattern: 'A function that uses another function',
      title: 'Sum of squares',
      lesson: 'c2-parameters',
      prompt: 'Write `int square(int n)` and `int sumOfSquares(int a, int b)`, which calls `square`. Read two numbers and print the sum of their squares.',
      tests: [
        { name: '3 and 4', stdin: '3 4', expected: '25' },
        { name: '1 and 0', stdin: '1 0', expected: '1' },
      ],
      mustMatch: [{ re: /int\s+sumOfSquares\s*\([^)]*\)\s*\{[^}]*square\s*\(/, msg: '`sumOfSquares` should call `square` rather than multiplying directly.' }],
      hint: '`square` must be defined above `sumOfSquares`, which returns `square(a) + square(b)`.',
      solution: cpp`#include <iostream>

int square(int n) {
  return n * n;
}

int sumOfSquares(int a, int b) {
  return square(a) + square(b);
}

int main() {
  int a{};
  int b{};
  std::cin >> a >> b;
  std::cout << sumOfSquares(a, b) << '\n';
  return 0;
}`,
    },
    {
      id: 'd-forward',
      pattern: 'Forward declaration',
      title: 'Main comes first',
      lesson: 'c2-forward-declarations',
      prompt: 'Write `main` first, and define `int half(int n)` below it. Read a number and print half of it.',
      tests: [
        { name: 'Half of 10', stdin: '10', expected: '5' },
        { name: 'Half of 9', stdin: '9', expected: '4' },
      ],
      mustMatch: [{ re: /int\s+main\s*\([\s\S]*int\s+half\s*\(\s*int\s+\w+\s*\)\s*\{/, msg: 'Define `half` below `main`, with a forward declaration above `main`.' }],
      hint: 'Above `main`, declare it: `int half(int n);`',
      solution: cpp`#include <iostream>

int half(int n);

int main() {
  int n{};
  std::cin >> n;
  std::cout << half(n) << '\n';
  return 0;
}

int half(int n) {
  return n / 2;
}`,
    },
    {
      id: 'd-namespace',
      pattern: 'Namespaces',
      title: 'Bounty',
      lesson: 'c2-namespaces',
      prompt: 'Put `int bounty()`, returning 500, inside a namespace called `pirate`. Print `pirate::bounty()` from `main`.',
      tests: [{ name: 'Prints 500', stdin: '', expected: '500' }],
      mustMatch: [
        { re: /namespace\s+pirate\b/, msg: 'Create a namespace called `pirate`.' },
        { re: /pirate\s*::\s*bounty\s*\(/, msg: 'Call the function as `pirate::bounty()`.' },
      ],
      hint: '`namespace pirate { ... }` wraps the function definition.',
      solution: cpp`#include <iostream>

namespace pirate {
  int bounty() {
    return 500;
  }
}

int main() {
  std::cout << pirate::bounty() << '\n';
  return 0;
}`,
    },
  ],
};
