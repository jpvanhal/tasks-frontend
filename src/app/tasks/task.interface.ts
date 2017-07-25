import { Record } from '@orbit/data';

export interface TaskAttributes {
  title: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface Task extends Record {
  type: 'task';
  attributes: TaskAttributes;
}
