<?php

/*
 * This is a simple example of the main features.
 * For full list see documentation.
 */
Admin::model('SleepingOwl\AdminAuth\Entities\Administrator')
	->title('Administrators')
	->display(function ()
	{
		$display = AdminDisplay::table();

		$display->columns([
			Column::string('name')->label('Name'),
			Column::string('username')->label('Username'),
			Column::string('created_at')->label('Date'),
		]);

		// $display->columnFilters([
		//     null, // first column has no column filter
		//     ColumnFilter::text()->placeholder('Title'), // second column has text column filter
		// ]);

		return $display;
	})
	->createAndEdit(function ()
	{
		$form = AdminForm::form();
		$form->items([
			FormItem::text('name', 'Name')->required(),
			FormItem::text('email', 'Email')->required()->unique(),
		]);
		return $form;
	});
