In order to use the e2e tests, you must first install and configure mySQL on your system. After installing mySQL:

1: Log in to your mySQL server as root
2: Follow the steps in /server/config/mysql_setup_notes.txt (use digapp_test not digapp_production)
3: Add the following variables to your /server/config/local.env.js file:
	DB_USER: 'digapp'
	DB_PASS: 'password'