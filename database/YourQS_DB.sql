-------------------------------------------------------------------------------
-- Script for making base tables in the database.

-- If the Node.js code isn't able to connect, check that the server is using SQL Authentication.
-- To check SQL Authentication go Object Explorer > right-click the primary database, e.g. 'DESKTOP-*******' > Properties > Security in left menu > 'Server Authentication mode' should be set to 'SQL Server and Windows Authentication mode'

-- Another likely problem is that the login account might not have access to the YourQS database.
-- To check your account has access to the database go Object Explorer > expand primary database, e.g. 'DESKTOP-*******' > expand 'Security' > expand 'Logins' > right-click 'studentaccess' (or the created login) > Properties > User Mapping in left menu > check under Map that YourQS is ticked (or the expected database).

-- Another possible error is no password access.
-- To check there's password access go to Object Explorer > expand primary database, e.g. 'DESKTOP-*******' > expand 'Security' > expand 'Logins' > right-click 'studentaccess' (or the created login) > Properties > Status in left menu > Login should be set to 'Enabled'.

SET noexec off; -- Testing may turn this off, it should always go on before the file ends but this is clarity.
DECLARE @TestDeleteDatabaseAndRecreateItForTesting AS int = 1; -- Set to 1 to do database restarting.
DECLARE @TestCreateLogin AS int = 0; -- Set to 1 to create test_login with test_password. If the database is reset then we create the login again regardless.
DECLARE @TestDoWarnings AS int = 1; -- For checking TCP port, static address, etc.



-------------------------------------------------------------------------------
-- This section will only do things one time when the database is setup unless you set testing variables to recreate things.

IF @TestDeleteDatabaseAndRecreateItForTesting = 1
BEGIN
  PRINT('TESTING: Restarting the database. You may need to refresh the Object Explorer in SSMS.');
  PRINT('TESTING: Your may need to give permissions to accounts to restore their access.');

  IF DB_ID('YourQS') IS NOT NULL
  BEGIN
    -- Make sure we aren't using YourQS, set YourQS to be offline temporarily to kick remaining users, drop YourQS.
    USE master;
    ALTER DATABASE YourQS SET OFFLINE WITH ROLLBACK IMMEDIATE;
    ALTER DATABASE YourQS SET ONLINE;
    DROP DATABASE YourQS;
  END
END


DECLARE @DidCreateDataBase AS int = 0; -- This is used after our testing scripts to diasble creating tables if the database already existed.
IF DB_ID('YourQS') IS NULL
BEGIN
  PRINT('Database not setup. Creating YourQS database.');
  SET @DidCreateDataBase = 1;
  CREATE DATABASE YourQS;
END


IF @TestDoWarnings = 1
BEGIN
  -- Warn about TCP settings.
  IF EXISTS (SELECT TOP 1 T.value_data FROM sys.dm_server_registry T WHERE T.value_data = 0 AND T.value_name = 'Enabled' AND T.registry_key LIKE '%Tcp')
  BEGIN
    PRINT('TESTING: WARNING: TCP may be disabled. Check SQL Server Configuration Manager > SQL Server Network Configuration > Protocols for MSSQLSERVER > TCP/IP > Enabled: Yes.');
  END

  -- -- Warn about port number.
  -- IF NOT EXISTS (SELECT TOP 1 T.local_tcp_port FROM sys.dm_exec_connections T WHERE T.local_tcp_port = 3080)
  -- BEGIN
  --   PRINT('TESTING: WARNING: TPC port 3080 was listed as being the targeted port, but there are no active connections. Either no client has successfully connected, or the tpc port is not 3080. Check SQL Server Configuration Manager > SQL Server Network Configuration > Protocols for MSSQLSERVER > TCP/IP > IP Addresses > IPALL: TCP Dynamic Ports: <blank>, TPC Port: 3080.');
  -- END

  PRINT('Finished checking for warnings.');
END


IF @TestCreateLogin = 1 OR @TestDeleteDatabaseAndRecreateItForTesting = 1
BEGIN
  IF @TestCreateLogin = 1
  BEGIN
    PRINT('TESTING: Creating the login for studentaccess.');
  END
  ELSE
  BEGIN
    PRINT('TESTING: Creating the login for studentaccess because the database was reset.');
  END

  USE YourQS;
  DROP USER IF EXISTS studentaccess;

  USE master;
  IF EXISTS (SELECT TOP 1 name FROM master.sys.server_principals WHERE name = 'studentaccess')
  BEGIN
    DROP LOGIN studentaccess;
  END
  CREATE LOGIN studentaccess WITH PASSWORD = '@ccess1'; -- Does it matter where we create the login from?

  USE YourQS;
  CREATE USER studentaccess FOR LOGIN studentaccess;
  ALTER USER studentaccess WITH DEFAULT_SCHEMA = YourQS;
