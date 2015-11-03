#
# Cookbook Name:: app
# Recipe:: project
#

# project install actions
bash "Install project" do
    user        'vagrant'
    cwd         node['app']['root_dir']
    code        <<-EOH
        sudo cp .env.example .env
        sudo curl -sS https://getcomposer.org/installer | php
        sudo php composer.phar install -o
        sudo php artisan migrate
        sudo php artisan db:seed
        sudo php artisan vendor:publish
    EOH
end
