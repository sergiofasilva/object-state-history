export = ObjectStateHistory;
declare class ObjectStateHistory {
    static "__#1@#buildItem"(item: any, operation?: string): {
        timestamp: number;
        operation: string;
        data: any;
    };
    static "__#1@#getFreezedClonedObject"(obj: any): any;
    constructor(object: any);
    valueOf(): any;
    toString(): string;
    get value(): any;
    merge(data: any): any;
    replace(data: any): any;
    list(): any;
    at(index?: number): any;
    #private;
}
