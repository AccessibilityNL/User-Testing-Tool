<?php
/*
 * This is a simple example of the main features.
 * For full list see documentation.
 */
Admin::model('App\Models\Country')
    ->title('Countries')
    ->alias('country')
    ->display(function () {
        $display = AdminDisplay::datatablesAsync();
        $display->order([[0, 'asc']]);

        $display->columns([
            Column::string('code')->label('Code'),
            Column::string('name')->label('Name'),
            Column::string('local_name')->label('Local name'),
            Column::datetime('created_at')->format('d-m-Y h:i:s')->label('Created'),
            Column::datetime('updated_at')->format('d-m-Y h:i:s')->label('Updated'),
        ]);

        $display->columnFilters([
            ColumnFilter::text()->placeholder('Code'),
            ColumnFilter::text()->placeholder('Name'),
            ColumnFilter::text()->placeholder('Local name'),
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
    ->create(function () {
        $form = AdminForm::form();
        $form->items([
            FormItem::text('code', 'Code')->required(),
            FormItem::text('name', 'Name')->required(),
            FormItem::text('local_name', 'Local Name')->required(),
        ]);

        return $form;
    })
    ->edit(null)
    ->delete(null);
