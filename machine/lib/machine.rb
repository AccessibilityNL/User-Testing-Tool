require 'i18n'
require 'yaml'

# class machine helper functions
class Machine

    # plugins
    PLUGINS = [
        'vagrant-hostmanager',
        'vagrant-vbguest',
        'vagrant-cachier',
        'vagrant-omnibus',
        'vagrant-librarian-chef-nochef'
    ]

    # paths
    BASE_PATH     = File.dirname(File.dirname(__FILE__))
    PROJECT_PATH  = File.dirname(BASE_PATH)

    # load config file
    CONF = YAML.load_file(BASE_PATH + '/config.yml')

    @boxID

    # minimum vagrant version
    def self.requireVersion
        '>= 1.6.5'
    end

    # vagrant API version
    def self.apiVersion
        2
    end

    # vagrant API version
    def self.chefVersion
        '12.0.3'
    end

    # box name
    def self.setBoxID(id)
        @boxID = id
    end

    # box name
    def self.boxName
        CONF['network']['name']
    end

    # box base
    def self.box
        CONF['box']
    end

    # shared path on machine
    def self.sharedPath
        '/data/projects/' + File.basename(PROJECT_PATH)
    end

    # shared path on machine
    def self.tmpPath
        '/data/projects/_tmp'
    end

    # vendor path
    def self.vendorPath
        BASE_PATH + '/vendor'
    end

    # is public within network
    def self.isPublic
        CONF['network']['public']
    end

    # machine's private IP in network
    def self.privateIP
        if @boxID
            `VBoxManage guestproperty get #{@boxID} "/VirtualBox/GuestInfo/Net/1/V4/IP"`.split()[1]
        end
    end

    # machine's public IP in network
    def self.publicIP
        if @boxID
            `VBoxManage guestproperty get #{@boxID} "/VirtualBox/GuestInfo/Net/2/V4/IP"`.split()[1]
        end
    end

    # machine's name in network
    def self.networkName
        gitName   = `git config user.name`.force_encoding("UTF-8")
        firstName = gitName.split[0]

        networkName = I18n.transliterate(firstName + '-' + CONF['network']['name'])

        networkName.downcase.tr(' ', '-')
    end

    # hostnames
    def self.hostNames
        names = []
        CONF['network']['subdomains'].unshift('')

        CONF['network']['domains'].each do |domain|
            CONF['network']['environments'].each do |environment|
                CONF['network']['subdomains'].each do |subdomain|
                    names << subdomain + (subdomain == '' ? '' : '.') + 'localhost.' + environment + '.' + domain
                end
            end
        end

        names
    end

    # install plugins
    def self.installPlugins
        restart = false

        # install required plugins
        PLUGINS.each do |plugin|
            unless Vagrant.has_plugin?(plugin)
                system('vagrant plugin install ' + plugin)
                restart = true
            end
        end

        # restart command
        if restart
            system('vagrant ' + ARGV.join(' '))
            exit
        end
    end

    # update apps
    def self.updateApps(config)
         config.vm.provision 'shell', run: 'always' do |s|
             s.inline = <<-EOH
                 cd $1
                 sudo php composer.phar install -o
             EOH
             s.args   = [self.sharedPath]
        end
    end

    # install apps
    def self.installApps(chef)
        # set cookbook paths
        chef.cookbooks_path = [BASE_PATH, self.vendorPath + '/cookbooks']

        # add settings
        chef.json = CONF['apps']

        # notify filesystem to chef
        #chef.synced_folder_type = 'nfs'

        self.updateApache(chef.json)
        self.updateApp(chef.json)

        # configure recipes
        CONF['apps']['install'].each do |recipe|
            chef.add_recipe recipe
        end
    end

    # update settings apache
    def self.updateApache(settings)
        # check key
        settings['apache'] = ((!settings.has_key?'apache') ? {} : settings['apache'])

        # sub settings
        subSettings = settings['apache']
        subSettings['listen_ports']     = [80, 443]
        subSettings['default_modules']  = subSettings['modules']
    end

    # update settings app
    def self.updateApp(settings)
        # check key
        settings['app'] = ((!settings.has_key?'app') ? {} : settings['app'])

        # sub settings
        subSettings = settings['app']
        subSettings['domains']      = CONF['network']['domains']
        subSettings['environments'] = CONF['network']['environments']
        subSettings['root_dir']     = self.sharedPath
        subSettings['tmp_dir']      = self.tmpPath
        subSettings['dir_name']     = File.basename(PROJECT_PATH)
        subSettings['cert_dir']     = '/data/projects/_ssl/' + subSettings['dir_name']
    end
end
