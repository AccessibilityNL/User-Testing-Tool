User Testing Tool
==================================
This document contains information on how to download, install and start developing on this project.

<br/>1. Requirements
----------------------------------
1. [Git](http://git-scm.com/)
2. [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
3. [Vagrant](https://www.vagrantup.com/downloads)

> **Note for Windows users**
> <br/>- Install software to a path which contains no spaces. for example: `C:\tools\`
> <br/>- Add the VirtualBox installation directory to your PATH variables.
> <br/>- Add the Git bin directory to your PATH variables.
> <br/>- Make sure [Virtualisation](http://www.sysprobs.com/disable-enable-virtualization-technology-bios) is enabled in your BIOS


<br/>2. Install Project
----------------------------------
1. Clone the repository to your local machine:
2. First time usage will install and configure all dependencies. This can take up to 10 minutes.
From your project directory enter the command:

    $ `vagrant up`


<br/>3. Run Project
----------------------------------
1. From your project directory enter the command:

    $ `vagrant up`

2. After the command has finished the project will be available on: [localhost.dev.accessiblecheck.com](https://www.localhost.dev.accessiblecheck.com)

3. Changes you make to this project will be synced to the virtual machine.

4. MySQL database can be accessed trough credentials:
<pre>
    host:       localhost.dev.accessiblecheck.com
    database:   accessiblecheck_dev
    user:       accheck
    pass:       accheck
</pre>


<br/>4. Stopping the virtual machine
----------------------------------
- Stop the virtual machine using the command:

    $ `vagrant halt`

- Destroy the virtual machine, for example if you want to clear space or don't often work on this project.

    $ `vagrant destroy`


<br/>5. Updating the project
----------------------------------
- Updates will be automatically run when starting the virtual machine
- If the machine is already running, reload.

    $ `vagrant reload`

- If the machine is not running, start.

    $ `vagrant up`