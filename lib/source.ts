import { docs } from '@/.source/server';
import { loader } from 'fumadocs-core/source';

export const source = loader({
  baseUrl: '/docs',
  source: (docs as any).toFumadocsSource
    ? (docs as any).toFumadocsSource()
    : (docs as any),
});
