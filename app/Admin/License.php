<?php
/*
 * This is a simple example of the main features.
 * For full list see documentation.
 */
Admin::model('App\Models\License')
    ->title('Licenses')
    ->alias('license')
    ->display(function () {
        $display = AdminDisplay::datatablesAsync();
        $display->order([[0, 'asc']]);

        $display->columns([
            Column::string('name')->label('Name'),
            Column::string('duration')->label('Duration'),
            Column::custom()->label('Enabled')->callback(function ($instance) {
                    return $instance->is_enabled ? '&check;' : '-';
                }),
            Column::custom()->label('Payed version')->callback(function ($instance) {
                    return $instance->needs_validation ? '&check;' : '-';
                }),
            Column::datetime('created_at')->format('d-m-Y h:i:s')->label('Created'),
            Column::datetime('updated_at')->format('d-m-Y h:i:s')->label('Updated'),
        ]);

        $display->columnFilters([
            ColumnFilter::text()->placeholder('Name'),
            null,
            null,
            null,
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
    ->edit(function () {
        $form = AdminForm::form();
        $form->items([
            FormItem::custom()->display(function ($instance) {
                    return '<div class="form-group ">
                                <label for="key">Key</label><br/>
                                ' . $instance->key . '
                            </div>';
                }),
            FormItem::text('name', 'Name')->required(),
            FormItem::text('duration', 'Duration')->required(),
            FormItem::checkbox('is_enabled', 'Enabled'),
            FormItem::checkbox('needs_validation', 'Payed version'),
            FormItem::ckeditor('description', 'Description'),
        ]);

        return $form;
    })
    ->create(function () {
        $form = AdminForm::form();
        $form->items([
            FormItem::text('name', 'Name')->required(),
            FormItem::text('duration', 'Duration')->required(),
            FormItem::checkbox('is_enabled', 'Enabled'),
            FormItem::checkbox('needs_validation', 'Payed version'),
            FormItem::ckeditor('description', 'Description'),
        ]);

        return $form;
    });
