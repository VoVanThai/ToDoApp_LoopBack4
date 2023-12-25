import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { Task } from '../models';
import { TaskRepository } from '../repositories';
export declare class TaskController {
    taskRepository: TaskRepository;
    constructor(taskRepository: TaskRepository);
    create(task: Omit<Task, 'id'>): Promise<Task>;
    count(where?: Where<Task>): Promise<Count>;
    find(filter?: Filter<Task>): Promise<Task[]>;
    updateAll(task: Task, where?: Where<Task>): Promise<Count>;
    findById(id: number, filter?: FilterExcludingWhere<Task>): Promise<Task>;
    updateById(id: number, task: Task): Promise<void>;
    replaceById(id: number, task: Task): Promise<void>;
    deleteById(id: number): Promise<void>;
}
