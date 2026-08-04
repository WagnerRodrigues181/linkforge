import { Router } from 'express';
import { createLinkHandler } from './modules/links/links.controller';
import { redirectHandler } from './modules/redirect/redirect.controller';

export const router = Router();

router.post('/links', createLinkHandler);
router.get('/:slug', redirectHandler);