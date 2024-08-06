import { Module } from '@nestjs/common';
import { CounselorService } from './counselor/counselor.service';
import { CounseleeService } from './counselee/counselee.service';
import { CounselorController } from './counselor/counselor.controller';
import { CounseleeController } from './counselee/counselee.controller';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Counselee } from './Entities/Counselee.entity';
import { Counselor } from './Entities/Counselor.entity';
import { CounselorproviderService } from './counselorprovider/counselorprovider.service';
import { CounselorproviderController } from './counselorprovider/counselorprovider.controller';
import { CounselorProviderEntity } from './Entities/CounselorProvider.entity';
import { Course } from './Entities/Course.entity';
import { ScheduledSession } from './Entities/ScheduledSession.entity';
import { Attendance } from './Entities/Attendance.entity';
import { SessionService } from './session/session.service';
import { SessionController } from './session/session.controller';
import { CourseService } from './course/course.service';
import { CourseController } from './course/course.controller';
import { ActivityService } from './activity/activity.service';
import { ActivityController } from './activity/activity.controller';
import { Activities } from './Entities/Activities.entity';
import { CounseleeActivityService } from './counselee-activity/counselee-activity.service';
import { CounseleeActivityController } from './counselee-activity/counselee-activity.controller';
import { counseleeActivity } from './Entities/CounseleeActivity.entity';
import { SadhanaForm } from './Entities/SadhanaForm.entity';
import { SadhanaService } from './sadhana/sadhana.service';
import { SadhanaController } from './sadhana/sadhana.controller';
import { CounseleeSadhanaService } from './counselee-sadhana/counselee-sadhana.service';
import { CounseleeSadhanaController } from './counselee-sadhana/counselee-sadhana.controller';
import { CounseleeAttendanceService } from './counselee-attendance/counselee-attendance.service';
import { CounseleeAttendanceController } from './counselee-attendance/counselee-attendance.controller';
import { SadhanaConfigure } from './Entities/SadhanaConfigure.entity';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { EmailServiceService } from './email-service/email-service.service';

