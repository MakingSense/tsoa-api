export interface IPaginationModel { /** tsoa doesn't like generics */
  count: number;
  page: number;
  limit: number;
  totalPages: number;
  docs: any[];
}

export class PaginationModel implements IPaginationModel {
  public count: number;
  public page: number;
  public limit: number;
  public totalPages: number;
  public docs: any[];

  constructor(args: IPaginationModel) {
    Object.assign(this, args);
  }
}
