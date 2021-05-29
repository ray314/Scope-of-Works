-------------------------------------------------------------------------------
-- Script for creating test data based on the example data from the example YourQS files.

DECLARE @TestDeleteDatabaseEntries AS int = 1; -- Set to 1 to delete all entries from all YourQS tables.



-------------------------------------------------------------------------------
-- Check the database is setup.

IF DB_ID('YourQS') IS NULL
BEGIN
  PRINT('TESTING: YourQS database is NULL. Create a YourQS database by running YourQS_DB.sql');
  RETURN;
END

USE YourQS;

IF @TestDeleteDatabaseEntries = 1
BEGIN
  PRINT('TESTING: Resetting all non list tables in the database');

  -- Disable all constraints and triggers, delete data, then re-enable constraints and triggers.
  EXEC sp_MSForEachTable @command1 = 'DISABLE TRIGGER ALL ON ?',             @whereand = 'AND Object_id IN (SELECT Object_id FROM sys.objects WHERE name NOT LIKE ''%List'')';
  EXEC sp_MSForEachTable @command1 = 'ALTER TABLE ? NOCHECK CONSTRAINT ALL', @whereand = 'AND Object_id IN (SELECT Object_id FROM sys.objects WHERE name NOT LIKE ''%List'')';
  EXEC sp_MSForEachTable @command1 = 'DELETE FROM ?',                        @whereand = 'AND Object_id IN (SELECT Object_id FROM sys.objects WHERE name NOT LIKE ''%List'')';
  EXEC sp_MSForEachTable @command1 = 'ALTER TABLE ? CHECK CONSTRAINT ALL',   @whereand = 'AND Object_id IN (SELECT Object_id FROM sys.objects WHERE name NOT LIKE ''%List'')';
  EXEC sp_MSForEachTable @command1 = 'ENABLE TRIGGER ALL ON ?',              @whereand = 'AND Object_id IN (SELECT Object_id FROM sys.objects WHERE name NOT LIKE ''%List'')';
END

              


-------------------------------------------------------------------------------
-- Setting variables for testing.

DECLARE @RatesList_Chargout int = (SELECT TOP 1 RatesID FROM RatesList WHERE RatesDescription = 'Chargeout');
DECLARE @RatesList_Cost     int = (SELECT TOP 1 RatesID FROM RatesList WHERE RatesDescription = 'Cost');

DECLARE @SiteSignList_No  int = (SELECT TOP 1 SiteSignID FROM SiteSignList WHERE SiteSignDescription = 'Yes');
DECLARE @SiteSignList_Yes int = (SELECT TOP 1 SiteSignID FROM SiteSignList WHERE SiteSignDescription = 'No');

DECLARE @PlasterboardLabourList_Subcontract_plastering_only            int = (SELECT TOP 1 PlasterboardLabourID FROM PlasterboardLabourList WHERE PlasterboardLabourDescription = 'Subcontract plastering only');
DECLARE @PlasterboardLabourList_Subcontract_install_and_plaster        int = (SELECT TOP 1 PlasterboardLabourID FROM PlasterboardLabourList WHERE PlasterboardLabourDescription = 'Subcontract install and plaster');
DECLARE @PlasterboardLabourList_Subcontract_supply_install_and_plaster int = (SELECT TOP 1 PlasterboardLabourID FROM PlasterboardLabourList WHERE PlasterboardLabourDescription = 'Subcontract supply install and plaster');

DECLARE @PlasterboardCeilingList_As_per_drawings int = (SELECT TOP 1 PlasterboardCeilingID FROM PlasterboardCeilingList WHERE PlasterboardCeilingDescription = 'As per drawings');
DECLARE @PlasterboardCeilingList_Standard_10mm   int = (SELECT TOP 1 PlasterboardCeilingID FROM PlasterboardCeilingList WHERE PlasterboardCeilingDescription = 'Standard 10mm');
DECLARE @PlasterboardCeilingList_Standard_13mm   int = (SELECT TOP 1 PlasterboardCeilingID FROM PlasterboardCeilingList WHERE PlasterboardCeilingDescription = 'Standard 13mm');
DECLARE @PlasterboardCeilingList_Premium_13mm    int = (SELECT TOP 1 PlasterboardCeilingID FROM PlasterboardCeilingList WHERE PlasterboardCeilingDescription = 'Premium 13mm');

