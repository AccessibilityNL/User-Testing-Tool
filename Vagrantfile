# -*- mode: ruby -*-
# vi: set ft=ruby :

# require machine settings
require './machine/lib/machine.rb'

# minimum vagrant version
Vagrant.require_version Machine.requireVersion

# install plugins
Machine.installPlugins

# configure vagrant
Vagrant.configure(Machine.apiVersion) do |config|

    # box settings
    config.vm.box               = Machine.box['base']
    config.vm.box_url           = Machine.box['url']
    config.vm.box_check_update  = Machine.box['update']

    # synced folders settings
    config.vm.synced_folder '.', Machine.sharedPath

    # network settings
    config.vm.network "private_network", ip: "33.33.33.10"

    if Machine.isPublic
        config.vm.network 'public_network', type: 'dhcp'
    end

    # hostname
    config.vm.hostname = Machine.networkName

    # enable SSH agent forwarding
    config.ssh.forward_agent = true

    # vagrant-omnibus plugin configuration
    config.omnibus.chef_version = Machine.chefVersion

    # vagrant-hostmanager plugin configuration
    config.hostmanager.enabled              = true
    config.hostmanager.manage_host          = true
    config.hostmanager.ignore_private_ip    = false
    config.hostmanager.include_offline      = true
    config.hostmanager.aliases              = Machine.hostNames

    # vagrant-hostmanager fetch auto assigned ip-address
    config.hostmanager.ip_resolver = proc do |vm, resolving_vm|
        Machine.setBoxID(vm.id)
        Machine.privateIP
    end

    # vagrant-cachier plugin configuration
    config.cache.scope = :box

    # vagrant-librarian-chef-nochef configuration
    config.librarian_chef.cheffile_dir = Machine.vendorPath

    # virtualbox provider settings
    config.vm.provider :virtualbox do |vb|
        vb.name     = Machine.boxName
        vb.gui      = Machine.box['gui']
        vb.memory   = Machine.box['memory']
        vb.cpus     = Machine.box['cpus']
        vb.customize ['modifyvm', :id, '--ioapic', 'on']
    end

    # copy your git configs
    config.vm.provision 'file', source: '~/.gitconfig', destination: '.gitconfig'

    # chef provisioning
    config.vm.provision 'chef_solo' do |chef|
        Machine.installApps(chef)
    end

    # update apps
    Machine.updateApps(config)
end
