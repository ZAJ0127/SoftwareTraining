// Embedded unit 1: From source code to a running device.
// The bigger picture of embedded work. Needs C++ chapters 1 and 2 only.
//
// `listing` blocks are shown but not run. Predict challenges marked
// `noVerify: true` are concept questions, with or without a code sample.

const cpp = String.raw;
const L = 'https://www.learncpp.com/cpp-tutorial/';

export default {
  num: 'M1',
  lessons: [
    {
      id: 'm1-what-is-embedded',
      title: 'What makes it embedded',
      character: 'Android 18',
      show: 'Dragon Ball',
      refs: [],
      body: [
        { p: 'Android 18 was built for a purpose, with everything she needs sealed inside and no way to plug in a keyboard. An embedded system is a computer like that: built into a product to do one job, usually with nobody watching a screen.' },
        { p: 'The computer is normally a microcontroller: a single chip holding a processor, a small amount of memory, and peripherals such as timers, input and output pins, and serial ports. The program you write for it is called firmware.' },
        { p: 'Four constraints shape almost every decision. Memory is measured in kilobytes, not gigabytes. Timing matters, because a late response can be as bad as a wrong one. Power is often a battery. And the device has to keep running for months with nobody there to restart it.' },
        { p: 'Many devices have no operating system at all. The firmware sets things up once, then repeats the same loop for as long as the power is on.' },
        { listing: cpp`int main() {
  setupHardware();        // runs once at power-on

  while (true) {          // runs until the power goes off
    readSensors();
    decide();
    updateOutputs();
  }
}` },
        { p: 'That shape, setup followed by a loop that never ends, is called a super loop. Most of what you do day to day lives inside one of those three calls, or inside an interrupt that briefly cuts in on the loop. Knowing which is the first piece of the bigger picture.' },
      ],
      check: {
        q: 'Why does embedded firmware usually avoid using more memory than it strictly needs?',
        options: ['Extra memory makes the processor run hotter', 'The chip may only have a few kilobytes, and running out means a crash with nobody there to restart it', 'The compiler refuses to build large programs'],
        answer: 1,
        explain: 'A microcontroller has a small, fixed amount of RAM and no way to get more. Running out in the field means a device that stops working.',
      },
    },
    {
      id: 'm1-cross-compiling',
      title: 'Building for another machine',
      character: 'Kallen',
      show: 'Code Geass',
      refs: [{ label: '0.5 Introduction to the compiler, linker, and libraries', url: L + 'introduction-to-the-compiler-linker-and-libraries/' }],
      body: [
        { p: "Kallen's Guren is built and tuned in a hangar, then sent out to fight somewhere else. Firmware is made the same way. You build it on your PC, called the host, and it runs on the microcontroller, called the target. The two have different processors, so the compiler has to produce machine code for a machine it is not running on. That is cross-compiling." },
        { p: 'The set of tools that does it is the toolchain, and it runs in a fixed order. The preprocessor handles `#include` and other `#` lines. The compiler turns each `.cpp` file into machine code for the target. The linker joins those pieces with library code and decides the exact address of every function and variable, following a file called the linker script.' },
        { p: 'The result is one binary file, often ending in `.elf`, `.hex` or `.bin`. It still has to get onto the chip. Flashing copies it into the chip\'s permanent memory, through a debug probe or a small program already on the chip called a bootloader.' },
        { p: 'Because the target is a different machine, some things you take for granted on a PC change. The size of an `int` is one of them.' },
        { code: cpp`#include <iostream>

int main() {
  // sizeof gives the size of a type in bytes
  std::cout << "int is " << sizeof(int) << " bytes here\n";
  return 0;
}` },
        { p: 'On the machine that runs this app, the answer is 4. On a small 8-bit microcontroller it is commonly 2, which means an `int` there cannot hold a number above 32,767. Code that works on your PC can overflow on the target. This is why embedded code uses types with the size in the name, such as `int32_t` and `uint8_t`.' },
        { tip: 'Build, flash, run are three separate steps. When a change seems to have no effect, check that the new binary really was flashed before you doubt the code.' },
      ],
      check: {
        q: 'What does the linker do?',
        options: ['Translates C++ into machine code', 'Joins the compiled pieces into one program and gives everything its final address', 'Copies the program onto the chip'],
        answer: 1,
        explain: 'The compiler translates each file. The linker combines the results and places them in memory. Flashing is the separate step that copies the result to the chip.',
      },
    },
    {
      id: 'm1-before-main',
      title: 'What happens before main',
      character: 'Asuna',
      show: 'Sword Art Online',
      refs: [],
      body: [
        { p: 'When Asuna logs in, the world has to load before she can take a single step. Your `main` function is not the first code to run either. On a PC the operating system prepares everything. On a microcontroller there is no operating system, so a small piece of startup code does the job.' },
        { p: 'When power arrives or the reset button is pressed, the processor looks at a fixed location in memory to find where to start. That entry point is the reset handler. It sets up the stack, the memory that function calls and local variables use. It gives every global variable its starting value. Then it calls `main`.' },
        { p: 'A global variable is one defined outside any function. Every function can see it, and it exists for the whole life of the program. The startup code is the reason it already holds its value when `main` begins.' },
        { code: cpp`#include <iostream>

int bootCount{ 3 };   // global: set up before main starts

int main() {
  std::cout << "bootCount is already " << bootCount << '\n';
  return 0;
}` },
        { p: 'This is why "it never even reaches main" is a real kind of embedded bug. A wrong clock setting, a bad linker script or a stack placed at the wrong address can stop the device in the startup code, before a single line you wrote has run.' },
        { tip: 'Your project almost certainly has a startup file, often named something like `startup_<chip>.s` or `crt0`. Finding it and reading the reset handler is a good half-hour investment.' },
      ],
      check: {
        q: 'On a microcontroller, what gives a global variable its starting value?',
        options: ['The first line of main', 'Startup code that runs before main', 'The debugger'],
        answer: 1,
        explain: 'The startup code copies starting values into place and clears everything else, then calls main.',
      },
    },
    {
      id: 'm1-memory-map',
      title: 'Where things live: flash and RAM',
      character: 'Nami',
      show: 'One Piece',
      refs: [],
      body: [
        { p: 'Nami can sail anywhere because she has a chart of where everything is. A microcontroller has a chart too, called the memory map. Every byte of memory has a numbered address, and the map says what lives at which addresses.' },
        { p: 'There are two main kinds of memory. Flash keeps its contents when the power is off. Your program code and constant data live there. RAM is fast to change but is wiped at power-off. Variables and the stack live there.' },
        { p: 'A third region is not memory in the usual sense. Hardware such as pins, timers and serial ports is controlled by reading and writing special addresses called registers. Writing a 1 to the right bit of the right register is how firmware turns on an LED.' },
        { listing: cpp`Flash          starts at 0x0800 0000
  program code, constants

RAM            starts at 0x2000 0000
  variables, stack

Peripherals    starts at 0x4000 0000
  registers for pins, timers, UART

(typical for an ARM Cortex-M chip)` },
        { p: 'There is usually far less RAM than flash. That is why embedded code marks unchanging data as constant, so it can stay in flash, and why deep chains of function calls are treated with care, since each call uses stack space.' },
        { tip: "Your chip's reference manual has a memory map near the front, and your project's linker script describes the same regions. Reading the two side by side connects a lot of dots." },
      ],
      check: {
        q: 'The device loses power and restarts. What has survived?',
        options: ['Everything, exactly as it was', 'The program in flash, but not the values that were in RAM', 'The values in RAM, but not the program'],
        answer: 1,
        explain: 'Flash keeps its contents without power. RAM does not, so every variable starts again from its initial value.',
      },
    },
  ],

  challenges: [
    {
      id: 'm1-main-returns',
      kind: 'predict',
      noVerify: true,
      level: 'Easy',
      title: 'No way out',
      character: 'Android 18',
      show: 'Dragon Ball',
      lesson: 'm1-what-is-embedded',
      prompt: 'This firmware runs on a microcontroller with no operating system. Why is the loop written so that `main` never returns?',
      code: cpp`int main() {
  setupHardware();

  while (true) {
    readSensors();
    updateOutputs();
  }
}`,
      options: [
        'Returning would switch the chip off',
        'There is no operating system to return to, and the device is meant to keep working as long as it has power',
        'The compiler requires every program to contain a loop',
      ],
      answer: 1,
      explain: 'On a PC, returning from main hands control back to the operating system. Here there is nothing to hand back to, and a thermostat that finished its program after one reading would be useless.',
    },
    {
      id: 'm1-toolchain-order',
      kind: 'predict',
      noVerify: true,
      level: 'Easy',
      title: 'Hangar checklist',
      character: 'Kallen',
      show: 'Code Geass',
      lesson: 'm1-cross-compiling',
      prompt: 'Before the Guren launches, the build has to happen in the right order. Which order does the toolchain run in?',
      options: ['Linker, then compiler, then preprocessor', 'Preprocessor, then compiler, then linker', 'Compiler, then linker, then preprocessor'],
      answer: 1,
      explain: 'The preprocessor handles the # lines first. The compiler then translates each file to machine code. The linker runs last, joining the pieces and assigning addresses.',
    },
    {
      id: 'm1-nothing-changed',
      kind: 'predict',
      noVerify: true,
      level: 'Easy',
      title: 'Nothing changed',
      character: 'Kallen',
      show: 'Code Geass',
      lesson: 'm1-cross-compiling',
      prompt: 'You change one line, the build succeeds, and the device behaves exactly as it did before. What is the most likely reason?',
      options: ['The compiler ignored your change', 'The new binary was built but never flashed to the device', 'Flash memory wears out after one use'],
      answer: 1,
      explain: 'Building only produces a file on your PC. Until it is flashed, the chip is still running the old program. Checking this first saves a lot of wasted debugging.',
    },
    {
      id: 'm1-global-lives',
      kind: 'predict',
      level: 'Medium',
      title: 'Extra life',
      character: 'Asuna',
      show: 'Sword Art Online',
      lesson: 'm1-before-main',
      prompt: '`lives` is a global variable, so both functions use the same one. Trace it. What does this print?',
      code: cpp`#include <iostream>

int lives{ 3 };

int withBonus() {
  return lives + 1;
}

int main() {
  lives = lives - 1;
  std::cout << withBonus() << '\n';
  return 0;
}`,
      options: ['2', '3', '4', '5'],
      answer: 1,
      explain: '`lives` starts at 3 before main runs. main lowers it to 2. `withBonus` reads the same global, sees 2, and returns 3. Because any function can change a global, firmware uses them sparingly and deliberately.',
    },
    {
      id: 'm1-flash-or-ram',
      kind: 'predict',
      noVerify: true,
      level: 'Easy',
      title: 'Chart the memory',
      character: 'Nami',
      show: 'One Piece',
      lesson: 'm1-memory-map',
      prompt: 'A counter changes while the firmware runs. A fixed error message never changes. Where does each normally live?',
      options: ['Both in flash', 'The counter in RAM, the message in flash', 'The counter in flash, the message in RAM'],
      answer: 1,
      explain: 'Anything that changes at run time has to be in RAM. Data that never changes can stay in flash, which leaves scarce RAM free.',
    },
    {
      id: 'm1-sensor-scale-bug',
      kind: 'bughunt',
      level: 'Medium',
      title: 'Dead sensor',
      character: 'Bulma',
      show: 'Dragon Ball',
      lesson: 'm1-cross-compiling',
      prompt: "Bulma's new radar reads a sensor as a raw number from 0 to 1023, where 1023 means 5000 millivolts. The function should convert a raw reading to millivolts using whole numbers only, since small chips often cannot do fractions cheaply. It reports 0 for almost every reading. Fix it.",
      starter: cpp`#include <iostream>

int toMillivolts(int raw) {
  return raw / 1023 * 5000;
}

int main() {
  int raw{};
  std::cin >> raw;
  std::cout << toMillivolts(raw) << " mV\n";
  return 0;
}`,
      tests: [
        { name: 'Full scale', stdin: '1023', expected: '5000 mV' },
        { name: 'Zero', stdin: '0', expected: '0 mV' },
        { name: 'Half scale', stdin: '512', expected: '2502 mV' },
        { name: 'A low reading', stdin: '100', expected: '488 mV' },
      ],
      hints: [
        'Trace it with 512. What is 512 / 1023 when both are whole numbers?',
        'Integer division throws away the fraction, so the result is 0 before the multiplication happens.',
        'Multiply first, then divide: `raw * 5000 / 1023`',
      ],
      solution: cpp`#include <iostream>

int toMillivolts(int raw) {
  return raw * 5000 / 1023;
}

int main() {
  int raw{};
  std::cin >> raw;
  std::cout << toMillivolts(raw) << " mV\n";
  return 0;
}`,
      explain: 'With whole numbers, the order of operations decides how much precision you keep: multiply first, divide last. The catch is that `raw * 5000` can reach about 5 million, which fits a 4-byte int but would overflow a 2-byte int on a small chip. Scaling sensor readings like this is everyday embedded work, and a common interview question.',
    },
  ],
};
