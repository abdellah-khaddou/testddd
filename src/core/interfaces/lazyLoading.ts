export interface LazyLoadEvent {
    first?: number;
    rows?: number;
    sortField?: string;
    sortOrder?: number;
    multiSortMeta?: SortMeta[];
    filters?: {
        [s: string]: FilterMetadata;
    };
    globalFilter?: any;
}

export interface SortMeta {
    field: string;
    order: number;
}
export interface FilterMetadata {
    value?: any;
    matchMode?: string;
    operator?: string;
}
export declare class FilterMatchMode {
    static readonly STARTS_WITH = "startsWith";
    static readonly CONTAINS = "contains";
    static readonly NOT_CONTAINS = "notContains";
    static readonly ENDS_WITH = "endsWith";
    static readonly EQUALS = "equals";
    static readonly NOT_EQUALS = "notEquals";
    static readonly IN = "in";
    static readonly LESS_THAN = "lt";
    static readonly LESS_THAN_OR_EQUAL_TO = "lte";
    static readonly GREATER_THAN = "gt";
    static readonly GREATER_THAN_OR_EQUAL_TO = "gte";
    static readonly BETWEEN = "between";
    static readonly IS = "is";
    static readonly IS_NOT = "isNot";
    static readonly BEFORE = "before";
    static readonly AFTER = "after";
    static readonly DATE_IS = "dateIs";
    static readonly DATE_IS_NOT = "dateIsNot";
    static readonly DATE_BEFORE = "dateBefore";
    static readonly DATE_AFTER = "dateAfter";
}

export enum MatchString{
    STARTS_WITH = "startsWith",
    CONTAINS = "contains",
    NOT_CONTAINS = "notContains",
    ENDS_WITH = "endsWith",
    EQUALS = "equals",
    NOT_EQUALS = "notEquals",
    IN = "in",
    LESS_THAN = "lt",
    LESS_THAN_OR_EQUAL_TO = "lte",
    GREATER_THAN = "gt",
    GREATER_THAN_OR_EQUAL_TO = "gte",
    BETWEEN = "between",
    IS = "is",
    IS_NOT = "isNot",
    BEFORE = "before",
    AFTER = "after",
    DATE_IS = "dateIs",
    DATE_IS_NOT = "dateIsNot",
    DATE_BEFORE = "dateBefore",
    DATE_AFTER = "dateAfter",
 }

 export class FilterTable{

    constructor(){
  
    }
  
    returnRegEx(match,value){
  
        switch(match){
  
          case MatchString.STARTS_WITH              : {return {$regex: '^'+ value+'',$options: "i" } }
          case MatchString.CONTAINS                 : {return { $regex: '.*' + value + '.*',$options: "i"}}
          case MatchString.NOT_CONTAINS             : {return { $regex: '^((?!'+value+').)*$',$options: "i"} }
          case MatchString.ENDS_WITH                : {return {$regex: ''+ value+'$',$options: "i" } }
          case MatchString.EQUALS                   : {return {$eq:value} }
          case MatchString.NOT_EQUALS               : {return {$ne:value} }
          case MatchString.IN                       : {return {$in:value} }
          case MatchString.LESS_THAN                : {return {$lt:value} }
          case MatchString.LESS_THAN_OR_EQUAL_TO    : {return {$lte:value} }
          case MatchString.GREATER_THAN             : {return {$gt:value} }
          case MatchString.GREATER_THAN_OR_EQUAL_TO : {return {$gte:value} }
          case MatchString.BETWEEN                  : {return value }
          case MatchString.IS                       : {return  value }
          case MatchString.IS_NOT                   : {return {$not:{ $regex: '.*' + value + '.*',$options: "i"}} }
          case MatchString.BEFORE                   : {return {$lte:value}  }
          case MatchString.AFTER                    : {return {$gte:value} }
          case MatchString.DATE_IS                  : {
              let date = new Date(value)
              let datePlus = new Date(new Date().setDate(date.getDate()+1))
              let dateMoins = new Date(new Date().setDate(date.getDate()-1))
              return  {$lt:datePlus,$gt:dateMoins}
            }
          case MatchString.DATE_IS_NOT              : {
                let date = new Date(value)
                let datePlus = new Date(new Date().setDate(date.getDate()+1))
                let dateMoins = new Date(new Date().setDate(date.getDate()-1))
                return  {$not:{$lt:datePlus,$gt:dateMoins}}
            } 
          case MatchString.DATE_BEFORE              : { let date = new Date(value);return {$lte:date} }
          case MatchString.DATE_AFTER               : {let date = new Date(value);return {$gte:date} }
          default  :return null
        }
    }
  }
