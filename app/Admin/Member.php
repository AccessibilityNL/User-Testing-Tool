<?php
/*
 * This is a simple example of the main features.
 * For full list see documentation.
 */
Admin::model('App\Models\Member')
    ->title('Members')
    ->alias('member')
    ->display(function () {
        $display = AdminDisplay::datatablesAsync();
        $display->order([[9, 'desc']]);

        $display->columns([
            Column::checkbox(),
            Column::string('organization.name')->label('Organization'),
            Column::string('status')->label('Status'),
            Column::string('type')->label('Type'),
            Column::string('title')->label('Function'),
            Column::string('first_name')->label('Firstname'),
            Column::string('last_name')->label('Lastname'),
            Column::string('email')->label('Email'),
            Column::custom()->label('Enabled')->callback(function ($instance) {
                    return $instance->is_enabled ? '&check;' : '-';
                }),
            Column::datetime('created_at')->format('d-m-Y h:i:s')->label('Created'),
        ]);

        $display->columnFilters([
            null,
            ColumnFilter::text()->placeholder('Organization'),
            null,
            null,
            null,
            null,
            null,
            ColumnFilter::text()->placeholder('Email'),
            null,
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
            FormItem::checkbox('is_enabled', 'Enabled'),
            FormItem::select('organization_id', 'Organization')->model('App\Models\Organization')->display('name'),
            FormItem::text('first_name', 'Firstname'),
            FormItem::text('last_name', 'Lastname'),
            FormItem::text('email', 'Email')->unique(),
            FormItem::text('phone', 'Phone'),
            FormItem::text('url', 'Website'),
            FormItem::text('title', 'Function'),
            FormItem::custom()->display(function ($instance) {
                    return '<div class="form-group ">
                                <label for="key">Key</label><br/>
                                ' . $instance->key . '
                            </div>';
                }),
            FormItem::custom()->display(function ($instance) {
                    return '<div class="form-group ">
                                <label for="key">Status</label><br/>
                                ' . $instance->status . '
                            </div>';
                }),
            FormItem::custom()->display(function ($instance) {
                    return '<div class="form-group ">
                                <label for="key">Type</label><br/>
                                ' . $instance->type . '
                            </div>';
                }),
            FormItem::ckeditor('description', 'Description'),
        ]);

        return $form;
    })
    ->create(function () {
        $form = AdminForm::form();
        $form->items([
            FormItem::checkbox('is_enabled', 'Enabled'),
            FormItem::select('organization_id', 'Organization')->model('App\Models\Organization')->display('name'),
            FormItem::text('first_name', 'Firstname'),
            FormItem::text('last_name', 'Lastname'),
            FormItem::text('email', 'Email')->unique(),
            FormItem::text('phone', 'Phone'),
            FormItem::text('url', 'Website'),
            FormItem::text('title', 'Function'),
            FormItem::ckeditor('description', 'Description'),
        ]);

        return $form;
    });