END


IF @DidCreateDataBase = 0
BEGIN
  PRINT('Database already setup. The script will not run.');
  -- Super not impressive code here. SQL Server doesn't seem to have any way to stop a script without RAISERROR
  -- which causes side effects, or using GOTO which doesn't work between multiple batch transactions (when GO is used).
  -- So instead we get this weird work around where you disable execution then enable it at the bottom of the file.
  -- We do want to use multiple batch transactions inside this file so if anyone changes this, make sure it works with that.
  SET noexec on;
END


GO



-------------------------------------------------------------------------------

USE YourQS;



-------------------------------------------------------------------------------
-- Reference list tables - these store mostly static values for things like drop-down menus.

CREATE TABLE RatesList (
  RatesID int IDENTITY(1, 1) UNIQUE NOT NULL,
  RatesDescription char(50) UNIQUE NOT NULL,

  PRIMARY KEY (RatesID),
);

CREATE TABLE SiteSignList (
  SiteSignID int IDENTITY(1, 1) UNIQUE NOT NULL,
  SiteSignDescription char(50) UNIQUE NOT NULL,

  PRIMARY KEY (SiteSignID),
);

CREATE TABLE PlasterboardLabourList (
  PlasterboardLabourID int IDENTITY(1, 1) UNIQUE NOT NULL,
  PlasterboardLabourDescription char(50) UNIQUE NOT NULL,

  PRIMARY KEY (PlasterboardLabourID),
);

CREATE TABLE PlasterboardCeilingList (
  PlasterboardCeilingID int IDENTITY(1, 1) UNIQUE NOT NULL,
  PlasterboardCeilingDescription char(50) UNIQUE NOT NULL,

  PRIMARY KEY (PlasterboardCeilingID),
);

CREATE TABLE InsulationList (
  InsulationID int IDENTITY(1, 1) UNIQUE NOT NULL,
  InsulationDescription char(50) UNIQUE NOT NULL,

  PRIMARY KEY (InsulationID),
);

CREATE TABLE CeilingBattensList (
  CeilingBattensID int IDENTITY(1, 1) UNIQUE NOT NULL,
  CeilingBattensDescription char(50) UNIQUE NOT NULL,

  PRIMARY KEY (CeilingBattensID),
);

CREATE TABLE TradeList (
  TradeID int IDENTITY(1, 1) UNIQUE NOT NULL,
  TradeDescription char(50) UNIQUE NOT NULL,

  PRIMARY KEY (TradeID),
);



-------------------------------------------------------------------------------
-- Primary tables.

CREATE TABLE ClientDetails (
  -- Name and Password are SQL keywords so we prefix everything with Client... Why are there so many keywords with no prefix?
  ClientID int IDENTITY(1, 1) UNIQUE NOT NULL,
  ClientName varchar(100),
  ClientLastName varchar(100) NOT NULL,
  ClientPassword varchar(100) NOT NULL,
  ClientEmail varchar(100) NOT NULL, -- Force email for simplicity for YourQS's communication with business.
  ClientPhoneNumber varchar(50), -- Intentionally overkill, specifically varchar so storage is fine, phone prefix/suffix/regional-things are weird.

  PRIMARY KEY (ClientID),
);

