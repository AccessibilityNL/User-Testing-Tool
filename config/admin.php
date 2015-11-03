<?php

return [
	/*
	 * Admin title
	 * Displays in page title and header
	 */
	'title'                   => 'AccessibleCheck',

	/*
	 * Admin url prefix
	 */
	'prefix'                  => 'admin',

	/*
	 * Middleware to use in admin routes
	 */
	'middleware'              => ['admin.auth'],

	/*
	 * Path to admin bootstrap files directory
	 * Default: app_path('Admin')
	 */
	'bootstrapDirectory'      => app_path('Admin'),

	/*
	 * Directory to upload images to (relative to public directory)
	 */
	'imagesUploadDirectory' => 'images/uploads',

	/*
	 * Authentication config
	 */
	'auth'                    => [
		'model' => '\SleepingOwl\AdminAuth\Entities\Administrator',
		'rules' => [
			'username' => 'required',
			'password' => 'required',
		]
	],

	/*
	 * Template to use
	 */
	// 'template'                => 'SleepingOwl\Admin\Templates\TemplateDefault',
	'template'                => 'SleepingOwl\AdminLteTemplate\Template',

	/*
	 * Default date and time formats
	 */
	'datetimeFormat'          => 'd.m.Y H:i',
	'dateFormat'              => 'd.m.Y',
	'timeFormat'              => 'H:i',

	/*
	 * If you want, you can extend ckeditor default configuration
	 * with this PHP Hash variable.
	 *
	 * Checkout http://docs.ckeditor.com/#!/api/CKEDITOR.config for more information.
	 */
	'ckeditor' => [],
];
