# Casterly

__Casterly__ is a web application that helps you with your everyday finances. In it you can see how much are you spending on each category (shopping, bills, health) and compare month to month.

This project has been built by Pablo Recio (pablo@recio.me) and Rosa Durante (me@rosadurante.com) 


## Instalation

This project has some dependencies that need to be in your system:
 * Python 2.7
 * PostgreSQL 9.3
 * Node 0.10
 * Node Package Manager 1.4

To get started on this project you just need to follow few steps:

### virtualenvwrapper

If you don't have `virtualenvwrapper` installed those are the steps:

```sh
$> sudo easy_install virtualenvwrapper
$> source virtualenvwrapper.sh
```

Now you've got virtualenvwrapper activated. Let's create an environment:

```sh
$> mkvirtualenv casterly-env
```

### instalation

Let's clone this repo into your local machine:

```sh
$> git clone git@github.com:pablorecio/casterly.git
```

Then, go to its main folder and install all python dependencies:

```sh
$> cd casterly
$> pip install -r requeriments.txt

```

The project also have some node dependencies, let's install them:

```sh
$> npm install
```

Make sure you've got Grunt and you haven't got any errors by executing:

```sh
$> grunt
```

Once all these steps are done, we need to get the front end dependencies. To do so, just run:

```sh
$> cd casterly/static
$> ../../node_modules/bower/bin/bower install
```

Finally! You've got all the different dependencies on it. So now, to prepare the database and run de server just run:

```sh
$> cd ../..
$> python manage.py syncdb
$> python manage.py runserver
```

Open `http://localhost:8000` it would display the main page of the project.


## Get started

At the moment, the easy way to upload your statements is by using a comand line. Having a CSV file separated by ',' would be enough to start.

To add that information to the system just run:

```sh
$> python manage.py import_csv <path to filename>
```

The CSV file should contains few different elements on each statement (row):
 * A key of the bank account: Rosa C/A, Credit Card, ISA, etc
 * A category of the operation: bills, shooping, food and drinks, groceries, etc
 * The description in the operation.
 * The date of the operation.
 * The amount of the operation.
 * 'in' or 'out' depend if it was an income or outcome operation.

An example of that file could be:

```sh
Rosa C/A,food and drinks,gale's bakery,10/01/2014,£1.50,out
Rosa C/A,transport,monthly travelcard,10/01/2014,£116.80,out
Rosa C/A,food and drinks,loaf,10/01/2014,£5.90,out
Rosa C/A,food and drinks,artisan,13/01/2014,£9.80,out
Rosa C/A,groceries,cooperative,20/01/2014,£3.75,out
Rosa C/A,entertainment,spotify,20/01/2014,£9.99,out
Rosa C/A,shopping,amazon,29/01/2014,£12.79,out
Rosa C/A,bills,mobile,31/01/2014,£12.90,out
```

## Contributions

Feel free to improve anything of this project by sending pull requests. You also can contact with us directly on pablo@recio.me and me@rosadurante.com