CREATE TABLE BusinessDefaults (
  BusinessDefaultsID int IDENTITY(1, 1) UNIQUE NOT NULL,
  BusinessDefaultsCreatorID int NOT NULL, -- The BusinessDefaults being shared through projects and ClientProjectRelationships will likely be considered bad for personal information so we also track the original creator in case it needs to be restricted.
  ProjectOwnerOwnerName varchar(100) NOT NULL, -- Arbitrary name for appearing on reports.
  ProjectCompanyName varchar(100) NOT NULL, -- Arbitrary name for appearing on reports.
  
  -- People and Pricing.
  Markup int,
  RatesAre int NOT NULL,
  AdminHoursPerWeek int,
  AdminRate int,
  SupervisorHoursPerWeek int,
  SupervisorRate int,
  ProjectManagerHoursPerWeek int,
  ProjectManagerRate int,
  BuildTeamRate int,
  SiteSign int NOT NULL,

  -- Sub Trades.
  PlasterboardLabourBy int NOT NULL,
  PlasterboardCeilingBy int NOT NULL,
  Insulation int NOT NULL,
  CeilingBattens int NOT NULL,
  PlumbingRate int,
  ElectricalRate int,
  PainterRate int,
  DrainlayerRate int,
  RooferRate int,

  PRIMARY KEY (BusinessDefaultsID),
  FOREIGN KEY (BusinessDefaultsCreatorID) REFERENCES ClientDetails(ClientID),

  FOREIGN KEY (RatesAre) REFERENCES RatesList(RatesID),
  FOREIGN KEY (SiteSign) REFERENCES SiteSignList(SiteSignID),

  FOREIGN KEY (PlasterboardLabourBy) REFERENCES PlasterboardLabourList(PlasterboardLabourID),
  FOREIGN KEY (PlasterboardCeilingBy) REFERENCES PlasterboardCeilingList(PlasterboardCeilingID),
  FOREIGN KEY (Insulation) REFERENCES InsulationList(InsulationID),
  FOREIGN KEY (CeilingBattens) REFERENCES CeilingBattensList(CeilingBattensID),
);

CREATE TABLE Project (
  ProjectID int IDENTITY(1, 1) NOT NULL,
  BusinessDefaultsID int NOT NULL,
  ProjectStatus varchar(50) NOT NULL, -- Automatically/Manually set by YourQS. Clients don't set this.
  OpenDate datetime DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Internal for YourQS. Automatic data for when YourQS's project opens; not the physical project.
  CloseDate datetime, -- Internal for YourQS. NULL while the project is open.

  -- Generated reports are stored in the file system.
  -- The GeneratedClientReportValid and GeneratedCompanyReportValid fields are NULL or 0 for invalid, and 1 for valid.
  -- Only search the file system when they are valid. The Valid field is set to false when information is changed.
  -- File names should always be "report_<ProjectID>_client.pdf" or "report_<ProjectID>_company.pdf".
  GeneratedClientReportValid bit,
  GeneratedClientReportFileName varchar(50),
  GeneratedCompanyReportValid bit,
  GeneratedCompanyReportFileName varchar(50),

  -- Address, Client, and Project Description.
  ProjectName varchar(100) NOT NULL, -- Arbitrary name used for clients to ID their projects on YourQS's systems.
  ProjectAddress varchar(100),
  ProjectClientName varchar(100), -- Arbitrary name for appearing on the client report, use BusinessDefaults ProjectCompanyName for vusiness reports.
  ProjectDescription varchar(100), -- Brief description, comments go in OtherComments.

  -- People and Pricing.
  NumberOfCarpenters int,
  EstimatedProjectDuration int, -- Estimated time is in weeks. It does not relate to YourQS's internal project OpenDate or CloseDate.
  BuildersContingency int,
  DrainageContingency int,
  PlumbingContingency int,
  ElectricalContingency int,
  ClientContingencyAllowance int,

  -- Site Arrangement.
  SiteAccess varchar(50),
  SpaceForMaterialStorage varchar(50),
  ScaffoldAccessComment varchar(50),
  ScaffoldWrapping varchar(50),
  LivingArrangements varchar(50),
  AllowAdditionalHoursDueToSite int,
  IsSeaSprayZone varchar(50), -- It's a yes/no question but more info may be helpful.
  
  -- Saftey Requirements.
  SiteSecurityFencing varchar(50), -- It's a yes/no question but more info may be helpful.
  FallInProtection varchar(50), -- It's a yes/no question but more info may be helpful.
  ToiletHireRequired varchar(50), -- It's a yes/no question but more info may be helpful.
  VehecleCrossingProtection varchar(50), -- It's a yes/no question but more info may be helpful.
  
  -- Allowance and Insurances.
  ContractorsAllRiskFee int,
  BuildingGuaranteeFee int,

  -- Professional Services.
  Drawings int,
  Geotechnical int,
  Engineering int,
  LandSurveyor int,
  CouncilFees int,
  -- OtherProfessionalServices is a different table.
  
  -- Interior, Material and Style.
  DoorMaterial varchar(100),
  DoorStyle varchar(100),
  SkirtingMaterial varchar(100),
  SkirtingStyle varchar(100),
  ScotiaCorniceMaterial varchar(100),
  ScotiaCorniceStyle varchar(100),
  ArchitraveMaterial varchar(100),
  ArchitraveStyle varchar(100),
  
  -- Exterior, Material and Type.
  PrimaryCladdingMaterial varchar(100),
  PrimaryCladdingType varchar(100),
  SecondaryCladdingMaterial varchar(100),
  SecondaryCladdingType varchar(100),
  JoineryMaterial varchar(100),
  JoineryType varchar(100),
  RoofPitch decimal(5, 2), -- Allow for XXX_XX
  RoofType varchar(100),
  
  -- Other Comments.
  OtherCommentsCost int,
  OtherComments varchar(1000),

  PRIMARY KEY (ProjectID),
  FOREIGN KEY (BusinessDefaultsID) REFERENCES BusinessDefaults(BusinessDefaultsID)
);

