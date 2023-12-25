import { Entity } from '@loopback/repository';
export declare class Task extends Entity {
    id?: number;
    name: string;
    complete: boolean;
    constructor(data?: Partial<Task>);
}
export interface TaskRelations {
}
export type TaskWithRelations = Task & TaskRelations;
