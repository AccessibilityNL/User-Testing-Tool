#
# Cookbook Name:: app
# Recipe:: php
#

# include default php cookbook
include_recipe 'php'

# update php.ini settings
ruby_block "Update php.ini" do
    block do
        file1 = Chef::Util::FileEdit.new(File.dirname(node['php']['conf_dir']) + '/apache2/php.ini')
        file2 = Chef::Util::FileEdit.new(File.dirname(node['php']['conf_dir']) + '/cli/php.ini')

        node['php']['settings'].each do |setting, value|
            file1.search_file_replace_line(/^#{setting}\s?=\s?.*$/, setting + ' = ' + value)
            file2.search_file_replace_line(/^#{setting}\s?=\s?.*$/, setting + ' = ' + value)

            file1.insert_line_if_no_match(/^#{setting}\s?=\s?.*$/, setting + ' = ' + value)
            file2.insert_line_if_no_match(/^#{setting}\s?=\s?.*$/, setting + ' = ' + value)
        end

        file1.write_file
        file2.write_file
    end
    notifies :restart, "service[apache2]"
end

bash 'MCrypt' do
    user        'root'
    code        'php5enmod mcrypt'
    notifies    :restart, "service[apache2]", :delayed
end
