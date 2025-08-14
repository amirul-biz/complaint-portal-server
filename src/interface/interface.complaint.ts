// Create complain

export interface ICreateComplaintRequest {
  title: string;
  description: string;
  userId: string;
  statusId: string;
  priorityId: string;
}
