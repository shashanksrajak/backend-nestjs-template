import { Injectable } from '@nestjs/common';

interface AwsConfig {
  AWS_DEFAULT_REGION: string;
  AWS_S3_BUCKET_REGION: string;
  TEMPORARY_UPLOAD_BUCKET: string;
  MEDIA_BUCKET: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_SCHEDULER_ROLE_ARN: string;
  AWS_SQS_ASYNC_TASK_QUEUE_ARN: string;
  ASSETS_DOMAIN_URL: string;
  BUNNY_ACCESS_KEY: string;
  BUNNY_LIBRARY_ID: string;
  BUNNY_GALLERY_CDN_URL: string;
  KC_API_CLIENT_SECRET: string;
  KC_API_CLIENT_ID: string;
  AWS_SQS_ASYNC_TASK_QUEUE: string;
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  RAZORPAY_WEBHOOK_SECRET: string;
  GALLERY_PLAN_GRACE_PERIOD: number;
}

interface KeycloakConfig {
  KEYCLOAK_BASE_URL?: string;
  KEYCLOAK_MEMBER_REALM: string;
  KEYCLOAK_ADMIN_REALM: string;
}

interface RazorpayConfig {
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  RAZORPAY_WEBHOOK_SECRET: string;
}

export interface Configs extends AwsConfig, KeycloakConfig, RazorpayConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
}

@Injectable()
export class ConfigsService {
  private config: Configs;

  constructor() {
    this.loadFromEnv();
  }

  public loadFromEnv() {
    this.config = this.parseConfigFromEnv(process.env);
  }

  private parseConfigFromEnv(env: NodeJS.ProcessEnv): Configs {
    return {
      // NODE_ENV: env.NODE_ENV || 'dev',
      NODE_ENV: env.NODE_ENV,
      PORT: parseInt(env.PORT) || 3000,
      DATABASE_URL: env.DATABASE_URL,
      AWS_DEFAULT_REGION: env.AWS_DEFAULT_REGION || 'ap-south-1',
      AWS_S3_BUCKET_REGION: env.AWS_S3_BUCKET_REGION,
      TEMPORARY_UPLOAD_BUCKET: env.TEMPORARY_UPLOAD_BUCKET,
      MEDIA_BUCKET: env.MEDIA_BUCKET,
      AWS_ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: env.AWS_SECRET_ACCESS_KEY,
      ASSETS_DOMAIN_URL: env.ASSETS_DOMAIN_URL,
      AWS_SCHEDULER_ROLE_ARN: env.EVENT_BRIDGE_SCHEDULER_ROLE,
      KEYCLOAK_ADMIN_REALM: env.KEYCLOAK_ADMIN_REALM,
      KEYCLOAK_MEMBER_REALM: env.KEYCLOAK_MEMBER_REALM,
      KEYCLOAK_BASE_URL: env.KEYCLOAK_BASE_URL,
      BUNNY_ACCESS_KEY: env.BUNNY_ACCESS_KEY,
      BUNNY_LIBRARY_ID: env.BUNNY_LIBRARY_ID,
      BUNNY_GALLERY_CDN_URL: env.BUNNY_GALLERY_CDN_URL,
      KC_API_CLIENT_ID: env.KC_API_CLIENT_ID,
      KC_API_CLIENT_SECRET: env.KC_API_CLIENT_SECRET,
      AWS_SQS_ASYNC_TASK_QUEUE_ARN: env.ASYNC_TASK_QUEUE_ARN,
      // AWS_SQS_ASYNC_TASK_QUEUE:
      //   'https://sqs.ap-south-1.amazonaws.com/566002952798/test' ||
      //   'https://sqs.ap-south-1.amazonaws.com/818741528489/tgp-prod-async-task',
      AWS_SQS_ASYNC_TASK_QUEUE: env.ASYNC_TASK_QUEUE_URL,
      RAZORPAY_KEY_ID: env.RAZORPAY_KEY_ID,
      RAZORPAY_KEY_SECRET: env.RAZORPAY_KEY_SECRET,
      RAZORPAY_WEBHOOK_SECRET: env.RAZORPAY_WEBHOOK_SECRET,
      GALLERY_PLAN_GRACE_PERIOD: Number(env.GALLERY_PLAN_GRACE_PERIOD) || 7,
    };
  }

  public get(): Readonly<Configs> {
    return this.config;
  }
}
