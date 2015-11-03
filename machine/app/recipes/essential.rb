#
# Cookbook Name:: app
# Recipe:: default
#
# Installs essential requirements
#

# APT is required
include_recipe 'apt'

# ACL is required for extended file permission
include_recipe 'acl'

# CURL library is required
include_recipe 'curl'

# GIT client is required
include_recipe 'git'

# Install cachefilesd for better GIT performance on NFS filesystems
package 'cachefilesd' do
  action    :install
end

file '/etc/default/cachefilesd' do
  content   'RUN=yes'
  action    :create
  mode      0755
end

# Edit GIT settings for NFS performance
bash 'Edit GIT settings' do
    code    'git config --global core.preloadindex true'
end

# Enable swap space for memory
bash 'Enable swap' do
    code    <<-EOH
        sudo /bin/dd if=/dev/zero of=/var/swap.1 bs=5M count=5120
        sudo /sbin/mkswap /var/swap.1
        sudo /sbin/swapon /var/swap.1
    EOH
end

# Install language
bash 'Install Language' do
  code <<-EOH
    sudo locale-gen nl_NL.UTF-8 nl
  EOH
end
