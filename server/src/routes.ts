import { Router } from 'express';
import { createLinkHandler } from './modules/links/links.controller';
import { redirectHandler } from './modules/redirect/redirect.controller';
import { clicksPerDayHandler, clicksPerDeviceHandler } from './modules/analytics/analytics.controller';

export const router = Router();

router.post('/links', createLinkHandler);
router.get('/links/:slug/clicks-per-day', clicksPerDayHandler);
router.get('/links/:slug/clicks-per-device', clicksPerDeviceHandler);
router.get('/:slug', redirectHandler);