import { CbmMeetingsService } from './cbm-meetings/cbm-meetings.service';
import { CbmMeetingsController } from './cbm-meetings/cbm-meetings.controller';
import { CBMMeeting } from './Entities/CBMMeetings.entity';
import { CbmattendanceService } from './cbmattendance/cbmattendance.service';
import { CbmattendanceController } from './cbmattendance/cbmattendance.controller';
import { CBMAttendance } from './Entities/CBMAttendance.entity';
import { CbmSevaService } from './cbm-seva/cbm-seva.service';
import { CbmSevaController } from './cbm-seva/cbm-seva.controller';
import { CBMSeva } from './Entities/CBMSeva.entity';
import { PlanningrelocateService } from './planningrelocate/planningrelocate.service';
import { PlanningrelocateController } from './planningrelocate/planningrelocate.controller';
import { PlanningRelocateEntity } from './Entities/PlanningRelocate.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE'),
        entities: [
          Counselor,
          Counselee,
          CounselorProviderEntity,
          Activities,
          SadhanaForm,
          CBMMeeting,
          CBMSeva,
          CBMAttendance,
          SadhanaConfigure,
          counseleeActivity,
          PlanningRelocateEntity,
          Course,
          ScheduledSession,
          Attendance,
        ],
        synchronize: true,
        ssl: {
          rejectUnauthorized: true,
          ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUHCfrMablmJ4GONhNraMp2bD/HlwwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvOGJlMWIyMDUtOTI1Yi00MjMzLTk3OWUtODJhNjY3MGFj
YjI2IFByb2plY3QgQ0EwHhcNMjQwNTEzMTMzMTM4WhcNMzQwNTExMTMzMTM4WjA6
MTgwNgYDVQQDDC84YmUxYjIwNS05MjViLTQyMzMtOTc5ZS04MmE2NjcwYWNiMjYg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBANJKIgBt
AtJ3k8YY/WnKAA8SYRl9qAZKG+ExnanYDZPOS69fBVGzGFpv/2YTzYE2u6RvwZaX
d82rzQwSGRH4BpJEk+dPOhjkgAw8BZ6Zd2ckXQvuKkHlgRSxqrWQbD/Tm2ZYGmGt
tdNqwlm43CAsyd4AtKRoAa07KvMy9uvsVZeOhmO8ENX2THoGeM18IniArh8MDQXC
VG62sGQKXuPn4Ftd3FT5JdP9BWPWtSpaw1wum8U+Xpsb3nQUsxor8YpBIhNbZRfW
UKXW+tKnAYMP3nucHQJFm6RMDPCQ/Q0vFecW1ruGmFdLe08rYa9jKK7AJc2RrY1H
r66FE8077fqnT3XoT/7wmYvtGCntCQFaVxLrrSGjCEQYRp1nhw5kZ9CW+KPBqOMP
Dy6VyDx5lRVeJ+eMixBgnvDJhlDgWDqdeBdxgVtjhR0n0Sj6rYbSQf/Qslyv8KPY
gCln6ax/2g2aBM5/MJLsh/Z1uhd6oI+td/Tqq2mlCphF3JOpLRFYjSiLYwIDAQAB
oz8wPTAdBgNVHQ4EFgQUJcacXMxOdUo6+ykmHJgfhkmqqNowDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAKFfiaF8Y++lshZM
KYd/NrSxc9EAkiwSUQOMJWFrrLMB/WR2DqASn9dZGxA9Q11FRekRzAthczN0vEeH
GyTsJb01C4scqx8Ynhje1nE0+auoHZUBVELQb7nBcV9M4AUbUpvANUxFxwzhvGwo
W6FJloo8QRB3wtpKBWyaIE5Z6eX3h9eHZxH7C+pKmoTKsCj2Lmuj+t1EbgzprrsF
WnfXaPIRLsl4riKcbxX4/UUBTcBh4Fj1wWNoNRTd3tfIM7/0PWRvthl8AR5a550J
rQZGPhihlKoZTG3znsvnaBYX0P4iX8w+G5Qtl3FuZ0FbDjiKgodjsywIh1ByFabW
t2snnUrY61Y/672hAYj7h9sP6dfW+Xn0YtOrL9zE9b52LEYz3JUr1B2PASZaLCJU
HU/u9OFEIFNkcLBlBr1fHfycszY/GkH6ahPoKV/LjcRiBSHxE/MNIzwLzsG4xSnV
I0zDRkgS7DfnFcUCBFQHAOhreUocOlI/dYK9AnIwhs3aFT7PBA==
-----END CERTIFICATE-----`,
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      Counselor,
      Counselee,
      CounselorProviderEntity,
      Activities,
      SadhanaForm,
      CBMMeeting,
      CBMAttendance,
      CBMSeva,
      SadhanaConfigure,
      PlanningRelocateEntity,
      counseleeActivity,
      Course,
      ScheduledSession,
      Attendance,
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
  ],
  controllers: [
    CounselorController,
    CounseleeController,
    CounselorproviderController,
    SessionController,
    CourseController,
    ActivityController,
    CounseleeActivityController,
    CounseleeSadhanaController,
    SadhanaController,
    CounseleeAttendanceController,
    AuthController,
    CbmMeetingsController,
    CbmattendanceController,
    CbmSevaController,
    PlanningrelocateController,
  ],
  providers: [
    CounselorService,
    CounseleeService,
    CounselorproviderService,
    SessionService,
    CourseService,
    ActivityService,
    CounseleeActivityService,
    CounseleeSadhanaService,
    SadhanaService,
    CounseleeAttendanceService,
    AuthService,
    EmailServiceService,
    CbmMeetingsService,
    CbmattendanceService,
    CbmSevaService,
    PlanningrelocateService,
  ],
})
export class AppModule {}
