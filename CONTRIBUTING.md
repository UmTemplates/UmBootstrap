# Contributing to UmBootstrap

## Introduction
It is important to note that contributing to UmBootstrap requires a different process to installing UmBootrap using the dotnet CLI.

This is because the dotnet CLI does not support installing project templates from GitHub. Therefore, the process for contributing to UmBootstrap is as follows:

1. Fork the UmBootstrap repository
2. Clone your forked repository to your local machine
3. Make your changes
4. Push your changes to your forked repository
5. Create a pull request to merge your changes into the UmBootstrap repository

## Forking the UmBootstrap repository

To fork the UmBootstrap repository, click the Fork button in the top right corner of the UmBootstrap repository page.

## Cloning your forked repository to your local machine

To clone your forked repository to your local machine, open a command prompt and navigate to the folder where you want to clone the repository.

Then run the following command:

    git clone

## Building the UmBootstrap solution

> **NOTE**  
> To build the UmBootstrap solution remove the connection string from the appsettings.json file before the first build.
>

Make your changes to the UmBootstrap repository on your local machine.

## Pushing your changes to your forked repository
Once you have made your changes, you need to push them to your forked repository.

To do this, open a command prompt and navigate to the folder where you cloned the repository.

Then run the following commands:

    git add .
    git commit -m "Your commit message"
    git push

## Creating a pull request to merge your changes into the UmBootstrap repository

To create a pull request to merge your changes into the UmBootstrap repository, go to the UmBootstrap repository page and click the Pull requests tab.

Then click the New pull request button.

Then click the compare across forks link.

Then select your forked repository from the head repository dropdown.

Then click the Create pull request button.

Then enter a title and description for your pull request and click the Create pull request button.

## Updating your forked repository with changes from the UmBootstrap repository

To update your forked repository with changes from the UmBootstrap repository, open a command prompt and navigate to the folder where you cloned the repository.

Then run the following commands:

    git remote add upstream

    git fetch upstream

    git merge upstream/master

    git push

## Updating your local repository with changes from your forked repository

To update your local repository with changes from your forked repository, open a command prompt and navigate to the folder where you cloned the repository.

Then run the following commands:

    git pull


    git push
