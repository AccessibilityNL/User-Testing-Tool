<?php

/*
 * This is a simple example of the main features.
 * For full list see documentation.
 */
Admin::model('App\Models\Result')
	->title('Results')
	->alias('result')
	->display(function ()
	{
		$display = AdminDisplay::datatablesAsync();

		$display->order([[7, 'desc']]);

		$display->columns([
			Column::string('evaluation.member.first_name')->label('User'),
			Column::string('evaluation.webpage.url')->label('Url'),
			Column::string('module')->label('Module'),
			Column::string('type')->label('Type'),
			Column::string('status')->label('Status'),
			Column::string('value')->label('Value'),
			Column::string('info')->label('Info'),
            Column::datetime('created_at')->format('d-m-Y h:i:s')->label('Created'),
		]);

		return $display;
	})
	->create(null)
	->edit(null)
	->createAndEdit(null)
	->delete(null);
