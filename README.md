uHunt Components
================

uHunt components is a collections of widgets that makes up the [uHunt website](http://uhunt.felix-halim.net/id/339).
Each widget is a web component that consists of HTML template and Javascript bundled in an [AngularJS](http://angularjs.org/) directive.
The widgets communicate to the [uHunt API](http://uhunt.felix-halim.net/api) backend to retrieve the statistics data.


Using the Components
--------------------
You can use uHunt components to run uHunt on your website!

Checkout the HTML and Javascript codes from:

    git clone https://github.com/felix-halim/uhunt-components.git

Or download the files:

    https://github.com/felix-halim/uhunt-components/archive/master.zip

Extract it to your website's public directory that can serve static files.
Yes! you don't need special server that runs PHP or anything like that.
As long as your server can serve static files, it will run fine.

You can also run it locally if you have python installed.
After downloading the files, go to the folder and run:

    python -m SimpleHTTPServer 8000

Then open your browser:

    http://localhost:8000
    http://localhost:8000/series.html

You are free to explore the codes, modify, extend it as you like.
Let me know if you've built something cool out of it :)