DECLARE @InsulationList_Main_contractor_supply_and_install int = (SELECT TOP 1 InsulationID FROM InsulationList WHERE InsulationDescription = 'Main contractor supply and install');
DECLARE @InsulationList_Subcontractor_supply_and_install   int = (SELECT TOP 1 InsulationID FROM InsulationList WHERE InsulationDescription = 'Subcontractor supply and install');

DECLARE @CeilingBattensList_By_main_contractor        int = (SELECT TOP 1 CeilingBattensID FROM CeilingBattensList WHERE CeilingBattensDescription = 'By main contractor');
DECLARE @CeilingBattensList_By_plasterboard_installer int = (SELECT TOP 1 CeilingBattensID FROM CeilingBattensList WHERE CeilingBattensDescription = 'By plasterboard installer');

DECLARE @TradeList_Cabinetry               int = (SELECT TOP 1 TradeID FROM TradeList WHERE TradeDescription = 'Cabinetry');
DECLARE @TradeList_Carpentry               int = (SELECT TOP 1 TradeID FROM TradeList WHERE TradeDescription = 'Carpentry');
DECLARE @TradeList_Decks                   int = (SELECT TOP 1 TradeID FROM TradeList WHERE TradeDescription = 'Decks');
DECLARE @TradeList_Decorating_and_finishes int = (SELECT TOP 1 TradeID FROM TradeList WHERE TradeDescription = 'Decorating and finishes');
DECLARE @TradeList_Demolition              int = (SELECT TOP 1 TradeID FROM TradeList WHERE TradeDescription = 'Demolition');
DECLARE @TradeList_Drainage                int = (SELECT TOP 1 TradeID FROM TradeList WHERE TradeDescription = 'Drainage');
DECLARE @TradeList_Electrical              int = (SELECT TOP 1 TradeID FROM TradeList WHERE TradeDescription = 'Electrical');
DECLARE @TradeList_Excavation              int = (SELECT TOP 1 TradeID FROM TradeList WHERE TradeDescription = 'Excavation');
DECLARE @TradeList_Exterior_joinery        int = (SELECT TOP 1 TradeID FROM TradeList WHERE TradeDescription = 'Exterior joinery');
DECLARE @TradeList_Flooring                int = (SELECT TOP 1 TradeID FROM TradeList WHERE TradeDescription = 'Flooring');
DECLARE @TradeList_Gas_fitting             int = (SELECT TOP 1 TradeID FROM TradeList WHERE TradeDescription = 'Gas fitting');
DECLARE @TradeList_Heating_and_ventilation int = (SELECT TOP 1 TradeID FROM TradeList WHERE TradeDescription = 'Heating and ventilation');
DECLARE @TradeList_Landscaping             int = (SELECT TOP 1 TradeID FROM TradeList WHERE TradeDescription = 'Landscaping');
DECLARE @TradeList_Plumbing                int = (SELECT TOP 1 TradeID FROM TradeList WHERE TradeDescription = 'Plumbing');
DECLARE @TradeList_Roofing                 int = (SELECT TOP 1 TradeID FROM TradeList WHERE TradeDescription = 'Roofing');
DECLARE @TradeList_Scaffolding             int = (SELECT TOP 1 TradeID FROM TradeList WHERE TradeDescription = 'Scaffolding');
DECLARE @TradeList_Tiling                  int = (SELECT TOP 1 TradeID FROM TradeList WHERE TradeDescription = 'Tiling');
DECLARE @TradeList_Other                   int = (SELECT TOP 1 TradeID FROM TradeList WHERE TradeDescription = 'Other');



-------------------------------------------------------------------------------
-- Insert dummy Client and Company details. Create a dummy project and get IDs

