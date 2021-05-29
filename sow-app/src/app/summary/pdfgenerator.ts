import { FormArray, FormGroup } from '@angular/forms';
import { DocumentProperties, jsPDF, jsPDFOptions } from 'jspdf';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas'
import { convertImgToBase64URL } from './base64';
import { BusinessDefaults, ProjectSettings, WorkArea, Zone } from '../_models/form';

// jsPDF isn't as strict as it should be for many things. Their types aren't convenient for us anyway, so we make our own.
type TextFormat = {
  size: number,
  font: string,
  bold: 'normal' | 'bold',

  leadingSpaceY: number,
  trailingSpaceY: number,

  leadingNewline?: boolean,
  trailingNewline?: boolean,
  margin: number,
}

type PDFFormat = {
  document: jsPDF,
  documentX: number,
  documentY: number,

  currentSpaceY: number,
  documentHeaderFooterSpaceY: number,

  lineWidth: number,
  lineStartX: number,
  lineEndX: number,
  lineTrailingSpaceY: number,

  text: TextFormat,
  textValue: TextFormat,
  majorHeading: TextFormat,
  majorHeadingValue: TextFormat,
  heading: TextFormat,
  headingValue: TextFormat,
  subHeading: TextFormat,
  subHeadingValue: TextFormat,
}

export class PDFGenerator {

  getDefaultFormatter(title: string, subject: string, imageData: any): PDFFormat {
    // NOTE: A4 paper is 210mm * 297mm.
    let doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    doc.setProperties({
      title: 'YourQS Client Report',
      subject: 'YourQS Client Report',
      author: 'YourQS',
      keywords: 'yourqs, qs, client, report, pdf',
      creator: 'YourQS',
    });

    // Giant type to declare all variables used for different things.
    let formatter: PDFFormat = {
      document: doc,
      documentX: 210,
      documentY: 297,
      currentSpaceY: 11.5,
      lineWidth: 0.67,
      lineStartX: 11.5,
      lineEndX: 210 - 11.5 * 2,
      lineTrailingSpaceY: 2,
      documentHeaderFooterSpaceY: 15,
      text: {
        size: 11,
        font: 'times',
        bold: 'normal',
        leadingSpaceY: 2.4,
        trailingSpaceY: 2,
        leadingNewline: true,
        margin: 11.5, // The random indent is +3.
      },
      textValue: {
        size: 11,
        font: 'times',
        bold: 'normal',
        leadingSpaceY: 2.4,
        trailingSpaceY: 2,
        leadingNewline: true,
        margin: 72, // This is 155 once the description is added.
      },
      majorHeading: {
        size: 17,
        font: 'times',
        bold: 'bold',
        leadingSpaceY: 7,
        trailingSpaceY: 1,
        leadingNewline: true,
        trailingNewline: true,
        margin: 11.5,
      },
      majorHeadingValue: {
        size: 17,
        font: 'times',
        bold: 'normal',
        leadingSpaceY: 7,
        trailingSpaceY: 1,
        leadingNewline: true,
        trailingNewline: true,
        margin: 11.5,
      },
      heading: {
        size: 15,
        font: 'times',
        bold: 'bold',
        leadingSpaceY: 5,
        trailingSpaceY: 1,
        leadingNewline: true,
        trailingNewline: true,
        margin: 11.5,
      },
      headingValue: {
        size: 15,
        font: 'times',
        bold: 'normal',
        leadingSpaceY: 5,
        trailingSpaceY: 1,
        trailingNewline: true,
        margin: 72,
      },
      subHeading: {
        size: 12,
        font: 'times',
        bold: 'bold',
        leadingSpaceY: 2.7,
        trailingSpaceY: 2,
        leadingNewline: true,
        trailingNewline: true,
        margin: 11.5,
      },
      subHeadingValue: {
        size: 12,
        font: 'times',
        bold: 'bold',
        leadingSpaceY: 2.7,
        trailingSpaceY: 2,
        leadingNewline: true,
        trailingNewline: true,
        margin: 72,
      },
    };

    formatter.document.addImage(imageData, "PNG", 136, 3, 40, 20);
    formatter.document.output();

    formatter.document.setDrawColor(51, 118, 179);
    formatter.document.setLineWidth(formatter.lineWidth);

    return formatter;
  }

