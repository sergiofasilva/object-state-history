import { EventEmitter } from 'node:events';
import util from 'node:util';
type OperationType = 'delete' | 'replace' | 'merge';
interface ListItem {
    timestamp: number;
    operation: OperationType;
    data: any;
    value?: any;
}
interface ObjectStateHistoryOptions {
    limit?: number;
    lastStatesToKeep?: number;
}
declare class ObjectStateHistory extends EventEmitter {
    #private;
    constructor(object?: Record<string, any> | null, history?: ListItem[] | null, options?: ObjectStateHistoryOptions);
    get value(): any;
    get length(): number;
    valueOf(): any;
    at(index?: number): any;
    merge(data: Record<string, any>): any;
    replace(data: Record<string, any>): any;
    list(): ListItem[];
    info(): {
        options: {
            limit: number;
            lastStatesToKeep: number;
        };
        list: ListItem[];
        value: any;
    };
    [util.inspect.custom](depth: number, options: any, inspect: any): string;
    toString(): string;
}
export { ObjectStateHistory };
export default ObjectStateHistory;
