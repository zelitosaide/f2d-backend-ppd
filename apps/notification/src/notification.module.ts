import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { EventsGateway } from "./events/events.gateway";
import { TrackingService } from "./events/tracking.service";
import { CacheModule } from "@nestjs/cache-manager";
import { Keyv } from "keyv";
import KeyvRedis from "@keyv/redis";
import { KeyvCacheableMemory } from "cacheable";

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          stores: [
            new KeyvRedis("redis://redis:6379"),
            new Keyv({
              store: new KeyvCacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
          ],
        };
      },
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, EventsGateway, TrackingService],
})
export class NotificationModule {}
