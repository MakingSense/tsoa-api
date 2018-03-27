export class PaginationModel { /** tsoa doesn't like generics */
  public count: number;
  public pageNumber: number;
  public perPage: number;
  public list: any[];

  constructor(args: PaginationModel) {
    Object.assign(this, args);
  }
}
