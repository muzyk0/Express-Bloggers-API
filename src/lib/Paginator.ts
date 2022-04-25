import { IsInt, IsString, Max, Min, MinLength } from "class-validator";
import { ValidationErrors } from "./ValidationErrors";

export interface ResponseDataWithPaginator<T = any[]> {
    pagesCount: number;
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    items: T[];
}

export type PaginatorOptions = Pick<
    ResponseDataWithPaginator,
    "pageNumber" | "pageSize"
>;

export class Paginator extends ValidationErrors {
    @IsString()
    searchNameTerm: string = "";

    @IsInt()
    @Min(0)
    pageNumber: number = 0;

    @IsInt()
    @Min(0)
    @Max(100)
    pageSize: number = 10;

    constructor({
        pageNumber,
        pageSize,
        searchNameTerm,
    }: {
        [key: string]: any;
    }) {
        super();

        if (typeof pageNumber === "string") {
            this.pageNumber = +pageNumber;
        }

        if (Array.isArray(pageNumber) && pageNumber[0]) {
            this.pageNumber = +pageNumber[0];
        }

        if (typeof pageSize === "string") {
            this.pageSize = +pageSize;
        }

        if (Array.isArray(pageSize) && pageSize[0]) {
            this.pageSize = +pageSize[0];
        }

        if (typeof searchNameTerm === "string") {
            this.searchNameTerm = searchNameTerm;
        }

        if (Array.isArray(searchNameTerm) && searchNameTerm[0]) {
            this.searchNameTerm = searchNameTerm[0];
        }
    }
}
