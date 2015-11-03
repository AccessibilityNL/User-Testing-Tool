@extends('site.eiii.layout.default')

@section('content')
  <div class="container">
    <div class="logo">
        <img src="{{ url('site/eiii/images/png/eiii-logo.png') }}" alt="European Internet Inclusion Initiative project logo">
    </div>
    <div class="content">
      <h1>EIII User Testing Tool</h1>
      <div class="about">
        <h2>About</h2>
        <p>The EIII User Testing Tool (UTT) is a bookmarklet designed for web accessibility evaluation. With this tool, you can evaluate some of the accessibility barriers that cannot be measured automatically and share your evaluation results with EIII.</p>
        <p>This version will cover 2 tests that cannot easily be implemented for automatic checking. With this tool it is possible to evaluate page titles and the headings structure of a web page. Please note that this version is still a prototype offering a few examples of possible tests. We are still optimizing the accessibility of the bookmarklet so stay tuned for more information.</p>
        <p>The UTT is part of the European Internet Inclusion Initiative project. You can find more about the EIII project at the <a href="http://www.eiii.eu">project website</a>.</p>
      </div>
      <div class="download">
        <h2>Download</h2>
        <p>You don't actually "install" a bookmarklet.  You simply add it to your bookmarks. Drag and drop the following image to your bookmark toolbar: <a href="{!! Tool::getLink() !!}" class="download-image">User Testing Tool</a></p>
        <p>If your bookmark toolbar doesn’t show on Chrome or Internet Explorer use the Ctrl+Shift+B keyboard shortcut (Command+Shift+B for Mac users) to display the bar. For Firefox or Internet Explorer, you can also right-click and save it as a bookmark.</p>
      </div>
      <div class="start">
        <h2>How to start</h2>
        <p>After you dragged the bookmarklet link to your bookmark toolbar, you are ready to start. Open a new web page and click on the bookmarklet link. The tool appears at the top right of the browser. Start one of the tests by pressing the 'Check' button.</p>
      </div>
      <div class="works">
        <h2>How it works</h2>
        <p>The bookmarklet looks at the accessibility of the webpage in your browser. It does so by looking behind the page into the code. If you press the check button, the bookmarklet starts checking the page and shows you the results. In this version we have not included automated tests, so it is up to you to decide if the webpage is conformant with the guidelines or not. We have included a short explanation for every check.</p>
        <p>By completing these tests the UTT collects web accessibility data about accessibility that cannot be found by an automated tool.</p>
        <p>If you have any advice or good ideas for this tool, please contact Twan van Houtum  at bookmarklet (at) accessibility.nl.</p>
      </div>
      <div class="stats">
        <h2>Stats</h2>
        <div class="col downloads">
          <span data-scroll-activate="counter" data-start="0" data-end="{{ $memberCount }}">{{ $memberCount }}</span>
          <p>Downloads</p>
        </div>
        <div class="col sites">
          <span data-scroll-activate="counter" data-start="0" data-end="{{ $webpageCount }}">{{ $webpageCount }}</span>
          <p>Web sites</p>
        </div>
        <div class="col tests">
          <span data-scroll-activate="counter" data-start="0" data-end="{{ $resultCount }}">{{ $resultCount }}</span>
          <p>Tests</p>
        </div>
      </div>
    </div>
  </div>
@stop
