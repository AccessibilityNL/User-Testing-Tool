<?php

/*
 * This is a simple example of the main features.
 * For full list see documentation.
 */
Admin::model('App\Models\Evaluation')
	->title('Evaluations')
	->alias('evaluation')
	->display(function ()
	{
		$display = AdminDisplay::datatablesAsync();

		$display->order([[7, 'desc']]);

		$display->columns([
			Column::string('member.first_name')->label('User'),
			Column::string('webpage.url')->label('Url'),
			Column::string('ip')->label('IP-address'),
			Column::string('device_type')->label('Type'),
			Column::string('browser')->label('Browser'),
			Column::string('platform')->label('Platform'),
			Column::string('device')->label('Device'),
            Column::datetime('created_at')->format('d-m-Y h:i:s')->label('Created'),
		]);

        $display->columnFilters([
            null,
            ColumnFilter::text()->placeholder('Url'),
            ColumnFilter::text()->placeholder('IP-address'),
            null,
            null,
            null,
            null,
            ColumnFilter::range()->from(
                ColumnFilter::date()->format('d.m.Y')->placeholder('From Date')
            )->to(
                ColumnFilter::date()->format('d.m.Y')->placeholder('To Date')
            )
        ]);

		return $display;
	})
	->create(null)
	->edit(null)
	->createAndEdit(null)
	->delete(null);
