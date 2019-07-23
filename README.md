Boba PrioTool
=============

> Successfully prioritizing and eliminating targets since 1980

*some famous bounty hunter*

This tool is supposed to guide you through the *difficult* process of **prioritizing an item list** by divding it into a series of **binary choices** that are *easier* to make.

It was created as client-side-only JavaScript web app in a **very** "MVP-Agile-hacky" #DesktopFirst way.
However, the tool does what it is supposed to be doing, for now :-)

Demo
----

Try it in your browser on [GitHub Pages](https://sven-ito.github.io/boba/).

Why Boba?
---------

> This tool does some kind of BubbleSort, right?

*some family member of mine*

* Apparently Boba is another name for the famous Asian beverage [bubble tea](https://en.wikipedia.org/wiki/Boba_tea).
* Boba is also the first name of some badass bounty hunter from Star Wars, [Boba Fett](https://en.wikipedia.org/wiki/Boba_Fett), hence the logo.

Testing
-------

Successfully tested on:

>  Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36

Backlog
-------

Unordered list of ideas soon to be / already implemented:

**TODO**:

- get a template engine (reduce HTML markup in JS code; existing hidden HTML code -> cloned?) - part 2
- allow multiple prio reasons per choice : 15
- allow predefined comments / prio reasons : 13
- Helpbox with advice on how to make a decision (left side, Bootstrap Affix?) : 13
- grey out buttons that can not yet be used : 12
- add Selenium tests : 10
- text hint boxes should be hidden and only appear once the step can be done : 10
- code refactoring: function Java doc comments : 8
- mobile testing : 5
- consitency check for choices : 3
- mobile optimizations : 2
- turn it into an JIRA Plugin : 2
- server side coding : 0

- error handling (advanced, for complex structures/objects + regexes)
- simplify code
- clean up code
- add unit test

**DONE**:

- progress bar : 13
- get a template engine (reduce HTML markup in JS code; existing hidden HTML code -> cloned?) - part 1
- introduce OOP : 3
- code refactoring: modularity (classes with static methods in one file) : 10
- reduce number of buttons : 10
- add more usability (key support)
- code refactoring: remove duplicate code (some) : 16
- error handling (basic): 17
- separate decision boxes with counter (e.g. "7/10")
- decision boxes with comment fields on why the decision was taken (advanced for storing/processing)
- show combination matrix
- code refactoring: turn methods into functions
- code refactoring: separate GUI logic from data / business logic
- Data persistence (DOM Storage / Cookie / Client side) : 2
- class safety
- versioning : 10
- undo buttons (indirectly) : 6
- decision boxes with comment fields on why the decision was taken (basic for printing)
- create Boba (Fett) favicon
- code refactoring: for loops
- code refactoring: console debug output
- code refactoring: variable names
- code refactoring: comments + let/const
- Helpbox with advice on how to make a decision (first content, Bootstrap Affix not yet working)
- More text that guides user : 8
- come up with a better name than Prioritizer (Bubble?) -> Bubble -> Bubble Tea -> Boba -> Boba Fett
- integrated jQuery / Bootstrap JS