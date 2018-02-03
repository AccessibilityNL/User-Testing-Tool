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
            Column::string('name')->label('Name'),
            Column::string('kvk')->label('Kvk number'),
            Column::string('url')->label('Website'),
            Column::custom()->label('Members')->callback(function ($instance) {
                    return $instance->members()->count();
                }),
            Column::custom()->label('Enabled')->callback(function ($instance) {
                    return $instance->is_enabled ? '&check;' : '&cross;';
                }),
            Column::custom()->label('Verified')->callback(function ($instance) {
                    return $instance->status != 'new' ? '&check;' : '&cross;';
                }),
            Column::custom()->label('Accepted')->callback(function ($instance) {
                    return $instance->status != 'new' && $instance->status != 'verified' ? '&check;' : '&cross;';
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
            FormItem::columns()->columns([
                [
                    FormItem::checkbox('is_enabled', 'Enabled'),
                    FormItem::select('sector_id', 'Sector')->model('App\Models\Sector')->display('name'),
                    FormItem::text('name', 'Name')->required(),
                    FormItem::text('kvk', 'Kvk Number')->unique(),
                    FormItem::text('phone', 'Phone'),
                    FormItem::text('email', 'Email'),
                    FormItem::password('password', 'Password'),
                    FormItem::text('url', 'Website'),
                    FormItem::custom()->display(function ($instance) {
                        if($instance->locations->count() == 0) {
                            return '';
                        }
                            return '<div class="form-group ">
                                <label for="key">Address</label><br/>
                                ' . $instance->locations->first()->location->street . ',
                                ' . $instance->locations->first()->location->zipcode . '
                                ' . $instance->locations->first()->location->city . ',
                                ' . $instance->locations->first()->location->country->name . '
                            </div>';
                        }),
                ],
                [
                    FormItem::custom()->display(function ($instance) {
                            return '<div class="form-group ">
                                <label for="key">Status</label><br/>
                                ' . $instance->status . '
                            </div>';
                        }),
                    FormItem::ckeditor('description', 'Description'),
                    FormItem::custom()->display(function ($instance) {
                            $licenses    = ['' => 'Select a license to add'] + \App\Models\License::lists('name', 'id');
                            $orgLicenses = $instance->licenses;

                            $html = '';

                            if ($instance->status != 'new') {

                                $html.= '<div class="form-group"><label for="password">License</label>';
                                $html.= Form::select('license_id', $licenses, null, ['class' => 'form-control']);

                                if (count($orgLicenses)) {
                                    $html .= '<table class="table table-striped datatables dataTable"><thead><tr><th>Name</th><th>Starts</th><th>Ends</th></tr></thead>';

                                    foreach ($orgLicenses as $license) {
                                        $html .= '<tr>';
                                        $html .= '<td>' . $license->license->name . '</td>';
                                        $html .= '<td>' . $license->starts_at . '</td>';
                                        $html .= '<td>' . $license->ends_at . '</td>';
                                        $html .= '</tr>';
                                    }

                                    $html .= '</table>';
                                }

                                $html.= '</div>';
                            }

                            return $html;
                        })->callback(function ($instance) {
                            $licenseID = Input::get('license_id');

                            if ($licenseID) {
                                $license   = \App\Models\License::where(['id' => $licenseID])->first();
                                $startDate = new Carbon\Carbon();
                                $endDate   = $license->duration === 0 ? null : Carbon\Carbon::now()->addSeconds($license->duration);

                                $instance->licenses()->create([
                                    'organization_id' => $instance->id,
                                    'license_id'      => $license->id,
                                    'is_enabled'      => 1,
                                    'is_validated'    => 1,
                                    'description'     => $license->name,
                                    'starts_at'       => $startDate,
                                    'ends_at'         => $endDate
                                ]);

                                if ($instance->status == 'verified') {
                                    $instance->status = 'accepted';

                                    $url      = route('register.download', ['organizationKey' => $instance->key, 'locale' => Lang::getLocale()]);
                                    $contacts = $instance->getContacts();
                                    $contact  = $contacts[0];

                                    $data = [
                                        'organization' => $instance,
                                        'contact'      => $contact,
                                        'name'         => $contact->first_name . " " . $contact->last_name,
                                        'email'        => $contact->email,
                                        'link'         => '<a href="' . $url . '">' . $url . '</a>',
                                        'starts_at'    => $startDate->formatLocalized('%d %B %Y'),
                                        'ends_at'      => $endDate->formatLocalized('%d %B %Y'),
                                    ];

                                    $data['title'] = Lang::get(Site::$name . '_email.accepted.title');
                                    $data['text']  = str_replace("\r", '', str_replace("\n", '<br/>', Lang::get(Site::$name . '_email.accepted.text', $data)));

                                    Mail::send('site.' . Site::getName() . '.email.verification', $data, function ($message) use ($data) {

                                        $message
                                        ->to($data['email'], $data['name'])
                                        ->subject($data['title']);

                                        $bcc = Config::get('mail.bcc');

                                        foreach ($bcc as $bc) {
                                            $message->bcc($bc['address'], $bc['name']);
                                        }
                                    });
                                }
                            }
                        }),
                    ],
                ])
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
                FormItem::password('password', 'Password'),
                FormItem::text('url', 'Website'),
                FormItem::ckeditor('description', 'Description'),
            ]);

            return $form;
        });
