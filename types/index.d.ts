export = ObjectStateHistory;
declare class ObjectStateHistory {
    static "__#1@#buildListItem"(data: any, operation?: "merge"): {
        timestamp: number;
        operation: "merge";
        data: any;
    };
    static "__#1@#getFreezedClonedObject"(obj: any): any;
    constructor(object?: objectj, history?: any, options?: { limit?: string; lastStatesToKeep?: number });
    get value(): any;
    valueOf(): any;
    at(index?: number): any;
    merge(data: any): any;
    replace(data: any): any;
    list(): any;
    info(): {
        options: {};
        list: any;
        value: any;
    };
    toString(): string;
    #private;
}
