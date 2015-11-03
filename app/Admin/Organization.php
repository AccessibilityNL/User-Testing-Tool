<?php
/*
 * This is a simple example of the main features.
 * For full list see documentation.
 */
Admin::model('App\Models\Organization')
    ->title('Organizations')
    ->alias('organization')
    ->display(function () {
        $display = AdminDisplay::datatablesAsync();
        $display->order([[0, 'asc']]);

        $display->columns([
            Column::checkbox(),
            Column::string('sector.name')->label('Sector'),
            Column::string('status')->label('Status'),
            Column::string('name')->label('Name'),
            Column::string('kvk')->label('Kvk number'),
            Column::string('url')->label('Website'),
            Column::custom()->label('Enabled')->callback(function ($instance) {
                    return $instance->is_enabled ? '&check;' : '-';
                }),
            Column::datetime('created_at')->format('d-m-Y h:i:s')->label('Created'),
        ]);

        $display->columnFilters([
            null,
            ColumnFilter::text()->placeholder('Sector'),
            ColumnFilter::text()->placeholder('Name'),
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
    ->edit(function () {
        $form = AdminForm::form();
        $form->items([
            FormItem::checkbox('is_enabled', 'Enabled'),
            FormItem::select('sector_id', 'Sector')->model('App\Models\Sector')->display('name'),
            FormItem::text('name', 'Name')->required(),
            FormItem::text('kvk', 'Kvk Number')->unique(),
            FormItem::text('phone', 'Phone'),
            FormItem::text('email', 'Email'),
            FormItem::text('url', 'Website'),
            FormItem::custom()->display(function ($instance) {
                    return '<div class="form-group ">
                                <label for="key">Address</label><br/>
                                ' . $instance->locations->first()->location->street . '
                            </div>';
                }),
            FormItem::custom()->display(function ($instance) {
                    return '<div class="form-group ">
                                <label for="key">Zipcode</label><br/>
                                ' . $instance->locations->first()->location->postal_code . '
                            </div>';
                }),
            FormItem::custom()->display(function ($instance) {
                    return '<div class="form-group ">
                                <label for="key">City</label><br/>
                                ' . $instance->locations->first()->location->city . '
                            </div>';
                }),
            FormItem::custom()->display(function ($instance) {
                    return '<div class="form-group ">
                                <label for="key">Country</label><br/>
                                ' . $instance->locations->first()->location->country->name . '
                            </div>';
                }),
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
            FormItem::ckeditor('description', 'Description'),
        ]);

        return $form;
    })
    ->create(function () {
        $form = AdminForm::form();
        $form->items([
            FormItem::checkbox('is_enabled', 'Enabled'),
            FormItem::select('sector_id', 'Sector')->model('App\Models\Sector')->display('name'),
            FormItem::text('name', 'Name')->required(),
            FormItem::text('kvk', 'Kvk Number')->unique(),
            FormItem::text('phone', 'Phone'),
            FormItem::text('email', 'Email'),
            FormItem::text('url', 'Website'),
            FormItem::ckeditor('description', 'Description'),
        ]);

        return $form;
    });
