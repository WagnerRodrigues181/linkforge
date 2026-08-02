import { Router } from 'express';
import { createLinkHandler } from './modules/links/links.controller';

export const router = Router();

router.post('/links', createLinkHandler);