CREATE TABLE OtherProfessionalServices (
  OtherProfessionalServiceID int IDENTITY(1, 1) UNIQUE NOT NULL,
  ProjectID int NOT NULL,
  ServiceCost int,
  ServiceName varchar(100) NOT NULL, -- YourQS didn't require this in their old system but it seems obvious enough for use to force it.
  ServiceComment varchar(500),

  PRIMARY KEY (OtherProfessionalServiceID),
  FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID),
);

CREATE TABLE WorkArea (
  WorkAreaID int IDENTITY(1, 1) UNIQUE NOT NULL,
  ProjectID int NOT NULL,
  WorkAreaName varchar(100) NOT NULL,
  WorkAreaOverview varchar(1000),

  PRIMARY KEY (WorkAreaID),
  FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID),
);

-- Zone is a keyword... use ZoneDetails. SQL please stop stealing our names ;-;
CREATE TABLE ZoneDetails (
  ZoneID int IDENTITY(1, 1) UNIQUE NOT NULL,
  ProjectID int NOT NULL,
  ZoneName varchar(100) NOT NULL, -- Do we want to allow anonymous zones?
  ZoneDescription varchar(500),

  PRIMARY KEY (ZoneID),
  FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID),
);

CREATE TABLE ZoneTrade (
  ZoneTradeID int IDENTITY(1, 1) UNIQUE NOT NULL, -- This ID will probably be the fastest increasing ID in the database. Still, 2 billion is good.
  ZoneID int NOT NULL,
  TradeID int NOT NULL,
  TradeDetais varchar(500),
  Allowances int,

  PRIMARY KEY (ZoneTradeID),
  FOREIGN KEY (ZoneID) REFERENCES ZoneDetails(ZoneID),
  FOREIGN KEY (TradeID) REFERENCES TradeList(TradeID),
  CONSTRAINT NC_ZoneTrade CHECK (TradeDetais IS NOT NULL OR Allowances IS NOT NULL),
)

CREATE TABLE ZoneImage (
  ImageID int IDENTITY(1, 1) UNIQUE NOT NULL,
  ZoneID int NOT NULL,
  ImageFileName varchar(50) NOT NULL,

  PRIMARY KEY (ImageID),
  FOREIGN KEY (ZoneID) REFERENCES ZoneDetails(ZoneID),
);



-------------------------------------------------------------------------------
-- Relationship tables for linking things and possibly managing relationship data.

CREATE TABLE ClientRelationships (
  Client1ID int NOT NULL,
  Client2ID int NOT NULL,
  -- In future there may be fields wanted here such as who initiated the relationship, if it's ongoing, who ended it, when it started/stopped, is Client1 an employee of Client2, etc.
  -- Be aware that since both keys must be unique, any relationship must be expressable in one entry. For example one client may be both the worker and company for another client.

  PRIMARY KEY (Client1ID, Client2ID),
  FOREIGN KEY (Client1ID) REFERENCES ClientDetails(ClientID),
  FOREIGN KEY (Client2ID) REFERENCES ClientDetails(ClientID),
  CONSTRAINT UC_ClientRelationships UNIQUE (Client1ID, Client2ID),
);

CREATE TABLE ClientProjectRelationships (
  ProjectID int NOT NULL,
  ClientID int NOT NULL,
  AccessRights int, -- This will be required if we get around to sharing projects. Leaving as NULL so it's easy to refactor.

  PRIMARY KEY (ProjectID, ClientID),
  FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID),
  FOREIGN KEY (ClientID) REFERENCES ClientDetails(ClientID),
  CONSTRAINT UC_ClientProjectRelationships UNIQUE (ProjectID, ClientID),
);

