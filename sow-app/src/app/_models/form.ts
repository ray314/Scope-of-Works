/**
 * An interface for the JSON data in businessDefaults
 */
export interface BusinessDefaults {
  companyName: any;
  yourName: any;
  // People and pricing
  peoplePricing: {
    markup: any,
    adminHours: any,
    supervisionHours: any,
    projectMHours: any,
    buildingTeamHours: any,
    // CPH - cost per hour
    adminCPH: any,
    supervisionCPH: any,
    // M - Management
    projectMCPH: any,
    // T - Team
    buildingTCPH: any,
    // Rates are:
    ratesAre: any
  };
  // Site Sign
  siteSign: any,
  // Sub Trades
  subTrades: {
    plasterboardLabourBy: any,
    plasterboardCeilingDefault: any,
    insulation: any,
    ceilingBattens: any
  };
  // Job rates
  jobRates: {
    plumber: any,
    electrician: any,
    painter: any,
    drainlayer: any,
    roofer: any
  };
}

/**
 * An interface for the JSON data in projectSettings
 */
export interface ProjectSettings {
  address: string,
  client: string,
  projectDescription: string,

  peoplePricing: {
    nCarpenters: number,
    eProjectDuration: number, // Estimated project duration
    bContingency: number, // Builders contingency
    dContingency: number, // Drainage contingency
    pContingency: number, // Plumbing contingency
    eContingency: number, // Electrical contingency
    cContingency: number // Client contingency allowance
  };

  siteArrangement: {
    siteAccess: string, // Site Access
    spaceStorage: string, // Space for material storage
    scaffoldAComment: string, // Scaffold access comment
    sWrapping: string, // Scaffold Wrapping
    livingArrange: string, // Living Arrangements
    addHours: number, // Allow additonal hours due to site
    seasprayzone: string  // Is Sea Spray Zone?
  };

  safetyRequirements: {
    siteSecurityFencing: string, // Site Security Fencing
    fallInProtection: string, // Fall In Protection
    toiletHireRequired: string, // Toilet Hire Required
    vehicleCrossingProtect: string // Vehicle Crossing Protection
  };

  allowancesInsurances: {
    contractorsRiskFee: number,
    buildingGuaranteeFee: number
  };

  professionalServices: {
    drawings: number,
    geotechnical: number,
    engineering: number,
    landSurveyor: number,
    councilFees: number,
    other: number,
    comment: string
  };

  interior: {
    material: {
      doors: string,
      skirting: string,
      scotia: string, // Scotia/Cornice
      architrave: string
    };

    style: {
      doors: string,
      skirting: string,
      scotia: string, // Scotia/Cornice
      architrave: string
    }
  };

  exterior: {
    material: {
      primaryCladding: string,
      secondaryCladding: string,
      joineryType: string,
      roof: string
    },

    type: {
      primaryCladding: string,
      secondaryCladding: string,
      joineryType: string,
      roof: string
    }
  };

  otherComments: string
}

/**
 * An interface for the JSON data in zone
 */
export interface Zone {
  name: string;
  trades: any;
  workArea: any;
}

/** 
 * An interface for trade inside a zone
 */
export interface Trade {
  description: string,
  trade: string,
  detail: string,
  allowance: string
}

/**
 * An interface for the JSON data in workArea
 */
export interface WorkArea {
  name: string;
  overview: string;
  zones: any;
}