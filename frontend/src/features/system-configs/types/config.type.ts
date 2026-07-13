export interface SystemConfig {
  id: number;
  configKey: string;
  configValue: string;
  description: string;
}

export interface SystemConfigRequest {
  configValue: string;
  description: string;
}

export interface SystemConfigListResponse {
  data: SystemConfig[];
}

export interface SystemConfigUpdateResponse {
  data: SystemConfig;
}