CREATE TABLE WorkAreaZoneRelationships (
  WorkAreaID int NOT NULL,
  ZoneID int NOT NULL,

  PRIMARY KEY (WorkAreaID, ZoneID),
  FOREIGN KEY (WorkAreaID) REFERENCES WorkArea(WorkAreaID),
  FOREIGN KEY (ZoneID)REFERENCES ZoneDetails(ZoneID),
  CONSTRAINT UC_WorkAreaZoneRelationships UNIQUE (WorkAreaID, ZoneID),
);



-------------------------------------------------------------------------------
-- Ugly triggers to auto incriment compisite primary keys.
-- These are really ugly so it might be better to do this outside the database.
-- Some time has passed since that^ comment. I've decided to disable the triggers.

--DROP TRIGGER IF EXISTS T_ProfessionalServices_OtherProfessionalServices_OtherProfessionalServiceID;
--DROP TRIGGER IF EXISTS T_ZoneTrade_ZoneSubID;
--GO



--CREATE TRIGGER T_ZoneTrade_ZoneSubID
--ON ZoneTrade 
--INSTEAD OF INSERT 
--AS
--BEGIN
--  DECLARE @TmpZoneID int;
--  DECLARE @TmpTradeID int;
--  DECLARE @TmpDetail varchar(1000);
--  DECLARE @TmpAllowances int;

--  IF @@ROWCOUNT = 1
--  BEGIN
--    SELECT @TmpZoneID     = ZoneID     FROM INSERTED;
--    SELECT @TmpTradeID    = TradeID    FROM INSERTED;
--    SELECT @TmpDetail     = Detail     FROM INSERTED;
--    SELECT @TmpAllowances = Allowances FROM INSERTED;
    
--    DECLARE @TmpMaxIndex int = 0;
--    SELECT @TmpMaxIndex = T.ZoneSubID FROM ZoneTrade T WHERE (T.ZoneID = @TmpZoneID AND T.ZoneSubID >= @TmpMaxIndex);
--    SET @TmpMaxIndex += 1
    
--    INSERT INTO ZoneTrade (ZoneID,     ZoneSubID,    TradeID,     Detail,     Allowances) 
--                   VALUES (@TmpZoneID, @TmpMaxIndex, @TmpTradeID, @TmpDetail, @TmpAllowances);
--  END
--  ELSE
--  BEGIN
--    -- People need to be a SQL scholars to do a simple query on a trigger. I don't have time for this rn.
--    INSERT INTO ZoneTrade (ZoneID,     ZoneSubID,    TradeID,     Detail,                                          Allowances) 
--                   VALUES (@TmpZoneID, @TmpMaxIndex, @TmpTradeID, 'ERROR: Multi-value insert. Data has been lost', @TmpAllowances);
--  END
--END
--GO



--CREATE TRIGGER T_ProfessionalServices_OtherProfessionalServices_OtherProfessionalServiceID
--ON ProfessionalServices_OtherProfessionalServices 
--INSTEAD OF INSERT 
--AS
--BEGIN
--  DECLARE @TmpProjectID int;
--  DECLARE @TmpServiceCost int;
--  DECLARE @TmpServiceComment varchar(1000);

--  IF @@ROWCOUNT = 1
--  BEGIN
--    SELECT @TmpProjectID      = ProjectID      FROM INSERTED;
--    SELECT @TmpServiceCost    = ServiceCost    FROM INSERTED;
--    SELECT @TmpServiceComment = ServiceComment FROM INSERTED;
    
--    DECLARE @TmpMaxIndex int = 0;
--    SELECT @TmpMaxIndex = T.OtherProfessionalServiceID FROM ProfessionalServices_OtherProfessionalServices T WHERE (T.ProjectID = @TmpProjectID AND T.OtherProfessionalServiceID >= @TmpMaxIndex);
--    SET @TmpMaxIndex += 1
    
--    INSERT INTO ProfessionalServices_OtherProfessionalServices (ProjectID,     OtherProfessionalServiceID,   ServiceCost,     ServiceComment) 
--                                                        VALUES (@TmpProjectID, @TmpMaxIndex,                 @TmpServiceCost, @TmpServiceComment);
--  END
--  ELSE
--  BEGIN
--    -- People need to be a SQL scholars to do a simple query on a trigger. I don't have time for this rn.
--    INSERT INTO ProfessionalServices_OtherProfessionalServices (ProjectID,     OtherProfessionalServiceID,   ServiceCost,     ServiceComment) 
--                                                        VALUES (@TmpProjectID, @TmpMaxIndex,                 @TmpServiceCost, 'ERROR: Multi-value insert. Data has been lost');
--  END
--END
--GO



GO
SET noexec off