/**
 * An interface for grouping up the form data along with an ID and a name
 */
export interface Project {
  id: number;
  projectName: string;
  businessDefaults: any;
  projectSettings: any;
  zones: any;
  workAreas: any;
}