  asString<T>(value: T) {
    if (value === undefined || value === null) {
      return '';
    } else if (typeof value === 'string') {
      return value;
    } else if (typeof value === 'number') {
      return '' + value;
    } else if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    } else { // We don't want to randomly print tables/objects/functions/etc.
      return '';
    }
  };

  addText(format: PDFFormat, textFormat: TextFormat, text: any, other: any = null) {
    if (textFormat.leadingNewline) {
      format.currentSpaceY += textFormat.leadingSpaceY;
    }

    if (format.currentSpaceY >= format.documentY - format.documentHeaderFooterSpaceY) {
      format.document.addPage();
      format.document.setDrawColor(51, 118, 179);
      format.document.setLineWidth(format.lineWidth);
      format.currentSpaceY = format.documentHeaderFooterSpaceY;
    }

    if (text !== undefined && text !== null) {
      text = this.asString(text);
    } else if (other !== undefined && other !== null) {
        text = this.asString(other);
    } else {
      text = '';
    }

    format.document.setFontSize(textFormat.size);
    format.document.setFont(textFormat.font, textFormat.bold);
    format.document.text(text, textFormat.margin, format.currentSpaceY);

    if (textFormat.trailingNewline) {
      format.currentSpaceY += textFormat.trailingSpaceY;
    }
  }

  addLine(format: PDFFormat, lineStart: number, lineStop: number) {
    format.currentSpaceY += format.lineWidth;

    if (format.currentSpaceY >= format.documentY - format.documentHeaderFooterSpaceY) {
      format.document.addPage();
      format.document.setDrawColor(51, 118, 179);
      format.document.setLineWidth(format.lineWidth);
      format.currentSpaceY = format.documentHeaderFooterSpaceY;
    }

    format.document.line(lineStart, format.currentSpaceY, lineStop, format.currentSpaceY + format.lineWidth);
    
    format.currentSpaceY += format.lineTrailingSpaceY;
  }

  generateClientReport(
    projectSettings: ProjectSettings,
    // area:FormGroup,
    zones: Zone[],
    workAreas: WorkArea[],
    imageData: any
  ): void {

    let f = this.getDefaultFormatter('YourQS Client Report', 'YourQS Client Report', imageData);

    // ----------------------------------------------------------------------------------------------------
    // Project Summary for Client

    this.addText(f, f.majorHeading, 'Project Summary for Client');
    this.addLine(f, f.lineStartX, f.lineEndX);

    f.heading.trailingNewline = false;
    f.headingValue.trailingNewline = true;
    this.addText(f, f.heading, 'Address');
    this.addText(f, f.headingValue, projectSettings.address);
    this.addText(f, f.heading, 'Client');
    this.addText(f, f.headingValue, projectSettings.client);
    f.heading.trailingNewline = true;
    f.headingValue.trailingNewline = true;

    // ----------------------------------------------------------------------------------------------------
    // Project Defaults

    this.addText(f, f.majorHeading, 'Project Defaults');
    this.addLine(f, f.lineStartX, f.lineEndX);
    
    // --------------------------------------------------
    // Site Arrangement

    this.addText(f, f.subHeading, 'Site Arrangement');
    this.addLine(f, f.lineStartX, f.textValue.margin);
    
    f.text.margin += 3;

    var siteArrangement = projectSettings.siteArrangement;
    this.addText(f, f.text, 'Site Access');
    this.addText(f, f.textValue, siteArrangement.siteAccess);
    this.addText(f, f.text, 'Space for material storage');
    this.addText(f, f.textValue, siteArrangement.spaceStorage);
    this.addText(f, f.text, 'Scaffold access comment');
    this.addText(f, f.textValue, siteArrangement.scaffoldAComment);
    this.addText(f, f.text, 'Scaffold Wrapping');
    this.addText(f, f.textValue, siteArrangement.sWrapping);
    this.addText(f, f.text, 'Living Arrangements');
    this.addText(f, f.textValue, siteArrangement.livingArrange);
    this.addText(f, f.text, 'Allow additonal hours due to site');
    this.addText(f, f.textValue, siteArrangement.addHours);
    this.addText(f, f.text, 'Is Sea Spray Zone?');
    this.addText(f, f.textValue, siteArrangement.seasprayzone);

    // --------------------------------------------------
    // Safety Requirements

    this.addText(f, f.subHeading, 'Safety Requirements');
    this.addLine(f, f.lineStartX, f.textValue.margin);

    var safetyRequirements = projectSettings.safetyRequirements;
    this.addText(f, f.text, 'Site Security Fencing');
    this.addText(f, f.textValue, safetyRequirements.siteSecurityFencing);
    this.addText(f, f.text, 'Fall In Protection');
    this.addText(f, f.textValue, safetyRequirements.fallInProtection);
    this.addText(f, f.text, 'Toilet Hire Required');
    this.addText(f, f.textValue, safetyRequirements.toiletHireRequired);
    this.addText(f, f.text, 'Vehicle Crossing Protection');
    this.addText(f, f.textValue, safetyRequirements.vehicleCrossingProtect);

    // --------------------------------------------------
    // Interior

    this.addText(f, f.subHeading, 'Interior');
    this.addLine(f, f.lineStartX, f.textValue.margin);

    var in_mat = projectSettings.interior.material;
    var in_sty = projectSettings.interior.style;
    this.addText(f, f.text, 'Doors');
    this.addText(f, f.textValue, this.asString(in_mat.doors) + ' ' + this.asString(in_sty.doors));
    this.addText(f, f.text, 'Skirting');
    this.addText(f, f.textValue, this.asString(in_mat.skirting) + ' ' + this.asString(in_sty.skirting));
    this.addText(f, f.text, 'Scotia/Cornice');
    this.addText(f, f.textValue, this.asString(in_mat.scotia) + ' ' + this.asString(in_sty.scotia));
    this.addText(f, f.text, 'Architrave');
    this.addText(f, f.textValue, this.asString(in_mat.architrave) + ' ' + this.asString(in_sty.architrave));

    // --------------------------------------------------
    // Exterior

    this.addText(f, f.subHeading, 'Exterior');
    this.addLine(f, f.lineStartX, f.textValue.margin);

    var ext_mat = projectSettings.exterior.material;
    var ext_typ = projectSettings.exterior.type;
    this.addText(f, f.text, 'Primary Cladding');
    this.addText(f, f.textValue, this.asString(ext_mat.primaryCladding) + ' ' + this.asString(ext_typ.primaryCladding));
    this.addText(f, f.text, 'Secondary Cladding');
    this.addText(f, f.textValue, this.asString(ext_mat.secondaryCladding) + ' ' + this.asString(ext_typ.secondaryCladding));
    this.addText(f, f.text, 'Joinery Type');
    this.addText(f, f.textValue, this.asString(ext_mat.joineryType) + ' ' + this.asString(ext_typ.joineryType));
    this.addText(f, f.text, 'Roof');
    this.addText(f, f.textValue, this.asString(ext_mat.roof) + ' ' + this.asString(ext_typ.roof));
    this.addText(f, f.text, 'Other Comments');
    this.addText(f, f.textValue, projectSettings.otherComments);

    // ----------------------------------------------------------------------------------------------------
    // Work Area Breakdown
    
    f.text.margin -= 3;

    this.addText(f, f.heading, 'Work Area Breakdown');
    this.addLine(f, f.lineStartX, f.lineEndX);

    for (let area of workAreas) {
      this.addText(f, f.text, area.name);
      this.addText(f, f.textValue, area.overview);
    }

    // ----------------------------------------------------------------------------------------------------
    // Summary By Trade

    this.addText(f, f.heading, 'Summary By Trade');
    this.addLine(f, f.lineStartX, f.lineEndX);

    f.subHeading.trailingNewline = false;
    this.addText(f, f.subHeading, 'Trade');
    f.subHeading.trailingNewline = true;
    f.subHeadingValue.leadingNewline = false;
    this.addText(f, f.subHeadingValue, 'Detail');
    f.subHeadingValue.leadingNewline = true;

    // NOTE: The workAreas object doesn't contain detail info in its zones lists.
    // Use zones list directly, even though we'll likely remove it in future.

    let missedZones = []; // Create a list of zones to be printed.

    // for (let workArea of workAreas) {
    //   let zones = workArea.zones;
      for (let zone of zones) {
        let details = zone.trades ? zone.trades : []; // zone.details is a list of trade details.
        for (let trade of details) {
         // HACK: 'Description' isn't meant to be in the zones field. Not sure how it got there but don't display it.
          if (trade.rowName !== undefined && trade.rowName !== null && trade.detail !== undefined && trade.detail !== null && trade.rowName !== 'Description') {
            missedZones.push(trade);
          }
        }
      }
    // }

    
    while (missedZones.length > 0) {
      let currentTrade = missedZones[missedZones.length - 1].rowName; // We keep track of the current one so we know what we're removing.
      this.addText(f, f.text, currentTrade); // Only set the trade name once for all values.
      
      for (let index = 0; index < missedZones.length; index++) {
        if (missedZones[index].rowName === currentTrade) {
          this.addText(f, f.textValue, missedZones[index].detail);
          missedZones.splice(index, 1);
        }
      }
    }

    f.document.save();
  }



  generateBusinessReport(businessDefaults: BusinessDefaults,
      projectSettings: ProjectSettings,
      zones: Zone[],
      workAreas: WorkArea[],
      imageData: any
  ): void {

    let f = this.getDefaultFormatter('YourQS Summary Report', 'YourQS Summary Report', imageData)


    // ----------------------------------------------------------------------------------------------------
    // Project Summary for QS

    this.addText(f, f.majorHeading, 'Project Summary for QS');
    this.addLine(f, f.lineStartX, f.lineEndX);

    f.heading.trailingNewline = false;
    f.headingValue.trailingNewline = true;
    this.addText(f, f.heading, 'Address');
    this.addText(f, f.headingValue, projectSettings.address);
    this.addText(f, f.heading, 'Client');
    this.addText(f, f.headingValue, projectSettings.client);
    f.heading.trailingNewline = true;
    f.headingValue.trailingNewline = true;

    // ----------------------------------------------------------------------------------------------------
    // Business Defaults

    f.majorHeading.trailingNewline = false;
    f.majorHeadingValue.leadingNewline = false;
    f.majorHeadingValue.trailingNewline = true;
    this.addText(f, f.majorHeading, '' + this.asString(businessDefaults.companyName) + ' Defaults');
    this.addText(f, f.majorHeadingValue, ''); // TODO: What field is this meant to be? The project name?
    this.addLine(f, f.lineStartX, f.lineEndX);
    f.majorHeading.trailingNewline = true;
    f.majorHeadingValue.trailingNewline = true;
    f.majorHeadingValue.leadingNewline = true;
    
    f.text.margin += 3;

    this.addText(f, f.text, 'Your Name');
    this.addText(f, f.textValue, businessDefaults.yourName);

    // --------------------------------------------------
    // People and Pricing

    this.addText(f, f.subHeading, 'People and Pricing');
    this.addLine(f, f.lineStartX, f.lineEndX);

    var peoplePricing = businessDefaults.peoplePricing;

    this.addText(f, f.text, 'Address');
    this.addText(f, f.textValue, this.asString(peoplePricing.markup) + '%');
    this.addText(f, f.text, 'Admin Hours');
    this.addText(f, f.textValue, this.asString(peoplePricing.adminHours) + 'Hrs / Week Rate $' + this.asString(peoplePricing.adminCPH) + ' Cost');
    this.addText(f, f.text, 'Supervision Hours');
    this.addText(f, f.textValue, this.asString(peoplePricing.supervisionHours) + 'Hrs / Week Rate $' + this.asString(peoplePricing.supervisionCPH) + ' Cost');
    this.addText(f, f.text, 'Project Management');
    this.addText(f, f.textValue, peoplePricing.projectMHours);
    this.addText(f, f.text, 'Building Team');
    this.addText(f, f.textValue, '$' + this.asString(peoplePricing.buildingTeamHours));
    this.addText(f, f.text, 'Site Sign');
    this.addText(f, f.textValue, businessDefaults.siteSign);

    // --------------------------------------------------
    // Sub Trades

    this.addText(f, f.subHeading, 'Sub Trades');
    // this.addLine(f, f.lineStartX, f.textValue.margin); // No line in example, might still be wanted.

    var subTrades = businessDefaults.subTrades;
    var jobRates = businessDefaults.jobRates;

    this.addText(f, f.text, 'Plasterboard labour by');
    this.addText(f, f.textValue, subTrades.plasterboardLabourBy);
    this.addText(f, f.text, 'Plasterboard Ceiling Default');
    this.addText(f, f.textValue, subTrades.plasterboardCeilingDefault);
    this.addText(f, f.text, 'Insulation');
    this.addText(f, f.textValue, subTrades.insulation);
    this.addText(f, f.text, 'Ceiling Battens');
    this.addText(f, f.textValue, subTrades.ceilingBattens);
    this.addText(f, f.text, 'Plumber');
    this.addText(f, f.textValue, '$' + this.asString(jobRates.plumber) + '/hr');
    this.addText(f, f.text, 'Electrician');
    this.addText(f, f.textValue, '$' + this.asString(jobRates.electrician) + '/hr');
    this.addText(f, f.text, 'Painter');
    this.addText(f, f.textValue, '$' + this.asString(jobRates.painter) + '/hr');
    this.addText(f, f.text, 'Drainlayer');
    this.addText(f, f.textValue, '$' + this.asString(jobRates.drainlayer) + '/hr');
    this.addText(f, f.text, 'Roofer');
    this.addText(f, f.textValue, '$' + this.asString(jobRates.roofer) + '/hr');

    // --------------------------------------------------
    // Project Defaults

    this.addText(f, f.heading, 'Project Defaults');
    this.addLine(f, f.lineStartX, f.lineEndX);

    // --------------------------------------------------
    // People and Pricing

    this.addText(f, f.subHeading, 'People and Pricing');
    this.addLine(f, f.lineStartX, f.textValue.margin);
    
    var people = projectSettings.peoplePricing;

    this.addText(f, f.text, 'No. Carpenters');
    this.addText(f, f.textValue, people.nCarpenters);
    this.addText(f, f.text, 'Estimated project duration');
    this.addText(f, f.textValue, '$' + this.asString(people.eProjectDuration));
    this.addText(f, f.text, 'Builders contingency');
    this.addText(f, f.textValue, '$' + this.asString(people.bContingency));
    this.addText(f, f.text, 'Drainage contingency');
    this.addText(f, f.textValue, '$' + this.asString(people.dContingency));
    this.addText(f, f.text, 'Plumbing contingency');
    this.addText(f, f.textValue, '$' + this.asString(people.pContingency));
    this.addText(f, f.text, 'Electrical contingency');
    this.addText(f, f.textValue, '$' + this.asString(people.eContingency));

    // --------------------------------------------------
    // Site Arrangement

    this.addText(f, f.subHeading, 'Site Arrangement');
    this.addLine(f, f.lineStartX, f.textValue.margin);

    var siteArrangement = projectSettings.siteArrangement;
    this.addText(f, f.text, 'Site Access');
    this.addText(f, f.textValue, siteArrangement.siteAccess);
    this.addText(f, f.text, 'Space for material storage');
    this.addText(f, f.textValue, siteArrangement.spaceStorage);
    this.addText(f, f.text, 'Scaffold access comment');
    this.addText(f, f.textValue, siteArrangement.scaffoldAComment);
    this.addText(f, f.text, 'Scaffold Wrapping');
    this.addText(f, f.textValue, siteArrangement.sWrapping);
    this.addText(f, f.text, 'Living Arrangements');
    this.addText(f, f.textValue, siteArrangement.livingArrange);
    this.addText(f, f.text, 'Allow additonal hours due to site');
    this.addText(f, f.textValue, siteArrangement.addHours);
    this.addText(f, f.text, 'Is Sea Spray Zone?');
    this.addText(f, f.textValue, siteArrangement.seasprayzone);

    // --------------------------------------------------
    // Safety Requirements

    this.addText(f, f.subHeading, 'Safety Requirements');
    this.addLine(f, f.lineStartX, f.textValue.margin);

    var safetyRequirements = projectSettings.safetyRequirements;
    this.addText(f, f.text, 'Site Security Fencing');
    this.addText(f, f.textValue, safetyRequirements.siteSecurityFencing);
    this.addText(f, f.text, 'Fall In Protection');
    this.addText(f, f.textValue, safetyRequirements.fallInProtection);
    this.addText(f, f.text, 'Toilet Hire Required');
    this.addText(f, f.textValue, safetyRequirements.toiletHireRequired);
    this.addText(f, f.text, 'Vehicle Crossing Protection');
    this.addText(f, f.textValue, safetyRequirements.vehicleCrossingProtect);

    // --------------------------------------------------
    // Allowances and Insurance

    this.addText(f, f.subHeading, 'Allowances and Insurance');
    this.addLine(f, f.lineStartX, f.textValue.margin);

    var allowancesInsurances = projectSettings.allowancesInsurances;
    this.addText(f, f.text, 'Contactors All Risk Fee');
    this.addText(f, f.textValue, allowancesInsurances.contractorsRiskFee);
    this.addText(f, f.text, 'Building Guarantee Fee');
    this.addText(f, f.textValue, allowancesInsurances.buildingGuaranteeFee);

    // ----------------------------------------------------------------------------------------------------
    // Professional Services

    this.addText(f, f.subHeading, 'Professional Services');
    this.addLine(f, f.lineStartX, f.textValue.margin);

    var professionalServices = projectSettings.professionalServices;
    this.addText(f, f.text, 'Drawings');
    this.addText(f, f.textValue, professionalServices.drawings);
    this.addText(f, f.text, 'Geotechical');
    this.addText(f, f.textValue, professionalServices.geotechnical);
    this.addText(f, f.text, 'Engineering');
    this.addText(f, f.textValue, professionalServices.engineering);
    this.addText(f, f.text, 'Land Surveyor');
    this.addText(f, f.textValue, professionalServices.landSurveyor);
    this.addText(f, f.text, 'Council Fees');
    this.addText(f, f.textValue, professionalServices.councilFees);
    this.addText(f, f.text, 'Other');
    this.addText(f, f.textValue, professionalServices.other);

    // --------------------------------------------------
    // Interior

    this.addText(f, f.subHeading, 'Interior');
    this.addLine(f, f.lineStartX, f.textValue.margin);

    var in_mat = projectSettings.interior.material;
    var in_sty = projectSettings.interior.style;
    this.addText(f, f.text, 'Doors');
    this.addText(f, f.textValue, this.asString(in_mat.doors) + ' ' + this.asString(in_sty.doors));
    this.addText(f, f.text, 'Skirting');
    this.addText(f, f.textValue, this.asString(in_mat.skirting) + ' ' + this.asString(in_sty.skirting));
    this.addText(f, f.text, 'Scotia/Cornice');
    this.addText(f, f.textValue, this.asString(in_mat.scotia) + ' ' + this.asString(in_sty.scotia));
    this.addText(f, f.text, 'Architrave');
    this.addText(f, f.textValue, this.asString(in_mat.architrave) + ' ' + this.asString(in_sty.architrave));

    // --------------------------------------------------
    // Exterior

    this.addText(f, f.subHeading, 'Exterior');
    this.addLine(f, f.lineStartX, f.textValue.margin);

    var ext_mat = projectSettings.exterior.material;
    var ext_typ = projectSettings.exterior.type;
    this.addText(f, f.text, 'Primary Cladding');
    this.addText(f, f.textValue, this.asString(ext_mat.primaryCladding) + ' ' + this.asString(ext_typ.primaryCladding));
    this.addText(f, f.text, 'Secondary Cladding');
    this.addText(f, f.textValue, this.asString(ext_mat.secondaryCladding) + ' ' + this.asString(ext_typ.secondaryCladding));
    this.addText(f, f.text, 'Joinery Type');
    this.addText(f, f.textValue, this.asString(ext_mat.joineryType) + ' ' + this.asString(ext_typ.joineryType));
    this.addText(f, f.text, 'Roof');
    this.addText(f, f.textValue, this.asString(ext_mat.roof) + ' ' + this.asString(ext_typ.roof));
    this.addText(f, f.text, 'Other Comments');
    this.addText(f, f.textValue, projectSettings.otherComments);

    // ----------------------------------------------------------------------------------------------------
    // Work Area Breakdown
    
    f.text.margin -= 3;

    this.addText(f, f.heading, 'Work Area Breakdown');
    this.addLine(f, f.lineStartX, f.lineEndX);

    for (let area of workAreas) {
      this.addText(f, f.text, area.name);
      this.addText(f, f.textValue, area.overview);
    }

    // ----------------------------------------------------------------------------------------------------
    // Summary By Trade

    this.addText(f, f.heading, 'Summary By Trade');
    this.addLine(f, f.lineStartX, f.lineEndX);

    f.subHeading.trailingNewline = false;
    this.addText(f, f.subHeading, 'Trade');
    f.subHeading.trailingNewline = true;
    f.subHeadingValue.leadingNewline = false;
    this.addText(f, f.subHeadingValue, 'Detail');
    f.subHeadingValue.leadingNewline = true;

    // NOTE: The workAreas object doesn't contain detail info in its zones lists.
    // Use zones list directly, even though we'll likely remove it in future.

    let missedZones = []; // Create a list of zones to be printed.

    // for (let workArea of workAreas) {
    //   let zones = workArea.zones;
      for (let zone of zones) {
        let details = zone.trades ? zone.trades : []; // zone.details is a list of trade details.
        for (let trade of details) {
         // HACK: 'Description' isn't meant to be in the zones field. Not sure how it got there but don't display it.
          if (trade.rowName !== undefined && trade.rowName !== null && trade.detail !== undefined && trade.detail !== null && trade.rowName !== 'Description') {
            missedZones.push(trade);
          }
        }
      }
    // }

    
    while (missedZones.length > 0) {
      let currentTrade = missedZones[missedZones.length - 1].rowName; // We keep track of the current one so we know what we're removing.
      this.addText(f, f.text, currentTrade); // Only set the trade name once for all values.
      
      for (let index = 0; index < missedZones.length; index++) {
        if (missedZones[index].rowName === currentTrade) {
          this.addText(f, f.textValue, missedZones[index].detail);
          missedZones.splice(index, 1);
        }
      }
    }

    f.document.save();
  }
}