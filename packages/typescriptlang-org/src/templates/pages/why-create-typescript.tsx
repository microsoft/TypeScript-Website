import * as React from "react"
import { Layout } from "../../components/layout"
import { Intl } from "../../components/Intl"

import { createIntlLink } from "../../components/IntlLink"

type Props = {
        pageContext: any
}

const Index: React.FC<Props> = (props) => {
        const Link = createIntlLink(props.pageContext.lang)

        return <Layout title="Why does TypeScript exist?" description="" lang={props.pageContext.lang}>
                <div className="main-content-block" style={{ textAlign: "center" }}>
                        <p>TypeScript is a language from Microsoft which builds on JavaScript.<br />This post is a non-technical overview of what JavaScript is, how TypeScript extends JavaScript and what problems it solves.</p>
                </div>

                <div className="raised main-content-block">
                        <article>

                                <h2>What is JavaScript?</h2>

                                <p>Because TypeScript extends JavaScript, this makes it a good starting point. JavaScript is commonly used to create websites. When building a website,
                                you work with three languages: HTML, CSS and JavaScript (JS). Broadly speaking: HTML defines the
                                content which will appear on the page, CSS defines the visual style of the page, and JS defines the interactive
        behaviors of the page.</p>

                                <p>We describe having these sets of skills as being a "front-end" developer. You use three
                                languages to create pages inside a web browser like Safari, Firefox, Edge or Chrome. Given how popular the web
        is for commerce and information sharing, there is a massive demand for people who are good at using these three languages.</p>

                                <p>Related to the role of being a "front-end" developer is the set of skills for the "back-end" developers, which
                                are to create computer services that communicate either to a web browser (by passing it HTML/CSS/JS) or to another
                                service (by sending data more directly.)

        You don't need to use HTML, CSS or JS to write this type of code, but it's usually an end-product of your work because it is likely to be presented in a web browser.</p>

                                <h3>What do Programming Languages do?</h3>

                                <p>Programming languages are a way for humans and computers to communicate. People read code many, many multiples of times more than
                                they write it - so developers create programming languages which are good at solving particular problems with a small amount of
code. Here's an example using JavaScript:</p>

                                <pre><code>{`
var name = "Danger"
console.log("Hello, " + name)
          `.trim()}</code></pre>

                                <p>The first line makes a variable (effectively a box you can store other things in) and then the second line outputs text to the
console (for example DOS, or the terminal) <code>"Hello, Danger"</code>.</p>

                                <p>JavaScript is designed to work as a scripting language, which means the code starts at the top of the file and then goes through line by line downwards running that code. To provide some contrast,
                                here is the same behavior in Java, which is built with different
language constraints:</p>

                                <pre><code>{`
class Main {
  public static void main(String[] args) {
    String name = "Danger";
    System.out.println("Hello, " + name);
  }
}
`.trim()}</code></pre>

                                <p>These two code samples do the same thing, however the Java version comes with a lot of words that aren't necessarily about
telling the computer exactly what to do, e.g. <code>class Main &#123;</code>, <code>public static void main(String[] args) &#123;</code>, and two extra <code>&rbrace;</code>s.
          It also has semi-colons at the end of some lines. Neither of these programming languages are wrong, Java however, is aimed at building different things from JavaScript, and these extra bits of code make sense within the constraints of building a Java app.</p>

                                <p>To get to the key point though, there is one standout line I'd like us to compare:</p>
                                <pre><code>{`
// JavaScript
var name = "Danger"

// Java
String name = "Danger";
        `.trim()}</code></pre>


                                <p>Both of these lines declare variables called <code>name</code> which contain the value <code>"Danger"</code>.</p>

                                <p>In JavaScript you use the abbreviation <code>var</code> to declare a variable. Meanwhile, in Java you need to say <em>what kind
of data</em> the variable contains. In this case the variable contains a <code>String</code>. (A string is a programming term for
a collection of characters. They <code>"look like this"</code>. This <a href="https://www.youtube.com/watch?v=czTWbdwbt7E">5m video</a> is a good primer if you want to learn more.)</p>

                                <p>Both of these variables contain a string, but the difference is that in Java the variable can <em>only</em> ever contain a <em>string</em>, because that's what we said when we created the variable. In JS, the variable can change to be <em>anything</em>,
like a number, or a list of dates.</p>

                                <p>To illustrate:</p>

                                <pre><code>{`
// Before in JS
var name = "Danger"
// Also OK
var name = 1
var name = false
var name = ["2018-02-03", "2019-01-12"]

// Before in Java
String name = "Danger";
// Not OK, the code wouldn't be accepted by Java
String name = 1;
String name = false
String name = new String[]{"2018-02-03", "2019-01-12"};
        `.trim()}</code></pre>


                                <p>These trade-offs make sense in the context for which these languages were built back in 1995. JavaScript was
                                originally designed to be a small programming language which handled simple interactions on websites. Java on the
        other hand was built specifically to make complex apps which could run on any computer. They expected to be used to build codebases of different scales, so the language required programmers write different types of code.</p>

                                <p>Java required programmers to be more explicit with the values of their variables because the programs they expected
people to build were more complex. While JavaScript opted for ease of reading by omitting information about the specifics, and expected codebases to be significantly smaller.</p>

                                <h3>What is TypeScript?</h3>

                                <p>TypeScript is a programming language - it contains all of JavaScript, and then a bit more. Using our example above,
let's compare the scripts for "Hello, Danger" in JavaScript vs TypeScript:</p>


                                <pre><code>{`
// JavaScript
var name = "Danger"
console.log("Hello, " + name)

// TypeScript
var name = "Danger"
console.log("Hello, " + name)

// Yep, you're not missing something, there's no difference
`.trim()}</code></pre>

                                <p>Due to TypeScript's goal of only <em>extending</em> JavaScript, the existing JavaScript code we saw works as TypeScript.
        The extensions which TypeScript adds to JavaScript are intended to help you be more explicit about what kinds of data are
used in your code, a bit like Java.</p>
                                <p>Here is the same sample, but using TypeScript to be more explicit about what the variable is:</p>

                                <pre><code>{`
var name: string = "Danger"
console.log("Hello, " + name)
`.trim()}</code></pre>

                                <p>This extra <code>: string</code> allow the reader to be certain that <code>name</code> will only be a string. Annotating your variables
in this way also gives TypeScript the chance to verify that these match. This is <em>very</em> useful, because keeping track of changes
like the type of value in a variable seems easy when it's one or two, but once it starts hitting the hundreds,
that's a lot to keep track of. Writing types help programmers be more confident about their code because types catch
mistakes.</p>

                                <p>Simply speaking, we call these annotations "Types". Hence the name <i>Type</i>Script. One of the tag-lines for TypeScript
        is "JavaScript which scales" which is a statement that these extra type annotations allows you to work on bigger
        projects. This is because you can verify up-front how correct your code is. This means you have less need to
understand how every change affects the rest of the program.</p>

                                <p>In the 90s, and maybe until a 5-10 years ago the trade-off for not having types in your JavaScript application was
                                fine because the size and complexities of the programs being built were constrained to just the front-end of
        websites. Today though, JavaScript is being used almost everywhere, to build almost anything which runs on a computer. A large amount of mobile and desktop apps use JavaScript and web technology under the hood.</p>

                                <p>These are all considerably more complicated to build and understand, adding types drastically reduces the complexity of making improvements to those programs.</p>

                                <h3>What Problems Can TypeScript Solve?</h3>

                                <p>Typically, the need to ensure there are no bugs in your code can be handled by writing automated tests, then by manually verifying that the code works as you expect and finally having another person validate that it seems correct.</p>

                                <p>Not many companies are the size of Microsoft, however a lot of all problems writing JavaScript in large codebases are the same. Many JavaScript apps build apps which are made up of hundreds of thousands of files. A single change
                                to one individual file can affect the behaviour of any number of other files, like throwing a pebble into a pond
and causing ripples to spread out to the bank.</p>

                                <p>Validating the connections between every part of your project can get time consuming quickly, using a type-checked language like TypeScript can handle that automatically and provide instant feedback during development.</p>

                                <p>These features allows TypeScript to help developers feel more confident in their code, and save considerable amounts time in validating that they have not accidentally broken the project.</p>
                        </article>
                </div>

        </Layout>
}

export default (props: Props) => <Intl locale={props.pageContext.lang}><Index {...props} /></Intl>
