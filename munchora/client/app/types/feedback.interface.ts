export interface IFeedback {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  created_at: string; // In format ISO 8601
  updated_at: Date;
}
