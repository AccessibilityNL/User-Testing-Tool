var language = {
    // General
    toolTitle  : 'User Testing Tool',
    toolTagline: 'EIII project',

    info : 'About',
    close: 'Close',

    backToHome    : 'Back to home',
    backToOverview: 'Back to overview',

    // home page
    homeStart: 'Start analysis',
    homeDesc : [
        'The EIII User Testing Tool (UTT) is designed for web accessibility evaluation. With this tool, you can evaluate some of the accessibility barriers that cannot be measured automatically and share your evaluation results with EIII.'
    ],

    // info page
    infoTitle   : 'About',
    infoVersion : 'Version: ',
    infoDesc    : 'The EIII User Testing Tool (UTT) is designed for web accessibility evaluation. With this tool, you can evaluate some of the accessibility barriers that cannot be measured automatically and share your evaluation results with EIII.\nThis version will cover 2 tests that cannot easily be implemented for automatic checking. With this tool it is possible to evaluate page titles and the headings structure of a web page. Please note that this version is still a prototype.\nThe User Testing Tool is part of the European Internet Inclusion Initiative project. You can find more about the EIII project at the Project website.',
    infoDescLink: 'http://www.eiii.eu',
    infoAuthor  : 'EIII is co-funded under the European Union Seventh Framework Programme (Grant agreement no: 609667).',
    infoLinks   : {
        'Project website': 'http://www.eiii.eu',
        'Disclaimer': 'http://eiii.eu/disclaimer',
        'Privacy': 'http://eiii.eu/privacy'
    },
    faq         : {},
    faqLinks    : {},

    // restart page
    restartOk  : 'Ok',
    restartDesc: [
        'Op dit moment is het niet mogelijk om de testen te herladen.',
        'Om de nieuwe testscores te bekijken is het nodig om de webpagina te herladen en de tool opnieuw te starten.',
        'De testscores blijven bewaard.'
    ],

    // report page
    reportTitle   : 'Rapport',
    reportDesc    : 'Download recente testresultaten',
    reportDownload: 'Download rapport (PDF)',

    // overview page
    overviewTitle        : 'Results',
    overviewDesc         : 'Test performed on ',
    overviewButtonReport : 'Report',
    overviewButtonRestart: 'Test again',

    // module title page
    titleTitle         : 'Page titles',
    titleDesc          : 'Is the page title correct?',
    titleFound         : 'The web page has the following title:',
    titleQuestion      : 'Does the web page title describe the context and purpose of this web page?',
    titleInfo          : 'This module checks the title of a web page. Page titles can help disabled users find content and orient themselves on a website. Make sure that each web page has a title that describes the content of the page.',
    titleInfoLink      : '#',
    titleError         : 'Result: insufficient',
    titleError_exists  : 'This web page has no title element.',
    titleError_empty   : 'There is a title element, but it is empty.',
    titleError_multiple: 'Multiple title elements have been found. This is not allowed.',

    // module broken links page
    brokenlinksTitle   : 'Gebroken links',
    brokenlinksDesc    : 'Controle op gebroken links.',
    brokenlinksInfo    : 'Voor meer informatie en achtergrond over dit onderwerp zie de [Uitlegpagina] in onze kennisbank.',
    brokenlinksInfoLink: '#',
    brokenlinksPass    : 'Resultaat: geslaagd',
    brokenlinksPassDesc: 'Alle links op de pagina zijn valide.',
    brokenlinksFailDesc: 'De volgende links geven een foutmelding:',

    // module readlevel page
    readlevelTitle   : 'Leesniveau',
    readlevelDesc    : 'Geeft een indicatie van de leesbaarheid.',
    readlevelInfo    : 'Voor meer informatie en achtergrond over dit onderwerp zie de [Uitlegpagina] in onze kennisbank.',
    readlevelInfoLink: '#',
    readlevelQuestion: 'Voer hieronder een tekst in of selecteer een tekst vanuit de pagina door er op te klikken.',
    readlevelButton  : 'Test mijn tekst',
    readlevelRestart : 'Nieuwe test',

    // module headings page
    headingsTitle      : 'Headings',
    headingsDesc       : 'Structure and description.',
    headingsInfo       : 'This module checks the headers of a web page. This provides people with disabilities better overview over the page content and makes it easier for them to search and find information. Make sure that headers are clear and descriptive.',
    headingsInfoLink   : '#',
    headingsQuestion   : 'Does the header describe the content of the paragraph that follows?',
    headingsError_first: 'This header is the first, most important header, and must therefore be an h1-element.',
    headingsError_empty: 'This header is found, but it is empty',
    headingsError_order: 'The sequence of this header is incorrect. A [current] can not follow a [previous].',

    pass      : 'Passed',
    fail      : 'Failed',
    disabled  : 'Disabled',
    incomplete: 'Feedback required',
    yes       : 'Yes',
    no        : 'No',
    url       : 'Url',
    error     : 'Error',

    404: '404 - Pagina niet gevonden',
    401: '401 - Authenticatie vereist',
    500: '500 - Internal Server Error',
    503: '503 - Service Unavailable',
    301: '301 - Pagina verplaatst',
    0  : 'Niet bestaand domein',

    // Textlevel test
    textLevelTitle: 'Taalniveau',
    textLevelIntro: 'tbd',

    // GT links tester
    gtTitle: 'Gewoon Toegankelijk',
    gtIntro: 'data uit gewoon toegankelijk.',

    // Image alt tester
    imageAltTitle: 'Text alternatives for images',
    imageAltDesc : 'This module helps you checks images for a description.',
    imageAltInfo: 'This module helps you checks images for a description (alternative text). Not available.',

    // caption tester
    captionTitle: 	'Captions',
    captionDesc: 	'This module checks the quality of captions of video on the web page.',
    captionInfo: 	'This module checks the quality of captions of video on the web page. Not available.',

    // Color Contrast tester
    contrastTitle: 'Kleur contrast',
    contrastIntro: 'Deze test controleert of de teksten op de pagina een juiste contrast hebben.',
    contrastDesc : 'Deze test controleert of de teksten op de pagina een juiste contrast hebben.',

    aboutTitle: 'About us',
    aboutIntro: '',
};

var plugins_loaded = true;