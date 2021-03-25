---
layout: post
title:  "Jekyll Cheat Sheet"
date:   2021-03-17 18:15:13 +0000
categories: jekyll cheatsheet
summary: Where I stuff everything I learned about Jekyll in the early days of this blog, in an attempt to make it pass as good documentation practice.

---

### Welcome to Jekyll

You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run `jekyll serve`, which launches a web server and auto-regenerates your site when a file is updated.

Jekyll requires blog post files to be named according to the following format:

`YEAR-MONTH-DAY-title.MARKUP`

Where `YEAR` is a four-digit number, `MONTH` and `DAY` are both two-digit numbers, and `MARKUP` is the file extension representing the format used in the file. After that, include the necessary front matter. Take a look at the source for this post to get an idea about how it works.

Jekyll also offers powerful support for code snippets:

{% highlight ruby %}
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
{% endhighlight %}

Check out the [Jekyll docs][jekyll-docs] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll Talk][jekyll-talk].

[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/


### Front matter
Jekyll uses [YAML](https://yaml.org/) to set up a bunch of variables relevant to rendering the page. Pre-defined variables that you can fill out include `layout`, `permalink` and `published`. You can access the content of any variable `var` in the page content using `page.var`.

* `layout`: tells Jekyll which layout file to use (don't use the file extension). Layout files are placed in the _layout folder.
* `permalink`: use this as an override for the url created by Jekyll for this specific page or post.
* `published`: Set to false if you don’t want a specific post to show up when the site is generated (you can still render the on a local build by using the `--unpublished` switch).

More info in [Jekyll's documentation about Front Matter](https://jekyllrb.com/docs/front-matter/).

### Test changes locally
For that, simply open a bash in the folder where the site content is, and type `bundle exec jekyll serve`. By default the website will be built and will run on http://localhost:4000 .

### Jekyll posts and pages
Posts and pages are the basic building blocks of a Jekyll website. To find more infos about Jekyll pages, go [here](https://jekyllrb.com/docs/pages/). To find more info about Jekyll posts (especially about tags and categories), go [here](https://jekyllrb.com/docs/posts/).

* Posts: Use the `post_url` tag to link to other posts without having to worry about the URLs breaking when the site permalink style changes.
* To write drafts, make a folder called _drafts/ in which you can store the early versions of the articles that you don't want to publish yet. You can build the site locally with the drafts using the `--drafts` switch.
* To include images, downloads, or other digital assets along with your text content, create a folder in the root of the project directory called assets, into which any images, files or other resources are placed. Then, from within any post, they can be linked to using the site’s root as the path for the asset to include, like:
`![My helpful screenshot](/assets/droids.jpg)` ![My helpful screenshot](/assets/droids.jpg)

* You can also link to PDFs like this: `You can [get the PDF](/assets/article.pdf) directly.` You can [get the PDF](/assets/article.pdf) directly.

### To use [particles.js](https://vincentgarreau.com/particles.js/)

Get the minima theme .css stylesheets from the Ruby install folder and copy/paste them in the _includes, _layouts, assets and _sass folder. They will override the original ones. Then, append these lines to `layouts/_layout.css`:

{% highlight css %}
#particles-js{
  height: 300px;
  background: #f00;}
{% endhighlight %}
Courtesy of [ref](https://www.youtube.com/watch?v=cUzihD4JBQU).

I decided to add the snippet in the header of my website. To do this I pasted the .js files in a `js` folder as is custom, but it proves difficult to reference the root folder in Jekyll (using `src="/js/particles.js"` from the `/about` page for example returns `ERROR: "about/js/particles.js" does not exist`). So using this syntax: \{\{ "/js/particles.js" \| relative_url \}\} does the trick. It always points to `/js/particles.js` and allows the snippet to be included in the header no matter the URL in the website. Elements of explanation of why this works are given [here](https://jekyllrb.com/docs/liquid/filters/).

### To include p5.js sketches

In the sketch.js file, the function setup has to be updated with:

{% highlight js %}
function setup() {
  // [...]
  const canvas = createCanvas(640, 360);
  canvas.parent('sketch-holder');
  canvas.addClass('p5-animation');
  // [...]
}
{% endhighlight %}

`canvas.parent('sketch-holder')` allows you to access the parent element of the p5 sketch in a consistent fashion to style it in your .css files.

`canvas.addClass('p5-animation')` allows you to access the canvas itself in a consistent fashion to style it in your .css files. Using the `.class()` function instead results in the visibility attribute being [set to hidden](https://github.com/processing/p5.js/issues/1283) in some browsers.



<div id="sketch-holder" style="text-align: center;"></div>
<script src="{{"p5/libraries/p5.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"p5/libraries/p5.dom.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"p5/libraries/p5.sound.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"p5/sketch.js" | relative_url}}" type="text/javascript"></script>

{% highlight html %}
<div id="sketch-holder" style="text-align: center;"></div>
<script src="{{"p5/libraries/p5.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"p5/libraries/p5.dom.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"p5/libraries/p5.sound.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"p5/sketch.js" | relative_url}}" type="text/javascript"></script>
{% endhighlight %}

Courtesy of [ref](https://stackoverflow.com/questions/53267193/p5js-with-jekyll)

### To customize the minima themes

Using [this](https://simonkjohnston.life/code/2019/12/20/Minima-Typography.html) I changed the police and the color scheme of the Minima theme. In the `assets/` folder, modifying the `main.scss` file as follows:

{% highlight css %}


$background-color: #003049; /* a dark, off-black for the bg */
$text-color: #e6e6e6; /* an off-white for the text */
[...]

$base-font-family: "Fira Sans", sans-serif !default;
$base-font-size:   16px !default;
[...]

@import "minima";

{% endhighlight %}

The modifications brought to the `main.scss` file will override the default values for these variables and allow us to customize at will without having to modify the actual `_sass/minima.scss` file where safe defaults are stored.

I also found out that using the `>` sign in Markdown references the blockquote tag, so modifying the style for the blockquote tag in your `.css` files will update the aspect of any quote you write using `>`.

> Je ne regarderai ni l'or du soir qui tombe <br> Ni les voiles au loin descendant vers Harfleur

More tools for blogging with Jekyll can be found in this [series of posts](http://andybrandt531.com/2015/03/markdown-for-bloggers-part-1/) from Frugal Guidance 2.

### Minimal Mistakes

This [open-source Jekyll theme](https://mmistakes.github.io/minimal-mistakes/) from [Michael Rose](https://mademistakes.com/) seems to be absolutely great. Maybe once I feel comfortable enough with Jekyll and I'll want a clean start I'll re-build this site using it.

### Write equations

Using [Huanwei Wang](http://zjuwhw.github.io/2017/06/04/MathJax.html) very nice and concise explanation based on [Wendell Smith](http://blog.lostinmyterminal.com/webpages/2015/01/09/math-support-in-jekyll.html) post about how to include equations in Jekyll.

<code> $$\int e^{-kx} \, dx = -\frac{1}{k} e^{-kx}$$  </code>

becomes:

$$\int e^{-kx} \, dx = -\frac{1}{k} e^{-kx}$$