DECLARE @BobTheBuilderID    int;
DECLARE @BobID              int;
DECLARE @ProjectID          int;
DECLARE @BusinessDefaultsID int;

DECLARE @TmpBobTheBuilder    table (ClientID  int);
DECLARE @TmpBob              table (ClientID  int);
DECLARE @TmpProject          table (ProjectID int);
DECLARE @TmpBusinessDefaults table (BusinessDefaultsID int);



-------------------------------------------------------------------------------
-- Add Bob and Bob the Builder as clients.

INSERT INTO ClientDetails (ClientLastName, ClientPassword, ClientEmail)
        OUTPUT inserted.ClientID INTO @TmpBobTheBuilder
        VALUES ('Bob the Builder', 'CanWeFixIt', 'bob.the.builder@company.com');
SET @BobTheBuilderID = (SELECT TOP 1 ClientID  FROM @TmpBobTheBuilder);

INSERT INTO ClientDetails (ClientLastName, ClientPassword, ClientEmail)
        OUTPUT inserted.ClientID INTO @TmpBob
        VALUES ('Bob', 'YesWeCan', 'bob@client.com');
SET @BobID = (SELECT TOP 1 ClientID  FROM @TmpBob);



-------------------------------------------------------------------------------
-- Add business defaults.

INSERT INTO BusinessDefaults (BusinessDefaultsCreatorID, ProjectOwnerOwnerName, ProjectCompanyName, Markup, AdminHoursPerWeek,
                AdminRate, SupervisorHoursPerWeek, SupervisorRate, ProjectManagerHoursPerWeek, ProjectManagerRate,
                BuildTeamRate, RatesAre, SiteSign, PlasterboardLabourBy, PlasterboardCeilingBy,
                Insulation, CeilingBattens, PlumbingRate, ElectricalRate, PainterRate,
                DrainlayerRate, RooferRate)
        OUTPUT inserted.BusinessDefaultsID INTO @TmpBusinessDefaults
        VALUES (@BobID, 'Bob', 'Bob the Builder', 43, 5,
                40, 10, 55, 0, 65,
                55, @RatesList_Cost, @SiteSignList_Yes, @PlasterboardLabourList_Subcontract_plastering_only, @PlasterboardCeilingList_Standard_10mm,
                @InsulationList_Main_contractor_supply_and_install, @CeilingBattensList_By_main_contractor, 80, 80, 50,
                80, 80);
SET @BusinessDefaultsID = (SELECT TOP 1 BusinessDefaultsID FROM @TmpBusinessDefaults);



-------------------------------------------------------------------------------
-- Add project.

INSERT INTO Project (BusinessDefaultsID, ProjectStatus, ProjectName, ProjectAddress, ProjectClientName, NumberOfCarpenters, EstimatedProjectDuration, BuildersContingency, DrainageContingency, PlumbingContingency, ElectricalContingency, SiteAccess, SpaceForMaterialStorage, ScaffoldAccessComment, ScaffoldWrapping, LivingArrangements, IsSeaSprayZone, SiteSecurityFencing, FallInProtection, ToiletHireRequired, VehecleCrossingProtection, ContractorsAllRiskFee, DoorMaterial, DoorStyle, SkirtingMaterial, SkirtingStyle, ScotiaCorniceStyle, ArchitraveMaterial, ArchitraveStyle, PrimaryCladdingMaterial, PrimaryCladdingType, SecondaryCladdingMaterial, JoineryMaterial, JoineryType, RoofType)
        OUTPUT Inserted.ProjectID INTO @TmpProject
        VALUES (@BusinessDefaultsID, 'Awaiting YourQS', 'Demo Reno', 'Demo Renovation', 'Demo Client', 4, 8, 5000, 1000, 1000, 1000, 'Good', 'Plenty of space', 'ok', 'not required', 'Vacated', 'Yes', 'None', 'No', 'Yes', 'Yes', 950, 'MDF PQ	', 'Standard', 'Pine FJ	', 'Bevel 60x10', 'Square Stopped', 'Pine FJ	', 'Bevel 60x10', 'Pine', 'Bevel Back 150x25', 'None', 'Aluminium', 'Double Glazed', 'Corrugated Colour Steel');
