migrate saved queries from mongodb to mysql

1. best to just tar up this whole directory with:

	tar chzvf migrateapp.tar.gz migrateapp

2. expand on this tar file in /home/ubuntu on deployment machine where other docker containers for mongodb and mysql are running

3. cd migrateapp

4. ./migrate_data
