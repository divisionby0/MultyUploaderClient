import {Subject} from "rxjs";

export interface IUserMedia{
  getId():number;
  getType():number;

  getUploadProgressSubject():Subject<number>;

  getPreview():string;
  setPreviewUrl(previewUrl:string);
  getPreviewChangedSubject():Subject<string>;

  getStillImageUrl():string;
  getDate():Date;
  getDuration():number;
  getDurationChangedSubject():Subject<number>;

  getCost():number;
  getCostChangedSubject():Subject<number>;

  getState():string;
  getStateChangedSubject():Subject<string>;

  getSelectedChangedSubject():Subject<boolean>;
  isSelected():boolean;

  getTotalPurchasesChangedSubject():Subject<number>;
  getTotalPurchases():number;

  getLeadsActionsChangedSubject():Subject<any>;
}