SET @ProjectID = (SELECT TOP 1 ProjectID FROM @TmpProject);



-------------------------------------------------------------------------------
-- Add zones and setting up more testing variables.

INSERT INTO ZoneDetails (ProjectID, ZoneName, ZoneDescription)
        VALUES (@ProjectID, 'Kitchen Extension', 'Single story extension to form new kitchen area'),
               (@ProjectID, 'Lounge Extension',  'New lounge and entry, change old entry to guest bedroom, bedroom renovation'),
               (@ProjectID, 'Bed 2',             'New wardrobes to bed 2'),
               (@ProjectID, 'Garage',            'Cupboards in garage, close in laundry.'),
               (@ProjectID, 'Re-roof',           'Option to completely reroof house');

DECLARE @ZoneIDKitchenExtension int = (SELECT MAX(ZoneID) ZoneID FROM ZoneDetails WHERE ZoneName = 'Kitchen Extension');
DECLARE @ZoneIDLoungeExtension  int = (SELECT MAX(ZoneID) ZoneID FROM ZoneDetails WHERE ZoneName = 'Lounge Extension');
DECLARE @ZoneIDBed2             int = (SELECT MAX(ZoneID) ZoneID FROM ZoneDetails WHERE ZoneName = 'Bed 2');
DECLARE @ZoneIDGarage           int = (SELECT MAX(ZoneID) ZoneID FROM ZoneDetails WHERE ZoneName = 'Garage');
DECLARE @ZoneIDReRoof           int = (SELECT MAX(ZoneID) ZoneID FROM ZoneDetails WHERE ZoneName = 'Re-roof');



-------------------------------------------------------------------------------
-- Add zones and setting up more testing variables.

INSERT INTO ZoneTrade (ZoneID, TradeID, TradeDetais, Allowances)
               VALUES (@ZoneIDKitchenExtension, @TradeList_Demolition,              'Remove cladding from end wall and partially demolish roof.  Tarpaulin tempory protection\nExcavate building platform',                                                                                                     NULL),
                      (@ZoneIDKitchenExtension, @TradeList_Carpentry,               'Concrete subfloor.\nTimber framed walls with fibre cement 180x18 weatherboard on timber cavity batten.  Timber truss roof with corrugated colour steel cladding.\nFinger jointed pine 90x10 skirting, 60x10 architraves.', NULL),
                      (@ZoneIDKitchenExtension, @TradeList_Plumbing,                'Plumbing to new kitchen, connect into existing system.', NULL),
                      (@ZoneIDKitchenExtension, @TradeList_Electrical,               'Electrical to new kitchen, connect into existing system. Rangehood, oven and cooktop.  Use standard lighting, client to confirm later.', NULL),
                      (@ZoneIDKitchenExtension, @TradeList_Cabinetry,               'New kitchen units', 25000),
                      (@ZoneIDKitchenExtension, @TradeList_Tiling,                  'Splashback behind sink.', NULL),
                      (@ZoneIDKitchenExtension, @TradeList_Decorating_and_finishes, 'Paint new areas.  Repaint all walls and ceilings in affected rooms.', NULL),
                      (@ZoneIDLoungeExtension, @TradeList_Demolition,              'Remove roof and walls at end of house.\nExcavate for new extension.', NULL),
                      (@ZoneIDLoungeExtension, @TradeList_Carpentry,               'Concrete floor, timber framed walls, fibre cement 180x18 weatherboard, trussed roof with colour steel corrugated cladding. Aluminium joinery.', NULL),
                      (@ZoneIDLoungeExtension, @TradeList_Electrical,              'New electrical lights hot points. Estimate layout, client to confirm later.', NULL),
                      (@ZoneIDLoungeExtension, @TradeList_Cabinetry,               'Window seat', 1000),
                      (@ZoneIDLoungeExtension, @TradeList_Decorating_and_finishes, 'Repaint bed 2 as walls and ceilings change.\nPaint new areas.', NULL),
                      (@ZoneIDBed2, @TradeList_Demolition,              'Partially remove internal walls', NULL),
                      (@ZoneIDBed2, @TradeList_Cabinetry,               'Wardrobe to bed 2', 800),
                      (@ZoneIDBed2, @TradeList_Decorating_and_finishes, 'Repaint affected walls and ceilings only.', NULL),
                      (@ZoneIDGarage, @TradeList_Carpentry,               'Construct small storeroom', NULL),
                      (@ZoneIDGarage, @TradeList_Plumbing,                'Existing', NULL),
                      (@ZoneIDGarage, @TradeList_Electrical,              'Existing', NULL),
                      (@ZoneIDGarage, @TradeList_Cabinetry,               'Laundry cupboards (allow $3,000)', NULL),
                      (@ZoneIDGarage, @TradeList_Decorating_and_finishes, 'Paint changed walls and ceilings.', NULL),
                      (@ZoneIDReRoof, @TradeList_Demolition,              'Remove existing roof cladding.', NULL),
                      (@ZoneIDReRoof, @TradeList_Carpentry,               'Allow 10 hours and $1,000 for potential repairs.', NULL),
                      (@ZoneIDReRoof, @TradeList_Plumbing,                'New gutters and downpipes', NULL),
                      (@ZoneIDReRoof, @TradeList_Decorating_and_finishes, 'Repaint fasia.', NULL);



