import { IsInt, IsString, Max, Min, MinLength } from "class-validator";
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
    searchNameTerm: string = "";

    @IsInt()
    @Min(0)
    PageNumber: number = 1;

    @IsInt()
    @Min(0)
    @Max(100)
    PageSize: number = 10;

    constructor({
        PageNumber,
        PageSize,
        searchNameTerm,
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

        if (typeof searchNameTerm === "string") {
            this.searchNameTerm = searchNameTerm;
        }

        if (Array.isArray(searchNameTerm) && searchNameTerm[0]) {
            this.searchNameTerm = searchNameTerm[0];
        }
    }
}
