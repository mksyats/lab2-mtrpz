# Lab2-mtrpz

A console program that accepts as input the path to a text file with Markdown markup and generates from it a fragment of HTML markup or ANSI escape codes (depending on the parameters). The program outputs the result to standard output (stdout) or, if there is an output file argument, to an output file. If the markup in the input file is incorrect, the program outputs the error to standard error (stderr) and terminates with a non-zero exit code
## Installation of the project

To be able to use the project, you can clone the repository to the desired folder:
```bash
git clone https://github.com/yatsenkoM/lab2-mtrpz.git /path/to/the/folder
```
**or** you can go to the desired folder and write there:
```bash
git clone https://github.com/yatsenkoM/lab2-mtrpz.git
```
**or** you can download the zip archive of this repository and extract it to the desired folder

> [!NOTE]
> For further use of the application, node.js must be installed on your device

## Using the application
_before starting use, you should go to the folder containing the "index.js" file, in this case it is the "lab2-mtrpz/src" folder_
_(but if you don't want to go to this folder, you can specify the path to the index.js file directly in the command)_

To use the program, in the console at least the following command must be written:
```bash
node src/index.js /path/to/input.md
```
In this case (without using any parameters), the text will be converted to ANSI and output to the console.

You can also add an option to output text to a file:
```bash
node index.js /path/to/input.md --out /path/to/output
```
In this case (in the absence of the format parameter, but with the output-to-file parameter present), the text will be converted to html and written to the file specified

By adding the `--format` option, you can choose what exactly you want to convert the text to. As a value for this parameter, you can specify one of the two values `html` or `ansi`.
For example, if you need to output text converted to HTML to the console, use the following command:
```bash
node src/index.js /path/to/input.md --format=html
```
Or if you want to write the converted ANSI to a file, you can use this:
```bash
node index.js /path/to/input.md --out /path/to/output --format=ansi
```

## Example:
Input text:
````
**Жовта сова** _на_ `старому дереві` відправилася на подорож. Під час **своєї_мандрівки** вона зустріла _маленького_ їжачка, який `блукав у пошуках` свого дому.

Жовта сова **вирішила допомогти** їжачкові. Вона підказала йому _найкращий_ шлях та _привела_ його до _затишної нори_ під великим дубом.
```
Після того, як їжачок знайшов **свій** дім, вони разом провели **чудовий** день, ділячись _історіями_ та пригодами.
```
Коли настав час прощання, **жовта сова** й **маленький їжачок** побажали один одному _безпечної подорожі_ та _зустрічі_ в майбутньому.
````

Output text in HTML:
````
<p><b>Жовта сова</b> <i>на</i> <tt>старому дереві</tt> відправилася на подорож. Під час <b>своєї_мандрівки</b> вона зустріла <i>маленького</i> їжачка, який <tt>блукав у пошуках</tt> свого дому.</p>
<p>Жовта сова <b>вирішила допомогти</b> їжачкові. Вона підказала йому <i>найкращий</i> шлях та <i>привела</i> його до <i>затишної нори</i> під великим дубом.
<pre>
Після того, як їжачок знайшов **свій** дім, вони разом провели **чудовий** день, ділячись _історіями_ та пригодами.
</pre>
Коли настав час прощання, <b>жовта сова</b> й <b>маленький їжачок</b> побажали один одному <i>безпечної подорожі</i> та <i>зустрічі</i> в майбутньому.</p>
````
Output text in ANSI:
![ansi](https://github.com/yatsenkoM/lab2-mtrpz/blob/main/assets/ansi_output.jpg)

## Using tests:
[The Jest testing framework](https://jestjs.io) was used for testing in this work. Therefore, first you need to install it:
```bash
npm install jest @jest/globals
```
You can then run the tests using this command:
```bash
npm run test
```
_the tests themselves are placed in the "test" directory_

- [Revert commit](https://github.com/yatsenkoM/lab1-mtrpz/commit/623ea2d3b7aca3c8e0ac65328b0cd1e02841ef2a)
- [Commit where the tests failed](https://github.com/yatsenkoM/lab2-mtrpz/commit/88ea10bd64c8a8c0ff5f48705e81d7aa50f35ca5)

## Conclusion
I really liked the use of unit tests. Without much complexity, having written them only once, later changing something in the program, you do not need to manually check a bunch of cases and spend a lot of time on it, just enter one command.
