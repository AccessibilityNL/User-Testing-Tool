#
# Cookbook Name:: app
# Recipe:: vhosts
#

# Apache cookbook is required
include_recipe 'apache2'

# create cert directory
directory node['app']['cert_dir'] do
    mode        00755
    recursive   true
    action      :create
end

# create multi-domain certificate config
template node['app']['cert_dir'] + '/openssl.cnf' do
  source    'openssl.erb'
  action    :create
end

# create certificate
bash "Create Certificate" do
    cwd         node['app']['cert_dir']
    code        "openssl req" +
                " -new -newkey rsa:4096 -days 365 -nodes -x509 -sha256" +
                " -keyout server.key -out server.crt -config openssl.cnf"
end

# create apache vhosts
web_app node['app']['dir_name'] do
    template    'vhosts.erb'
    notifies    :restart, "service[apache2]", :delayed
end