<?php
/*
 * This is a simple example of the main features.
 * For full list see documentation.
 */
Admin::model('App\Models\Sector')
    ->title('Sectors')
    ->alias('sector')
    ->display(function () {
        $display = AdminDisplay::datatablesAsync();
        $display->order([[0, 'asc']]);

        $display->columns([
            Column::string('id')->label('Id'),
            Column::string('name')->label('Name'),
            Column::datetime('created_at')->format('d-m-Y h:i:s')->label('Created'),
            Column::datetime('updated_at')->format('d-m-Y h:i:s')->label('Updated'),
        ]);

        $display->columnFilters([
            null,
            ColumnFilter::text()->placeholder('Name'),
            ColumnFilter::range()->from(
                ColumnFilter::date()->format('d.m.Y')->placeholder('From Date')
            )->to(
                ColumnFilter::date()->format('d.m.Y')->placeholder('To Date')
            ),
            ColumnFilter::range()->from(
                ColumnFilter::date()->format('d.m.Y')->placeholder('From Date')
            )->to(
                ColumnFilter::date()->format('d.m.Y')->placeholder('To Date')
            )
        ]);

        return $display;
    })
    ->createAndEdit(function () {
        $form = AdminForm::form();
        $form->items([
            FormItem::text('name', 'Name')->required(),
        ]);

        return $form;
    });
