import { IsInt, IsString, Max, Min } from "class-validator";
import { ValidationErrors } from "./ValidationErrors";

export interface ResponseDataWithPaginator<T = any[]> {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: T[];
}

export type PaginatorOptions = Pick<
    ResponseDataWithPaginator,
    "page" | "pageSize"
>;

export class Paginator extends ValidationErrors {
    @IsString()
    SearchNameTerm: string = "";

    @IsInt()
    @Min(1)
    PageNumber: number = 1;

    @IsInt()
    @Min(0)
    @Max(100)
    PageSize: number = 10;

    constructor({
        PageNumber,
        PageSize,
        SearchNameTerm,
    }: {
        [key: string]: any;
    }) {
        super();

        if (typeof PageNumber === "string") {
            this.PageNumber = +PageNumber;
        }

        if (Array.isArray(PageNumber) && PageNumber[0]) {
            this.PageNumber = +PageNumber[0];
        }

        if (typeof PageSize === "string") {
            this.PageSize = +PageSize;
        }

        if (Array.isArray(PageSize) && PageSize[0]) {
            this.PageSize = +PageSize[0];
        }

        if (SearchNameTerm && typeof SearchNameTerm === "string") {
            this.SearchNameTerm = SearchNameTerm;
        }

        if (
            SearchNameTerm &&
            Array.isArray(SearchNameTerm) &&
            SearchNameTerm[0]
        ) {
            this.SearchNameTerm = SearchNameTerm[0];
        }
    }
}