-------------------------------------------------------------------------------
-- Add work areas and more test variables.

INSERT INTO WorkArea (ProjectID, WorkAreaName, WorkAreaOverview)
               VALUES (@ProjectID, 'Lounge and entry',  'Lounge and entry changes, bed 2 and garage changes'),
                      (@ProjectID, 'Kitchen extension', 'New room for new kitchen'),
                      (@ProjectID, 'Re-roof',           'Remove existing roof and reclad');
                      
DECLARE @WorkAreaIDLoungeAndEntry   int = (SELECT MAX(WorkAreaID) WorkAreaID FROM WorkArea WHERE WorkAreaName = 'Lounge and entry');
DECLARE @WorkAreaIDKitchenExtension int = (SELECT MAX(WorkAreaID) WorkAreaID FROM WorkArea WHERE WorkAreaName = 'Kitchen extension');
DECLARE @WorkAreaIDReRoof           int = (SELECT MAX(WorkAreaID) WorkAreaID FROM WorkArea WHERE WorkAreaName = 'Re-roof');



-------------------------------------------------------------------------------
-- Fill in relationship tables.

-- This should happen manually when a client adds a relationship with another client.
INSERT INTO ClientRelationships (Client1ID, Client2ID)
                VALUES (@BobID, @BobTheBuilderID),
                       (@BobTheBuilderID, @BobID);

-- This should happen when a client maunally adds a zone to a work area.
INSERT INTO WorkAreaZoneRelationships(WorkAreaID, ZoneID)
                VALUES (@WorkAreaIDKitchenExtension, @ZoneIDKitchenExtension),
                       (@WorkAreaIDLoungeAndEntry, @ZoneIDLoungeExtension),
                       (@WorkAreaIDLoungeAndEntry, @ZoneIDBed2),
                       (@WorkAreaIDLoungeAndEntry, @ZoneIDGarage),
                       (@WorkAreaIDLoungeAndEntry, @ZoneIDReRoof);

-- This should happen automaticall and manually when a client adds a new project or is granted access.
INSERT INTO ClientProjectRelationships (ProjectID, ClientID)
                VALUES (@ProjectID, @BobID);



-------------------------------------------------------------------------------

EXEC sp_MSForEachTable 'SELECT * FROM ?', @whereand = 'AND Object_id IN (SELECT Object_id FROM sys.objects WHERE name NOT LIKE ''%List'')';