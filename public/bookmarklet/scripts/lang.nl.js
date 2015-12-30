var language = {
	// General
	toolTitle:  			'Redactally',
	toolTagline:  			'De webredacteuren tool',

	info:					'Informatie',
	close:					'Sluiten',
	accessibility:			'Stichting Accessibility',

	backToHome: 			'Terug naar startscherm',
	backToOverview: 	    'Terug naar overzicht',

	// home page
	homeStart: 				'Start analyse',
	homeDesc: [
        'Redactally bookmarklet tool is het hulpmiddel voor webredacteuren. Gebruik de online tool tijdens uw werkzaamheden om eenvoudig en snel een aantal toegankelijkheidsaspecten van uw website te meten en te verbeteren.'
	],

	// info page
	infoTitle: 				'Over / help',
	infoVersion: 			'Versie: ',
	infoDesc:				'Redactally bookmarklet is een tool waarmee het mogelijk is om een aantal onderdelen van een webpagina te controleren op toegankelijkheid.',
	infoAuthor:				'Redactally is een product van Stichting Accessibility.',
	infoLicense:		    'Licentie verloopt op ',
	infoLinks: {
		'Gebruiksvoorwaarden': '/gebruiksvoorwaarden',
		'Privacyverklaring': '/privacyverklaring'
	},
	faq: {
           'Wat toetst de Redactally?' : 'Redactally toetst een aantal toegankelijkheidsrichtlijnen uit de Webrichtlijnen versie 2 norm die voor webredacteuren relevant zijn.',
           'Wat levert toegankelijkheid op?' : 'Een goede site die voor iedereen toegankelijk is. Dat kan je nieuwe of meer tevreden bezoekers opleveren. Denk ook aan het bruikbaar zijn op andere apparaten dan een computer: een toegankelijke website werkt vaak automatisch op een telefoon of tablet.',
           'Waar vind ik een overzicht van de Webrichtlijnen?' : 'De Webrichtlijnen versie 2 is beschikbaar via [http://versie2.webrichtlijnen.nl/norm/]</a>.',
           'Heeft u nog vragen?' : 'Neem dan contact met ons op via [redactally@accessibility.nl] of bel ons op 030 - 239 82 70.'
	},
	faqLinks: {
		'http://versie2.webrichtlijnen.nl/norm/' : 'http://versie2.webrichtlijnen.nl/norm/',
		'redactally@accessibility.nl' : 'mailto:redactally@accessibility.nl'
	},

	// restart page
	restartOk:              'Ok',
	restartDesc: [
        'Op dit moment is het niet mogelijk om de testen te herladen.',
        'Om de nieuwe testscores te bekijken is het nodig om de webpagina te herladen en de tool opnieuw te starten.',
        'De testscores blijven bewaard.'
	],

	// report page
	reportTitle: 			'Rapport',
	reportDesc: 			'Download recente testresultaten',
	reportDownload: 	    'Download rapport (PDF)',

	// overview page
	overviewTitle: 			'Resultaten',
	overviewDesc: 			'Test uitgevoerd op ',
	overviewButtonReport:	'Rapport',
	overviewButtonRestart:	'Nogmaals testen',

    // module title page
	titleTitle: 			'Paginatitels',
	titleDesc: 			    'Is de paginatitel correct?',
	titleFound: 			'De webpagina heeft de volgende titel:',
	titleQuestion: 			'Beschrijft deze titel het doel en de context van de pagina voldoende?',
	titleInfo: 			    'Voor meer informatie en achtergrond over dit onderwerp zie de [Uitlegpagina] in onze kennisbank.',
	titleInfoLink: 			'#',
    titleError:             'Resultaat: onvoldoende',
    titleError_exists:      'Het titel element is niet gevonden',
    titleError_empty:       'Het titel element is gevonden, maar dit element is leeg. Dit betekent dat er geen titel voor de pagina is bepaald.',
    titleError_multiple:    'Er zijn meerdere title-elementen gevonden. Dat is niet toegestaan.',

    // module broken links page
    brokenlinksTitle: 		'Gebroken links',
    brokenlinksDesc: 	    'Controle op gebroken links.',
    brokenlinksInfo: 		'Voor meer informatie en achtergrond over dit onderwerp zie de [Uitlegpagina] in onze kennisbank.',
    brokenlinksInfoLink: 	'#',
    brokenlinksPass:        'Resultaat: geslaagd',
    brokenlinksPassDesc:    'Alle links op de pagina zijn valide.',
    brokenlinksFailDesc:    'De volgende links geven een foutmelding:',

    // module readlevel page
    readlevelTitle: 		'Leesniveau',
    readlevelDesc: 	        'Geeft een indicatie van de leesbaarheid.',
    readlevelInfo: 		    'Voor meer informatie en achtergrond over dit onderwerp zie de [Uitlegpagina] in onze kennisbank.',
    readlevelInfoLink: 	    '#',
    readlevelQuestion: 	    'Voer hieronder een tekst in of selecteer een tekst vanuit de pagina door er op te klikken.',
    readlevelButton: 	    'Test mijn tekst',
    readlevelRestart: 	    'Nieuwe test',

    // module headings page
    headingsTitle            : 'Koppen',
	headingsDesc             : 'Structuur en beschrijving.',
	headingsInfo             : 'Voor meer informatie en achtergrond over dit onderwerp zie de [Uitlegpagina] in onze kennisbank.',
	headingsInfoLink         : '#',
	headingsQuestion         : 'Beschrijft de kop de bijbehorende tekst voldoende?',
	headingsError_first      : 'Deze kop is de eerste, en dus belangrijkste kop, en moet daarom een h1-element zijn',
	headingsError_empty      : 'Deze kop is gevonden, maar is leeg.',
	headingsError_order      : 	'De volgorde van deze kop is incorrect. Een [current] kan niet op een [previous] volgen.',

	pass:           		'Geslaagd',
	fail:           		'Mislukt',
	incomplete:             'Gebruikersfeedback nodig',
    yes:                    'Ja',
    no:                     'Nee',
    url:                    'Url',
    error:                  'Fout',

    404:                    '404 - Pagina niet gevonden',
    401:                    '401 - Authenticatie vereist',
    500: 				    '500 - Internal Server Error',
    503: 				    '503 - Service Unavailable',
    301: 				    '301 - Pagina verplaatst',
    0: 				    	'Niet bestaand domein',

	// Textlevel test
	textLevelTitle: 		'Taalniveau',
	textLevelIntro:     	'tbd',

	// GT links tester
	gtTitle: 				'Gewoon Toegankelijk',
	gtIntro: 				'data uit gewoon toegankelijk.',

	// Image alt tester
	imageAltTitle: 			'Tekst alternatieven voor plaatjes',
	imageAltIntro: 			'Deze test controleert of de plaatjes een voldoende beschreven alternatieve tekst heeft.',
	imageAltDesc: 			'Deze test controleert of de plaatjes een voldoende beschreven alternatieve tekst heeft',

	// Color Contrast tester
	contrastTitle: 			'Kleur contrast',
	contrastIntro: 			'Deze test controleert of de teksten op de pagina een juiste contrast hebben.',
	contrastDesc: 			'Deze test controleert of de teksten op de pagina een juiste contrast hebben.',

    aboutTitle: 			'Over ons',
    aboutIntro: 			'',
};


var plugins_loaded = true;