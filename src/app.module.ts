import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigsModule } from './configs/configs.module';
import { ConfigsService } from './configs/configs.service';
import { GraphQLError } from 'graphql/error';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigsModule],
      useFactory: async (configsService: ConfigsService) => ({
        uri: configsService.get().DATABASE_URL,
      }),
      inject: [ConfigsService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req }) => {
        // console.log(req);
        return req;
        // console.log('hi from context');
      },
      formatError(error: GraphQLError) {
        const graphQLFormattedError = {
          message: error.message,
          code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
        };
        return graphQLFormattedError;
      },
    }),
    UsersModule,
    AuthModule,
    ConfigModule,
    ConfigsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
