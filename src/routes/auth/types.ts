export interface ActionResult {
  type: 'success' | 'failure';
  data?: {
    message: string;
  };
} 