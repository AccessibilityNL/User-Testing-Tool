#
# Cookbook Name:: app
# Recipe:: mysql
#

# create mysql service
mysql_service 'default' do
    charset                 node['mysql']['charset']
    bind_address            '0.0.0.0'
    port                    node['mysql']['port']
    version                 node['mysql']['version']
    initial_root_password   'RootPassword'
    action                  [:create, :start]
end

# wait for mysql to start
bash "Starting mysql" do
    code "sleep 10"
end

# mysql base command
baseCMD = "mysql -h 127.0.0.1 -P#{node['mysql']['port']} -u root -pRootPassword --execute=" + '"'

# create mysql databases
node['mysql']['databases'].each do |database, values|
    bash 'Create Database ' + database do
        code    baseCMD + "CREATE DATABASE IF NOT EXISTS #{database} DEFAULT CHARACTER SET = '#{values['charset']}' DEFAULT COLLATE '#{values['collate']}'" + '"'
    end

    bash 'Create User ' + values['username'] do
        code    baseCMD + "GRANT ALL ON #{database}.* TO '#{values['username']}'@'%' IDENTIFIED BY '#{values['password']}'" + '"'
    end
end
