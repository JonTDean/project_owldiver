export interface ActionResult {
  type: 'success' | 'failure' | 'redirect';
  data?: {
    message?: string;
    url?: string;
  };
} 