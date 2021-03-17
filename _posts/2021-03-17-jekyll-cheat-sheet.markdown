---
layout: post
title:  "Jekyll Cheat Sheet"
date:   2021-03-17 18:15:13 +0000
categories: jekyll cheatsheet
---
### Front matter
Jekyll uses [YAML](https://yaml.org/) to set up a bunch of variables relevant to rendering the page. Pre-defined variables that you can fill out include `layout`, `permalink` and `published`. You can access the content of any variable `var` in the page content using `page.var`.

* `layout`: tells Jekyll which layout file to use (don't use the file extension). Layout files are placed in the _layout folder.
* `permalink`: use this as an override for the url created by Jekyll for this specific page or post.
* `published`: Set to false if you don’t want a specific post to show up when the site is generated (you can still render the on a local build by using the `--unpublished` switch).

More info in [Jekyll's documentation about Front Matter](https://jekyllrb.com/docs/front-matter/).

### Test changes locally
For that, simply open a bash in the folder where the site content is, and type `bunde exec jekyll serve`. By default the website will be built and will run on http://localhost:4000 .

### Jekyll posts and pages
Posts and pages are the basic building blocks of a Jekyll website. To find more infos about Jekyll pages, go [here](https://jekyllrb.com/docs/pages/). To find more info about Jekyll posts (especially about tags and categories), go [here](https://jekyllrb.com/docs/posts/).

* Posts: Use the `post_url` tag to link to other posts without having to worry about the URLs breaking when the site permalink style changes.
* To write drafts, make a folder called _drafts/ in which you can store the early versions of the articles that you don't want to publish yet. You can build the site locally with the drafts using the `--drafts` switch.
* To include images, downloads, or other digital assets along with your text content, create a folder in the root of the project directory called assets, into which any images, files or other resources are placed. Then, from within any post, they can be linked to using the site’s root as the path for the asset to include, like:
`![My helpful screenshot](/assets/droids.jpg)` ![My helpful screenshot](/assets/droids.jpg)

* You can also link to PDFs like this: `You can [get the PDF](/assets/article.pdf) directly.` You can [get the PDF](/assets/article.pdf) directly.

### To use [particles.js](https://vincentgarreau.com/particles.js/)

Get the minima theme .css stylesheets from the Ruby install folder and copy/paste them in the _includes, _layouts, assets and _sass folder. They will override the original ones. Then, in the layouts/_layout.css, add these:

  {% highlight css %}
  #particles-js{
    height: 100%;
    background: #f00;
  {% endhighlight %}
Courtesy of [ref](https://www.youtube.com/watch?v=cUzihD4JBQU).


``
I decided to add the snippet in the header of my website. To do this I pasted the .js files in a `js` folder as is custom, but it proves difficult to reference the root folder in Jekyll (using `src="/js/particles.js"` from the `/about` page for example returns `ERROR: "about/js/particles.js" does not exist`). So using this syntax: \{\{ "/js/particles.js" \| relative_url \}\}  does the trick. It always points to `/js/particles.js` and allows the snippet to be included in the header no matter the URL in the website.


[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/
