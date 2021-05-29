-------------------------------------------------------------------------------
-- Script for inserting specific values into lookup tables for specific value fields.

DECLARE @TestDeleteDatabaseListEntries AS int = 1; -- Set to 1 to delete all entries from all YourQS tables.



-------------------------------------------------------------------------------
-- Check the database is setup.

IF DB_ID('YourQS') IS NULL
BEGIN
  PRINT('TESTING: YourQS database is NULL. Create a YourQS database by running YourQS_DB.sql');
  RETURN;
END

USE YourQS;

IF @TestDeleteDatabaseListEntries = 1
BEGIN
  PRINT('TESTING: Resetting all list tables in the database');
  PRINT('TESTING: WARNING: This will fail if existing database objects use these values that we attempt to reset.');

  -- Disable all constraints and triggers, delete data, then re-enable constraints and triggers.
  EXEC sp_MSForEachTable 'DISABLE TRIGGER ALL ON ?',             @whereand = 'AND Object_id IN (SELECT Object_id FROM sys.objects WHERE name LIKE ''%List'')'
  EXEC sp_MSForEachTable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL', @whereand = 'AND Object_id IN (SELECT Object_id FROM sys.objects WHERE name LIKE ''%List'')'
  EXEC sp_MSForEachTable 'DELETE FROM ?',                        @whereand = 'AND Object_id IN (SELECT Object_id FROM sys.objects WHERE name LIKE ''%List'')'
  EXEC sp_MSForEachTable 'ALTER TABLE ? CHECK CONSTRAINT ALL',   @whereand = 'AND Object_id IN (SELECT Object_id FROM sys.objects WHERE name LIKE ''%List'')'
  EXEC sp_MSForEachTable 'ENABLE TRIGGER ALL ON ?',              @whereand = 'AND Object_id IN (SELECT Object_id FROM sys.objects WHERE name LIKE ''%List'')'
END



-------------------------------------------------------------------------------
-- Setup constant tables. Due to constraints this will automatically fail if we try to re-insert already existing values.

INSERT INTO RatesList (RatesDescription)
               VALUES ('Chargeout'),
                      ('Cost');
            
INSERT INTO SiteSignList (SiteSignDescription)
                  VALUES ('Yes'),
                         ('No');

INSERT INTO PlasterboardLabourList (PlasterboardLabourDescription)
                            VALUES ('Subcontract plastering only'),
                                   ('Subcontract install and plaster'),
                                   ('Subcontract supply install and plaster');

INSERT INTO PlasterboardCeilingList (PlasterboardCeilingDescription)
                             VALUES ('As per drawings'),
                                    ('Standard 10mm'),
                                    ('Standard 13mm'),
                                    ('Premium 13mm');
                   
INSERT INTO InsulationList (InsulationDescription)
                    VALUES ('Main contractor supply and install'),
                           ('Subcontractor supply and install');

INSERT INTO CeilingBattensList (CeilingBattensDescription)
                VALUES ('By main contractor'),
                     ('By plasterboard installer');

INSERT INTO TradeList (TradeDescription)
               VALUES ('Cabinetry'),
                      ('Carpentry'),
                      ('Decks'),
                      ('Decorating and finishes'),
                      ('Demolition'),
                      ('Drainage'),
                      ('Electrical'),
                      ('Excavation'),
                      ('Exterior joinery'),
                      ('Flooring'),
                      ('Gas fitting'),
                      ('Heating and ventilation'),
                      ('Landscaping'),
                      ('Plumbing'),
                      ('Rainwater'),
                      ('Roofing'),
                      ('Scaffolding'),
                      ('Tiling'),
                      ('Other');



-------------------------------------------------------------------------------

EXEC sp_MSForEachTable 'SELECT * FROM ?', @whereand = 'AND Object_id IN (SELECT Object_id FROM sys.objects WHERE name LIKE ''%List'')';