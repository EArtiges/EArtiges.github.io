---
layout: post
title:  "Jekyll Cheat Sheet"
date:   2021-03-17 18:15:13 +0000
categories: jekyll cheatsheet
---
### Test changes locally
For that, simply open a bash in the folder where the site content is, and type `bunde exec jekyll serve`. By default the website will be built and will run on http://localhost:4000 .

### Jekyll posts and pages
Posts and pages are the basic building blocks of a Jekyll website. To find more infos about Jekyll pages, go [here](https://jekyllrb.com/docs/pages/). To find more info about Jekyll posts, go [here](https://jekyllrb.com/docs/posts/).

* Posts: Use the `post_url` tag to link to other posts without having to worry about the URLs breaking when the site permalink style changes.

### Use Assets
To include images, downloads, or other digital assets along with your text content, create a folder in the root of the project directory called assets, into which any images, files or other resources are placed. Then, from within any post, they can be linked to using the site’s root as the path for the asset to include, like:
`![My helpful screenshot](/assets/droids.jpg)`

![My helpful screenshot](/assets/droids.jpg)

[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/
