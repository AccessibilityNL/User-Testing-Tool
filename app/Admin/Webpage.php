<?php

/*
 * This is a simple example of the main features.
 * For full list see documentation.
 */
Admin::model('App\Models\Webpage')
	->title('Webpages')
	->alias('webpage')
	->display(function ()
	{
		$display = AdminDisplay::datatablesAsync();

		$display->order([[4, 'desc']]);

		$display->columns([
			Column::string('host')->label('Domain'),
			Column::string('path')->label('Path'),
            Column::custom()->label('Evaluations')->callback(function ($instance) {
                    return $instance->evaluations()->count();
                }),
            Column::custom()->label('Enabled')->callback(function ($instance) {
                    return $instance->is_enabled ? '&check;' : '&cross;';
                }),
            Column::datetime('created_at')->format('d-m-Y h:i:s')->label('Created'),
		]);

        $display->columnFilters([
            ColumnFilter::text()->placeholder('Domain'),
            ColumnFilter::text()->placeholder('Path'),
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
	->createAndEdit(function ()
	{
		$form = AdminForm::form();
		$form->items([
            FormItem::checkbox('is_enabled', 'Enabled'),
			FormItem::text('url', 'URL')->required(),
            FormItem::ckeditor('description', 'Description'),
		]);
		return $form;
	})
	->delete(null);
